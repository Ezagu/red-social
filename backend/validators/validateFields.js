const {validationResult} = require('express-validator');

const validateFields = (req, res, next) => {
  const {errors} = validationResult(req);


  if(errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: errors[0].msg,
      field: errors[0].path
    })
  }

  next();
}

module.exports = validateFields;