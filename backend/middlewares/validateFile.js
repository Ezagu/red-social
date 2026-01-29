const fs = require("fs");

const validateFile = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const fileExtensions = req.file.originalname.split(".").pop().toLowerCase();
  const extensions = ["png", "jpg", "jpeg", "gif", "webp"];

  if (!extensions.includes(fileExtensions)) {
    fs.unlinkSync(req.file.path);

    return res.status(400).json({
      status: "error",
      message: "Extensión de archivo inválida",
    });
  }

  next();
};

module.exports = validateFile;
