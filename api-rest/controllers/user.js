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

// Registro de usuario
const register = async (req, res) => {
  //Recoger datos de la peticion
  const params = req.body;

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

  // Buscar en la base de datos si existe
  const user = await User.findOne({
    $or: [{ email: params.email }, { nick: params.email }],
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Usuario incorrecto",
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
      image: user.image,
    },
    token,
  });
};

const profile = async (req, res) => {
  // Recibir el parámetro del id de usuario por la url
  const id = req.params.id;

  // Consulta para sacar los datos del usuario
  try {
    const userProfile = await User.findById(id, "-password -role -email -__v");

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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const followsIds = await followService.followsIds(req.user.id);

    // Consulta con mongoose paginate
    const result = await User.paginate(
      {
        _id: { $ne: req.user.id },
      },
      {
        page,
        limit,
        sort: "_id",
        select: "-password -role -email -__v",
      }
    );

    // Agrega informacion de follows
    const usersWithFollowInfo = followService.addFollowInfo(result.docs, followsIds);

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      page,
      limit,
      totalUsers: result.totalDocs,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      users: usersWithFollowInfo,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Usuarios no encontrados",
    });
  }
};

const listFollowers = async (req, res) => {
  const userId = req.params.id || req.user.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  try {
    const followsIds = await followService.followsIds(userId);

    const result = await User.paginate(
      { _id: followsIds.followers },
      { page, limit, select: "-password -role -email -__v" }
    );

    // Indica si el usuario te sigue y si lo sigues
    const usersWithFollowInfo = followService.addFollowInfo(result.docs, followsIds);

    return res.status(200).json({
      status: "success",
      page,
      limit,
      totalUsers: result.totalDocs,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      users: usersWithFollowInfo,
    });
  } catch {
    return res.status(400).json({
      status: "error",
      message: "Usuario no encontrado",
    });
  }
};

const listFollowing = async (req, res) => {
  const userId = req.params.id || req.user.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  try {
    const followsIds = await followService.followsIds(userId);

    const result = await User.paginate(
      { _id: followsIds.following },
      { page, limit, select: "-password -role -email -__v" }
    );

    // Indica si el usuario te sigue y si lo sigues
    const usersWithFollowInfo = followService.addFollowInfo(result.docs, followsIds);

    return res.status(200).json({
      status: "success",
      page,
      limit,
      totalUsers: result.totalDocs,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      users: usersWithFollowInfo,
    });
  } catch {
    return res.status(400).json({
      status: "error",
      message: "Usuario no encontrado",
    });
  }
};

const update = async (req, res) => {
  // Recoger info del usuario a actualizar
  let userIdentity = req.user;
  const userToUpdate = req.body;

  // Comprobar si se quiere actualizar a un email o nick que ya existe
  let conditions = [];
  if (userToUpdate.email) {
    conditions.push({ email: userToUpdate.email });
  }
  if (userToUpdate.nick) {
    conditions.push({ nick: userToUpdate.nick });
  }

  if (conditions.length > 0) {
    const duplicatedUsers = await User.find({ $or: conditions });

    let userIsset = false;
    duplicatedUsers.forEach((user) => {
      if (user && user._id != userIdentity.id) {
        userIsset = true;
      }
    });

    if (userIsset) {
      return res.status(400).json({
        status: "error",
        message: "El nick ya está en uso",
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
      { new: true, select: "-password -role -__v -email" }
    );

    if (userUpdated) {
      return res.status(200).json({
        status: "success",
        message: "Actualizado con éxito",
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
  const extension = image.split(".").pop().toLowerCase();

  // Comprobar extensión
  if (!["png", "jpg", "jpeg", "gif"].includes(extension)) {
    // Borrar archivo subido
    fs.unlinkSync(req.file.path);
    return res.status(400).json({
      status: "error",
      message: "Extensión del fichero invalida",
    });
  }

  // Si lo es, guardar imagen en base de datos
  try {
    const user = await User.findById(req.user.id, "image");

    const userUpdated = await User.findOneAndUpdate(
      { _id: req.user.id },
      { image: req.file.filename },
      { new: true, select: "-password -role -__v -email" }
    );

    // Eliminar fichero de avatar anterior si es que tiene
    const prevAvatarPath =
      user.image !== "default.png" &&
      path.join("uploads", "avatars", user.image);

    if (prevAvatarPath && fs.existsSync(prevAvatarPath)) {
      fs.unlinkSync(prevAvatarPath);
    }

    return res.status(200).json({
      status: "success",
      user: userUpdated,
      file: req.file,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Error en la subida del avatar",
    });
  }
};

const avatar = async (req, res) => {
  // Montar el path real de la imagen
  const filePath = path.join("uploads", "avatars", req.params.file);

  // Comprobar que existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: "error",
      message: "No existe la image",
    });
  }

  // Devolver un file
  return res.sendFile(path.resolve(filePath));
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
      message: "Error al obtener los contadores",
    });
  }
};

// Exportar funciones
module.exports = {
  register,
  login,
  profile,
  list,
  listFollowers,
  listFollowing,
  update,
  upload,
  avatar,
  counters,
};
