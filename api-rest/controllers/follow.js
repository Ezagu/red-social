// Importar modelo
const Follow = require("../models/follow.js");
const User = require("../models/user.js");

// Importar servicio
const followService = require("../services/followService.js");

// Acción de guardar un follow (acción seguir)
const save = async (req, res) => {
  // Conseguir datos por body
  const {followed} = req.body;

  // Sacar id del usuario identificado
  const user = req.user.id;

  try {
    // Crear objeto con modelo follow y guardar en bd
    const follow = await Follow.create({
      user,
      followed,
    });

    await User.findByIdAndUpdate(user, {$inc: {followingCount: 1}});
    await User.findByIdAndUpdate(followed, {$inc: {followersCount: 1}});
    
    return res.status(200).json({
      status: "success",
      message: 'Seguido con éxito',
      follow
    });
  } catch (err) {
    let message = "No se pudo seguir al usuario";
    if(err.code === 11000) {
      message = 'Ya sigues a esta cuenta';
    }
    return res.status(400).json({
      status: "error",
      message
    });
  }
};

// Acción de borrar un follow (accion dejar de seguir)
const unfollow = async (req, res) => {
  // Recoger el id del usuario identificado
  const user = req.user.id;

  // Recoger el id del usuario que sigo y quiero dejar de seguir
  const followed = req.params.id;

  // Find de las coincidencias y hacer remove
  try {
    const followDeleted = await Follow.deleteOne({
      user,
      followed
    });

    if(!followDeleted) {
      throw new Error();
    }

    await User.findByIdAndUpdate(user, {$inc: {followingCount: -1}});
    await User.findByIdAndUpdate(followed, {$inc: {followersCount: -1}});

    return res.status(200).json({
      status: "success",
      message: "Follow eliminado correctamente"
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "No se pudo dejar de seguir",
    });
  }
};

// Acción listado de usuarios que cualquier usuario está siguiendo
const following = async (req, res) => {
  // Sacar el id del usuario
  const userId = req.params.id || req.user.id;

  // Comprobar si me llega la pagina, si no la pagina 1
  const page = req.params.page || 1;

  // Usuarios por pagina quiero mostrar
  const itemsPerPage = 5;

  // Find a follow, popular datos de los usuarios y paginar
  try {
    const follows = await Follow.paginate(
      {
        user: userId,
      },
      {
        page,
        limit: itemsPerPage,
        populate: {
          path: "user followed",
          select: "-password -role -__v -email",
        },
      }
    );

    // Sacar un array de ids de los usuarios que me siguen y los que sigo como usuario identificado
    const followUserIds = await followService.followUserIds(req.user.id);

    return res.status(200).json({
      status: "success",
      message: "Listado de usuarios que estoy siguiendo",
      follows: follows.docs,
      total: follows.totalDocs,
      totalPages: follows.totalPages,
      hasNextPage: follows.hasNextPage,
      user_following: followUserIds.following,
      user_follow_me: followUserIds.followers,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "No se pudo encontrar los usuarios seguidos",
    });
  }
};

// Acción listado de usuarios que siguen a cualquier otro usuario
const followers = async (req, res) => {
  // Sacar el id del usuario
  const userId = req.params.id || req.user.id;

  // Comprobar si me llega la pagina, si no la pagina 1
  const page = req.params.page || 1;

  // Usuarios por pagina quiero mostrar
  const itemsPerPage = 5;

  // Find a follow, popular datos de los usuarios y paginar
  try {
    const follows = await Follow.paginate(
      {
        followed: userId,
      },
      {
        page,
        limit: itemsPerPage,
        populate: {
          path: "user",
          select: "-password -role -__v -email",
        },
      }
    );

    // Sacar un array de ids de los usuarios que me siguen y los que sigo como usuario identificado
    const followUserIds = await followService.followUserIds(req.user.id);

    return res.status(200).json({
      status: "success",
      message: "Listado de usuarios que me siguen",
      follows: follows.docs,
      total: follows.totalDocs,
      totalPages: follows.totalPages,
      hasNextPage: follows.hasNextPage,
      user_following: followUserIds.following,
      user_follow_me: followUserIds.followers,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "No se pudo encontrar los usuarios que me siguen",
    });
  }
};

// Exportar funciones
module.exports = {
  save,
  unfollow,
  following,
  followers,
};
