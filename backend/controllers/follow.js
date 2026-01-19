// Importar modelo
const Follow = require("../models/follow.js");
const User = require("../models/user.js");
const Notification = require("../models/notification.js");

// Acción de guardar un follow (acción seguir)
const save = async (req, res) => {
  // Conseguir datos por body
  const followed = req.params.id;

  // Sacar id del usuario identificado
  const user = req.user.id;

  try {
    // Crear objeto con modelo follow y guardar en bd
    const follow = await Follow.create({
      user,
      followed,
    });

    await User.findByIdAndUpdate(user, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(followed, { $inc: { followersCount: 1 } });

    await Notification.create({
      user: followed,
      fromUser: user,
      targetType: "Follow",
      targetId: follow._id,
    });

    await User.findByIdAndUpdate(followed, {
      $inc: { unreadNotificationsCount: 1 },
    });

    return res.status(201).json({
      status: "success",
      message: "Seguido con éxito",
      follow,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'error',
        message: "Ya sigues a esta cuenta"
      });
    }
    return res.status(500).json({
      status: "error",
      message: "No se pudo seguir al usuario"
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
    const followDeleted = await Follow.findOneAndDelete({
      user,
      followed,
    });

    if (!followDeleted) {
      return res.status(404).json({
        status:'error',
        message: 'No sigues a ese usuario'
      })
    }

    await User.findByIdAndUpdate(user, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(followed, { $inc: { followersCount: -1 } });

    const notification = await Notification.findOneAndDelete({
      targetType: "Follow",
      targetId: followDeleted._id,
    });

    if (!notification.read) {
      await User.findByIdAndUpdate(followed, {
        $inc: { unreadNotificationsCount: -1 },
      });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudo dejar de seguir"
    });
  }
};

// Exportar funciones
module.exports = {
  save,
  unfollow
};
