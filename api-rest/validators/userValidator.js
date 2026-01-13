const { body, params } = require("express-validator");
const validateFields = require('./validateFields');

const name = body("name")
  .trim()
  .notEmpty().withMessage("Ingrese su nombre")
  .isAlpha("es-ES").withMessage("Ingrese un nombre correcto")
  .isLength({ min: 3 }).withMessage("El nombre debe contener mínimo 3 caracteres");

const surname = body('surname')
  .trim()
  .notEmpty()
  .isAlpha('es-ES').withMessage('Ingrese un apellido correcto');

const email = body('email')
  .notEmpty().withMessage('Ingrese su mail')
  .isEmail().withMessage('Ingrese un mail válido');

const nick = body('nick')
  .trim()
  .notEmpty().withMessage('Ingrese un nick')
  .isLength({min:3}).withMessage('El nick debe de contener mínimo 3 caracteres');

const password = body('password')
  .trim()
  .notEmpty().withMessage('Ingrese una contraseña');

const bio = body('bio')
  .isLength({max: 255}).withMessage('La biografia no debe contener mas de 255 caracteres');

exports.register = [
  [name,
  surname.optional(),
  email,
  nick,
  password,
  bio.optional()],
  validateFields
]

exports.update = [[
  body().notEmpty().withMessage('No se evió ningún dato para actualizar'),
  email.optional(),
  password.optional(),
  name.optional(),
  surname.optional(),
  nick.optional(),
  bio.optional()],
  validateFields
]

exports.login = [
  [
    body('email').trim().notEmpty().withMessage('Ingrese el mail'),
    body('password').trim().notEmpty().withMessage('Ingrese la contraseña')
  ],
  validateFields
]