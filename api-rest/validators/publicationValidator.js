const {body} = require('express-validator');
const validateFields = require('./validateFields');

const text = body('text')
  .trim()
  .notEmpty().withMessage('Ingresa un texto');

exports.save = [
  [text],
  validateFields
];