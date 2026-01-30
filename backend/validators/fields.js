const { query } = require("express-validator");

exports.search = query("search")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Ingresar un valor en search");

exports.limit = query("limit")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Ingresar un valor en limit")
  .isInt()
  .withMessage("Limit debe ser un número");

exports.page = query("page")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Ingresar un valor en page")
  .isInt()
  .withMessage("Page debe ser un número");
