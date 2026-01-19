const { body } = require("express-validator");
const validateFields = require('./validateFields');


const text = body('text')
  .trim()
  .notEmpty().withMessage('Ingrese el texto')
  .isLength({max:255}).withMessage('Texto demasiado largo');
  
const publication = body('publicationId')
  .notEmpty().withMessage('Ingrese el id de la publicación');

exports.create = [
  [
    text,
    publication
  ], 
  validateFields
]