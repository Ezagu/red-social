const Like = require('../models/like.js');
const Comment = require('../models/comment.js');
const Publication = require('../models/publication.js');


const save = async(req, res) => {

  const {targetId, targetType} = req.body; 
  const user = req.user._id;

  try {
    const like = await Like.create({
      targetId,
      targetType,
      user
    });

    if(targetType === 'Comment') {
      await Comment.findByIdAndUpdate(targetId, {$inc: {likesCount: 1}});
    } else if(targetType === 'Publication') {
      await Publication.findByIdAndUpdate(targetId, {$inc: {likesCount: 1}});
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
      message
    });
  } 
}

const remove = async(req, res) => {
  
  const user = req.user._id;
  const {targetType, targetId} = req.body;

  try {
    const likeRemoved = await Like.findOneAndDelete({
      user,
      targetId,
      targetType
    });

    if(targetType === 'Comment') {
      await Comment.findByIdAndUpdate(targetId, {$inc: {likesCount: -1}});
    } else if(targetType === 'Publication') {
      await Publication.findByIdAndUpdate(targetId, {$inc: {likesCount: -1}});
    }

    return res.status(200).json({
      status: 'success',
      message: 'Like eliminado',
      likeRemoved
    });
  } catch {
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