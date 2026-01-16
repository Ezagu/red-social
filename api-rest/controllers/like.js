const Like = require('../models/like.js');
const Comment = require('../models/comment.js');
const Publication = require('../models/publication.js');
const Notification = require('../models/notification.js');
const User = require('../models/user.js');

const save = async(req, res) => {

  const {targetId, targetType} = req.body; 
  const user = req.user._id;

  try {
    const like = await Like.create({
      targetId,
      targetType,
      user
    });

    // Aumentar contador de likes en comentario o publicación
    let target = {};
    if(targetType === 'Comment') {
      target = await Comment.findByIdAndUpdate(targetId, {$inc: {likesCount: 1}});
    } else if(targetType === 'Publication') {
      target = await Publication.findByIdAndUpdate(targetId, {$inc: {likesCount: 1}});
    }

    // Crear notificación en caso de que no sea el mismo usuario identificado el que haya dado like
    if(target.user.toString() !== user.toString()) {
      await Notification.create({user: target.user, fromUser: user, targetType: 'Like', targetId: like._id});

      await User.findByIdAndUpdate(target.user, {$inc: {unreadNotificationsCount: 1}});
    }

    return res.status(200).json({
      status: 'success',
      message: 'Like guardado con éxito',
      like
    })
  } catch(error) {
    let message = 'No se pudo guardar el like';

    if(error.code === 11000) {
      message = 'Ya se likeo la publicacion o comentario'
    }

    return res.status(400).json({
      status: 'error',
      message,
      error
    });
  } 
}

const remove = async(req, res) => {
  
  const user = req.user._id;
  const likeId = req.params.id;

  try {
    const likeRemoved = await Like.findOneAndDelete({_id: likeId, user});

    console.log(likeRemoved);

    if(!likeRemoved) {
      throw new Error();
    }

    if(likeRemoved.targetType === 'Comment') {
      await Comment.findByIdAndUpdate(likeRemoved.targetId, {$inc: {likesCount: -1}});
    } else if(likeRemoved.targetType === 'Publication') {
      await Publication.findByIdAndUpdate(likeRemoved.targetId, {$inc: {likesCount: -1}});
    }

    // Eliminar notificación
    await Notification.findOneAndDelete({targetType: 'Like', targetId: likeId});

    return res.status(200).json({
      status: 'success',
      message: 'Like eliminado'
    });
  } catch(error) {
    return res.status(400).json({
      status: 'error',
      message: 'No se pudo deshacer el like'
    });
  }
}

module.exports = {
  save,
  remove
};