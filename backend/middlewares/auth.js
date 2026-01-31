// Importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

// Importar clave secreta
const libjwt = require("../services/jwt.js");
const secret = libjwt.secret;

const User = require("../models/user.js");

// Middleware de autenticación
const auth = async (req, res, next) => {
  // Comprobar si me llega la cabecera de auth
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "Token necesario",
    });
  }

  try {
    // limpiar el token
    const token = req.headers.authorization.replace(/['"]+/g, "");
    // Decodificar el token
    const payload = jwt.decode(token, secret);

    // Comprobar expiracion del token
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: "error",
        message: "Token expirado",
      });
    }

    // Agregar datos de usuario a request
    const user = await User.findById(payload.id, "-password -role -email -__v");

    req.user = user;
  } catch (err) {
    return res.status(404).send({
      status: "error",
      message: "Token inválido",
      error,
    });
  }

  // Pasar a ejecucion de acción
  next();
};

module.exports = auth;
