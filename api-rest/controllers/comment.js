const mongoose = require('mongoose');

const Comment = require('../models/comment.js');
const Publication = require('../models/publication.js');

const create = async (req, res) => {

  const user = req.user._id;
  const {publication, text} = req.body;
  const parentComment = req.body.parentComment || null;

  try {
    // Crear comentario
    const newComment = await Comment.create({
      user, publication, text, parentComment
    });

    // Aumentar contador de comentarios de publicacion
    await Publication.findByIdAndUpdate(publication, {$inc: {commentsCount: 1}});

    // Si tiene un comentario padre, aumentarle el contador de respuestas
    if(parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {$inc: {repliesCount: 1}});
    }

    return res.status(200).json({
      status: 'success',
      message: 'Comentario publicado',
      comment: newComment
    });
  } catch(error) {
    return res.status(400).json({
      status: 'error',
      message: 'No se pudo publicar el comentario',
      error
    });
  }
}

const remove = async (req, res) => {

  const user = req.user._id;
  const {comment} = req.body;

  try {
    const commentRemoved = await Comment.findOneAndDelete({user, _id: comment});

    await Publication.findByIdAndUpdate(commentRemoved.publication, {$inc: {commentsCount: -1}});

    if(commentRemoved.parentCommen) {
      await Comment.findByIdAndUpdate(commentRemoved.parentComment, {$inc: {repliesCount: -1}});
    }

    if(!commentRemoved) {
      return res.status(400).json({
        status:'error',
        message: 'Comentario no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Comentario borrado con éxito',
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