const User = require("../models/user");
const mongoose = require("mongoose");

exports.isObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error("Se debe enviar un ObjectId válido");
  }
  return true;
};

exports.mustExistUser = async (value) => {
  const user = await User.findById(value);
  if (!user) throw new Error("No existe el usuario");
  return true;
};
