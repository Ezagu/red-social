// Importar dependencias y modulos
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

// Importar servicios
const jwt = require('../services/jwt.js');

// Acciones de prueba
const pruebaUser = (req, res) => {
  res.status(200).send({
    message: 'Mensaje enviado desde el controlador: controllers/user.js'
  });
}

// Registro de usuario
const register = async(req, res) => {
  //Recoger datos de la peticion
  const params = req.body;

  // Comprobar que me llegan bien (+validacion)
  if(!params.name || !params.email || !params.password || !params.nick) {
    return res.status(400).json({
      message: 'Faltan datos por enviar',
      status: 'error'
    })
  }

  // Control usuarios duplicados
  const duplicatedUsers = await User.find({
    $or: [
      {email: params.email.toLowerCase()},
      {nick: params.nick.toLowerCase()}
    ]
  })
  
  if(duplicatedUsers.length > 0) {
    return res.status(409).send({
      status: 'error',
      message: 'El usuario ya existe'
    });
  }

  // Cifrar contraseña
  try {
    params.password = await bcrypt.hash(params.password, 10);
  } catch(err) {
    return res.status(400).json({
      status: 'error',
      message: 'Error al encriptar la contraseña'
    });
  }

  // Crear objeto de usuario
  const userToSave = new User(params); 

  // Guardar usuario en la base de datos
  try {
    const userStored = await userToSave.save();

    if(userStored) {
      return res.status(201).json({
        message: 'Usuario registrado correctamente',
        status: 'success',
        user: userStored
      });
    } else {
      throw new Error();
    }
  } catch(err) {
    return res.status(500).send({
      status: 'error',
      message: 'Error al guardar el usuario en la base de datos'
    });
  }
}

const login = async(req, res) => {
  // Recoger parametros body
  const params = req.body;

  if(!params.email && !params.password) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar'
    });
  }

  // Buscar en la base de datos si existe
  const user = await User.findOne({email: params.email});
  
  if(!user) {
    return res.status(400).json({
      status: 'error',
      message: 'No se ha encontrado el usuario'
    });
  }
    
  // Comprobar su contraseña
  const pwd = bcrypt.compareSync(params.password, user.password);

  if(!pwd) {
    return res.status(400).json({
      status: 'error',
      message: 'Contraseña incorrecta'
    })
  }

  // Conseguir token
  const token = jwt.createToken(user);

  // Devolver datos del usuario
  return res.status(200).json({
    status: 'success',
    message: 'Login correcto',
    user: {
      _id: user._id,
      name: user.name,
      nick: user.nick
    },
    token
  })
}


// Exportar funciones
module.exports = {
  pruebaUser,
  register, 
  login
};