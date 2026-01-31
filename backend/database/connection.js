const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connection = async () => {
  dotenv.config({
    path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
  });
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado correctamente a la base de datos: mi_redsocial");
  } catch (error) {
    console.log(error);
    throw new Error("No se ha podido conectar a la base de datos");
  }
};

module.exports = connection;
