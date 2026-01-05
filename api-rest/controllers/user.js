// Importar dependencias y modulos
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

// Importar modelos
const User = require("../models/user.js");
const Follow = require("../models/follow.js");
const Publication = require("../models/publication.js");

// Importar servicios
const jwt = require("../services/jwt.js");
const followService = require("../services/followService.js");

// Acciones de prueba
const pruebaUser = (req, res) => {
  res.status(200).send({
    message: "Mensaje enviado desde el controlador: controllers/user.js",
    usuario: req.user,
  });
};

// Registro de usuario
const register = async (req, res) => {
  //Recoger datos de la peticion
  const params = req.body;

  // Comprobar que me llegan bien (+validacion)
  if (!params.name || !params.email || !params.password || !params.nick) {
    return res.status(400).json({
      message: "Faltan datos por enviar",
      status: "error",
    });
  }

  // Control usuarios duplicados
  const duplicatedUsers = await User.find({
    $or: [{ email: params.email }, { nick: params.nick }],
  });

  if (duplicatedUsers.length > 0) {
    return res.status(409).send({
      status: "error",
      message: "El usuario ya existe",
    });
  }

  // Cifrar contraseña
  try {
    params.password = await bcrypt.hash(params.password, 10);
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: "Error al encriptar la contraseña",
    });
  }

  // Crear objeto de usuario
  const userToSave = new User(params);

  // Guardar usuario en la base de datos
  try {
    const userStored = await userToSave.save();

    if (userStored) {
      return res.status(201).json({
        message: "Usuario registrado correctamente",
        status: "success",
        user: userStored,
      });
    } else {
      throw new Error();
    }
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error al guardar el usuario en la base de datos",
    });
  }
};

const login = async (req, res) => {
  // Recoger parametros body
  const params = req.body;

  if (!params.email && !params.password) {
    return res.status(400).json({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }

  // Buscar en la base de datos si existe
  const user = await User.findOne({ email: params.email });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "No se ha encontrado el usuario",
    });
  }

  // Comprobar su contraseña
  const pwd = bcrypt.compareSync(params.password, user.password);

  if (!pwd) {
    return res.status(400).json({
      status: "error",
      message: "Contraseña incorrecta",
    });
  }

  // Conseguir token
  const token = jwt.createToken(user);

  // Devolver datos del usuario
  return res.status(200).json({
    status: "success",
    message: "Login correcto",
    user: {
      _id: user._id,
      name: user.name,
      nick: user.nick,
    },
    token,
  });
};

const profile = async (req, res) => {
  // Recibir el parámetro del id de usuario por la url
  const id = req.params.id;

  // Consulta para sacar los datos del usuario
  try {
    const userProfile = await User.findById(id, "-password -role");

    if (!userProfile) {
      return res.status(404).send({
        status: "error",
        message: "El usuario no ha sido encontrado",
      });
    }

    // Info de seguimiento
    const followInfo = await followService.followThisUser(req.user.id, id);

    // Devolver el resultado
    // TODO: Devolver informacion de follows
    return res.status(200).json({
      status: "success",
      user: userProfile,
      following: followInfo.following,
      follower: followInfo.follower,
    });
  } catch (err) {
    return res.status(404).send({
      status: "error",
      message: "Error al buscar el usuario",
    });
  }
};

const list = async (req, res) => {
  // Controlar en que pagina estamos
  const page = parseInt(req.params.page) || 1;

  const itemsPerPage = 5;

  try {
    // Consulta con mongoose paginate
    const {
      docs: users,
      totalDocs: totalUsers,
      totalPages,
    } = await User.paginate(
      {},
      {
        page,
        limit: itemsPerPage,
        sort: "_id",
        select: "-password -role -email -__v",
      }
    );

    const followUserIds = await followService.followUserIds(req.user.id);

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      page,
      users,
      itemsPerPage,
      totalUsers,
      totalPages,
      user_following: followUserIds.following,
      user_follow_me: followUserIds.followers,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al buscar los usuarios en la base de datos",
    });
  }
};

const update = async (req, res) => {
  // Recoger info del usuario a actualizar
  let userIdentity = req.user;
  const userToUpdate = req.body;

  if (!userToUpdate) {
    return res.status(400).json({
      status: "error",
      message: "No se enviaron datos para actualizar",
    });
  }

  // Eliminar campos sobrantes
  delete userIdentity.iat;
  delete userIdentity.exp;
  delete userIdentity.role;
  delete userIdentity.image;

  // Comprobar si se quiere actualizar a un email o nick que ya existe
  let conditions = [];
  if (userToUpdate.email) {
    conditions.push({ email: userToUpdate.email });
  }
  if (userToUpdate.nick) {
    conditions.push({ nick: userToUpdate.nick });
  }

  let duplicatedUsers = [];

  if (conditions.length > 0) {
    duplicatedUsers = await User.find({
      $or: conditions,
    });

    let userIsset = false;
    duplicatedUsers.forEach((user) => {
      if (user && user._id != userIdentity.id) {
        userIsset = true;
      }
    });

    if (userIsset) {
      return res.status(400).json({
        status: "error",
        message: "El email o nick ya está registrado",
      });
    }
  }

  // Si me llega la password cifrarla
  if (userToUpdate.password) {
    try {
      userToUpdate.password = await bcrypt.hash(userToUpdate.password, 10);
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "Error al encriptar la contraseña",
      });
    }
  } else {
    delete userToUpdate.password;
  }

  // Buscar y actualizar
  try {
    const userUpdated = await User.findByIdAndUpdate(
      { _id: userIdentity.id },
      userToUpdate,
      { new: true }
    );

    if (userUpdated) {
      return res.status(200).json({
        status: "success",
        userUpdated,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Error al actualizar o usuario no encontrado",
    });
  }
};

const upload = async (req, res) => {
  // Recoger el fichero de imagen y comprobar que existe
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "Peticion no incluye la imagen",
    });
  }

  // Conseguir nombre del archivo
  const image = req.file.originalname;

  // Sacar la extensión del archivo
  const imagesSplit = image.split(".");
  const extension = imagesSplit[1];

  // Comprobar extensión
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // Borrar archivo subido
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).json({
      status: "error",
      message: "Extensión del fichero invalida",
    });
  }

  // Si lo es, guardar imagen en base de datos
  try {
    const userUpdated = await User.findOneAndUpdate(
      { _id: req.user.id },
      { image: req.file.filename },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      user: userUpdated,
      file: req.file,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Error en la subida de avatar",
    });
  }
};

const avatar = async (req, res) => {
  // Sacar el parametro de la url
  const file = req.params.file;

  // Montar el path real de la imagen
  const filePath = "./uploads/avatars/" + file;

  // Comprobar que existe
  fs.stat(filePath, (error) => {
    if (error) {
      return res.status(404).json({
        status: "error",
        message: "No existe la image",
      });
    }

    // Devolver un file
    return res.sendFile(path.resolve(filePath));
  });
};

const counters = async (req, res) => {
  const userId = req.params.id || req.user.id;


  try {
    const following = await Follow.countDocuments({ user: userId });
    const followed = await Follow.countDocuments({ followed: userId });
    const publications = await Publication.countDocuments({ user: userId });

    return res.status(200).json({
      status: "success",
      userId,
      following,
      followed,
      publications,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Error en los contadores",
      error,
      userId
    });
  }
};

// Exportar funciones
module.exports = {
  pruebaUser,
  register,
  login,
  profile,
  list,
  update,
  upload,
  avatar,
  counters
};
