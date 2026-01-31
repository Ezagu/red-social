// Importar dependencias y modulos
const fs = require("fs");
const path = require("path");

// Importar modelos
const User = require("../models/user.js");
const Notification = require("../models/notification.js");

// Importar servicios
const jwt = require("../services/jwt.js");
const followService = require("../services/followService.js");
const passwordService = require("../services/passwordService.js");
const { getPublications } = require("../services/publicationService.js");
const uploadCloudinary = require("../services/cloudinary.js");

// Registro de usuario
const register = async (req, res) => {
  //Recoger datos de la peticion
  const params = req.body;

  try {
    params.password = passwordService.encrypt(params.password);

    // Guardar usuario en la base de datos
    await User.create(params);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      status: "success",
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error en el servidor",
      error,
    });
  }
};

const login = async (req, res) => {
  // Recoger parametros body
  const params = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: params.email }, { nick: params.email }],
    });
    if (!user) throw new Error("USER_NOT_FOUND");

    const pwd = passwordService.decrypt(params.password, user.password);
    if (!pwd) throw new Error("USER_NOT_FOUND");

    // Conseguir token
    const token = jwt.createToken(user);

    const userClean = user.toObject();

    delete userClean.password;
    delete userClean.email;
    delete userClean.role;
    delete userClean.__v;

    // Devolver datos del usuario
    return res.status(200).json({
      status: "success",
      message: "Login correcto",
      user: userClean,
      token,
    });
  } catch (error) {
    let message = "Error en el servidor";
    if (error.message === "USER_NOT_FOUND")
      message = "Usuario o contraseña incorrecta";
    return res.status(500).json({
      status: "error",
      message,
    });
  }
};

const profile = async (req, res) => {
  // Recibir el parámetro del id de usuario por la url
  const id = req.params.id || req.user._id;

  // Consulta para sacar los datos del usuario
  try {
    const userProfile = await User.findById(id, "-password -role -email -__v");

    // Info de seguimiento
    const followInfo = await followService.followThisUser(req.user.id, id);

    // Devolver el resultado
    return res.status(200).json({
      status: "success",
      user: {
        ...userProfile.toObject(),
        isFollower: followInfo.follower ? true : false,
        isFollowed: followInfo.following ? true : false,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

const list = async (req, res) => {
  // Controlar en que pagina estamos
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search;

  try {
    const followsIds = await followService.followsIds(req.user.id);

    // No aparece el usuario identificado en el listado
    const query = { _id: { $ne: req.user.id } };

    // En caso de que haya una busqueda, buscar
    if (search) {
      query.$or = [
        { nick: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
      ];
    }

    // Consulta con mongoose paginate
    const result = await User.paginate(query, {
      page,
      limit,
      sort: "_id",
      select: "-password -role -email -__v",
    });

    // Agrega informacion de follows
    const usersWithFollowInfo = followService.addFollowInfo(
      result.docs,
      followsIds,
    );

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      page,
      hasNextPage: result.hasNextPage,
      items: usersWithFollowInfo,
    });
  } catch (err) {
    return res.status(404).json({
      status: "error",
      message: "Error en el servidor",
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
      { page, limit, select: "-password -role -email -__v" },
    );

    // Indica si el usuario te sigue y si lo sigues
    const usersWithFollowInfo = followService.addFollowInfo(
      result.docs,
      followsIds,
    );

    return res.status(200).json({
      status: "success",
      page,
      hasNextPage: result.hasNextPage,
      items: usersWithFollowInfo,
    });
  } catch {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
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
      { page, limit, select: "-password -role -email -__v" },
    );

    // Indica si el usuario te sigue y si lo sigues
    const usersWithFollowInfo = followService.addFollowInfo(
      result.docs,
      followsIds,
    );

    return res.status(200).json({
      status: "success",
      page,
      hasNextPage: result.hasNextPage,
      items: usersWithFollowInfo,
    });
  } catch {
    return res.status(400).json({
      status: "error",
      message: "Usuarios no encontrados",
    });
  }
};

const update = async (req, res) => {
  // Recoger info del usuario a actualizar
  let userIdentityId = req.user._id;
  const userToUpdate = req.body;
  const file = req.file;

  try {
    // Si me llega la password cifrarla
    if (userToUpdate.password) {
      userToUpdate.password = passwordService.encrypt(userToUpdate.password);
    }

    if (file) {
      const result = await uploadCloudinary(file.buffer, "avatars");
      userToUpdate.image = result.secure_url;
    }

    // Buscar y actualizar
    const userUpdated = await User.findByIdAndUpdate(
      { _id: userIdentityId },
      userToUpdate,
      { select: "-password -role -__v -email" },
    );

    // Si se actualizo el avatar y habia un avatar anterior, borrarlo
    if (req.file && userUpdated.image !== "default.jpg") {
      const prevAvatarPath = path.join("uploads", "avatars", userUpdated.image);
      if (fs.existsSync(prevAvatarPath)) {
        fs.unlinkSync(prevAvatarPath);
      }
    }

    const user = await User.findById(
      userIdentityId,
      "-password -role -__v -email",
    );

    return res.status(200).json({
      status: "success",
      message: "Usuario actualizado",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
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
      message: "No existe la imagen",
    });
  }

  // Devolver un file
  return res.sendFile(path.resolve(filePath));
};

const publications = async (req, res) => {
  const user = req.params.id || req.user.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  try {
    const publications = await getPublications(
      req.user._id,
      { user },
      page,
      limit,
    );

    return res.status(200).json(publications);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

const notifications = async (req, res) => {
  const user = req.user._id;

  const notificationsWithoutLikes = await Notification.find({
    user,
    targetType: { $ne: "Like" },
  })
    .populate("fromUser", "nick fullName image")
    .populate({
      path: "targetId",
    });

  // Separo en dos porque likes necesita un populate demás
  const notificationsLikes = await Notification.find({
    user,
    targetType: "Like",
  })
    .populate("fromUser", "nick fullName image")
    .populate({ path: "targetId", populate: "targetId" });

  const notifications = [...notificationsWithoutLikes, ...notificationsLikes];

  // Sort manual
  notifications.sort((a, b) => b.createdAt - a.createdAt);

  try {
    return res.status(200).json({
      status: "success",
      message: "Listado de notificaciones",
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
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
  avatar,
  publications,
  notifications,
};
