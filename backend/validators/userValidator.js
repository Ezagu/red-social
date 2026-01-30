const { body, param } = require("express-validator");
const validateFields = require("./validateFields");
const User = require("../models/user");
const { isObjectId, mustExistUser } = require("./customs");
const { search, page, limit } = require("./fields");

const notDuplicatedEmailWithoutMe = async (email) => {
  if (email === req.user.email) return true;
  const user = await User.findOne({ email, _id: { $ne: req.user._id } });
  if (user) throw new Error("Email ya registrado");
  return true;
};

const notDuplicatedNickWithoutMe = async (nick, { req }) => {
  const user = await User.findOne({ nick, _id: { $ne: req.user._id } });
  if (user) throw new Error("Nombre de usuario en uso");
  return true;
};

const notDuplicatedEmail = async (email) => {
  const user = await User.findOne({ email });
  if (user) throw new Error("Email ya registrado");
  return true;
};

const notDuplicatedNick = async (nick) => {
  const user = await User.findOne({ nick });
  if (user) throw new Error("Nombre de usuario en uso");
  return true;
};

const userId = param("id")
  .trim()
  .notEmpty()
  .withMessage("Debes enviar el id del usuario")
  .custom(isObjectId)
  .custom(mustExistUser);

const fullName = body("fullName")
  .trim()
  .notEmpty()
  .withMessage("Ingrese su nombre")
  .isLength({ min: 3 })
  .withMessage("El nombre debe contener mínimo 3 caracteres");

const email = body("email")
  .trim()
  .notEmpty()
  .withMessage("Ingrese su mail")
  .isEmail()
  .withMessage("Ingrese un mail válido");

const nick = body("nick")
  .trim()
  .notEmpty()
  .withMessage("Ingrese un nombre de usuario")
  .isLength({ min: 3 })
  .withMessage("Nombre de usuario demasiado corto")
  .isLength({ max: 20 })
  .withMessage("Nombre de usuario demasiado largo");

const password = body("password")
  .trim()
  .notEmpty()
  .withMessage("Ingrese una contraseña");

const bio = body("bio")
  .isLength({ max: 255 })
  .withMessage("La biografia no debe contener mas de 255 caracteres");

exports.register = [
  [
    body().notEmpty().withMessage("Campos requeridos"),
    email.custom(notDuplicatedEmail),
    password,
    fullName,
    nick.custom(notDuplicatedNick),
  ],
  validateFields,
];

exports.update = [
  [
    email.custom(notDuplicatedEmailWithoutMe).optional(),
    password.optional(),
    fullName.optional(),
    nick.custom(notDuplicatedNickWithoutMe).optional(),
    bio.optional(),
  ],
  validateFields,
];

exports.login = [
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Ingrese su mail o nombre de usuario"),
    body("password").trim().notEmpty().withMessage("Ingrese la contraseña"),
  ],
  validateFields,
];

exports.list = [[limit, page, search], validateFields];

exports.userId = [[userId.optional()], validateFields];
