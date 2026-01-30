const bcrypt = require("bcrypt");

exports.encrypt = (password) => {
  try {
    return bcrypt.hashSync(password, 10);
  } catch (err) {
    throw new Error(err);
  }
};

exports.decrypt = (password, hashedPassword) => {
  try {
    return bcrypt.compareSync(password, hashedPassword);
  } catch (err) {
    throw new Error(err);
  }
};
