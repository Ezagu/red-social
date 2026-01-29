const { body } = require("express-validator");
const validateFields = require("./validateFields");

const fullName = body("fullName")
  .trim()
  .notEmpty()
  .withMessage("Ingrese su nombre")
  .isLength({ min: 3 })
  .withMessage("El nombre debe contener mínimo 3 caracteres");

const email = body("email")
  .notEmpty()
  .withMessage("Ingrese su mail")
  .isEmail()
  .withMessage("Ingrese un mail válido");

const nick = body("nick")
  .trim()
  .notEmpty()
  .withMessage("Ingrese un nombre de usuario")
  .isLength({ min: 3 })
  .withMessage("Nombre de usuario debe contener un mínimo de 3 caracteres")
  .isLength({ max: 20 })
  .withMessage("Nombre de usuario debe contener menos de 20 caracteres");

const password = body("password")
  .trim()
  .notEmpty()
  .withMessage("Ingrese una contraseña");

const bio = body("bio")
  .isLength({ max: 255 })
  .withMessage("La biografia no debe contener mas de 255 caracteres");

exports.register = [
  [email, password, fullName, nick, bio.optional()],
  validateFields,
];

exports.update = [
  [
    body().notEmpty().withMessage("No se envió ningún dato para actualizar"),
    email.optional(),
    password.optional(),
    fullName.optional(),
    nick.optional(),
    bio.optional(),
  ],
  validateFields,
];

exports.login = [
  [
    body("email").trim().notEmpty().withMessage("Ingrese su mail o nick"),
    body("password").trim().notEmpty().withMessage("Ingrese la contraseña"),
  ],
  validateFields,
];
