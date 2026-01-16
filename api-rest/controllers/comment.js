const Comment = require('../models/comment.js');

const create = async (req, res) => {

  const user = req.user._id;
  const {publication, text} = req.body;
  const parentComment = req.body.parentComment || null;

  try {
    const newComment = new Comment({
      user, publication, text, parentComment
    });

    await newComment.save();

    if(parentComment) {
      await Comment.findOneAndUpdate({_id: parentComment}, {$inc: {repliesCount: 1}});
    }

    return res.status(200).json({
      status: 'success',
      message: 'Comentario publicado',
      comment: newComment
    });
  } catch(error) {
    return res.status(200).json({
      status: 'success',
      message: 'No se pudo publicar el comentario'
    });
  }
}

const remove = async (req, res) => {

  const user = req.user._id;
  const {comment} = req.body;

  try {
    const commentRemoved = await Comment.findOneAndDelete({user, _id: comment});

    if(commentRemoved.parentCommen) {
      await Comment.findOneAndUpdate({_id: commentRemoved.parentComment}, {$inc: {repliesCount: -1}});
    }

    if(!commentRemoved) {
      return res.status(400).json({
        status:'error',
        message: 'Comentario no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Comentario borrado con éxito!',
      comment: commentRemoved
    });
  } catch(error) {
    return res.status(400).json({
      status: 'error',
      message: 'No se pudo eliminar el comentario'
    });
  }
}

const replies = async (req, res) => {

  const parentComment = req.params.id;

  try {
    const replies = await Comment.find({parentComment}, '', {sort: {'createdAt': -1}}).populate('user', '-password -role -email -__v');
    
    return res.status(200).json({
      status: 'success',
      message: 'Listado de respuestas de un comentario',
      replies
    })
  } catch(error) {
    return res.status(400).json({
      status: 'error',
      message: 'Error obteniendo las respuestas del comentario'
    });
  }
}

module.exports = {
  create,
  remove,
  replies
}