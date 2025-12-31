// Importar dependencias y modulos
const bcrypt = require('bcrypt');

// Importar modelos
const User = require('../models/user.js');

// Importar servicios
const jwt = require('../services/jwt.js');

// Acciones de prueba
const pruebaUser = (req, res) => {
  res.status(200).send({
    message: 'Mensaje enviado desde el controlador: controllers/user.js',
    usuario: req.user
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
      {email: params.email},
      {nick: params.nick}
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

const profile = async(req, res) => {
  // Recibir el parámetro del id de usuario por la url
  const id = req.params.id;

  // Consulta para sacar los datos del usuario
  try {
    const userProfile = await User.findById(id, '-password -role');

    if(!userProfile) {
      return res.status(404).send({
        status: 'error',
        message: 'El usuario no ha sido encontrado'
      });
    }

    // Devolver el resultado
    // TODO: Devolver informacion de follows
    return res.status(200).json({
      status: 'success',
      user: userProfile
    })

  } catch(err) {
    return res.status(404).send({
      status: 'error',
      message: 'Error al buscar el usuario'
    });
  }
}

const list = async(req, res) => {
  // Controlar en que pagina estamos
  const page = parseInt(req.params.page) || 1;

  const itemsPerPage = 5;

  try {
    // Consulta con mongoose paginate
    const {docs: users, totalDocs: totalUsers, totalPages} = await User.paginate({}, {
      page,
      limit: itemsPerPage,
      sort: '_id'
    });

    // Devolver resultado
    return res.status(200).json({
      status: 'success',
      page,
      users,
      itemsPerPage,
      totalUsers,
      totalPages
    });
  } catch(err){
    return res.status(500).json({
      status: 'error',
      message: 'Error al buscar los usuarios en la base de datos'
    });
  }
};

const update = async(req, res) => {
  // Recoger info del usuario a actualizar
  let userIdentity = req.user;
  const userToUpdate = req.body;

  if(!userToUpdate) {
    return res.status(400).json({
      status: 'error',
      message: 'No se enviaron datos para actualizar'
    })
  }

  console.log(userToUpdate);

  // Eliminar campos sobrantes
  delete userIdentity.iat;
  delete userIdentity.exp;
  delete userIdentity.role;
  delete userIdentity.image;

  // Comprobar si se quiere actualizar a un email o nick que ya existe
  let conditions = []
  if(userToUpdate.email) {
    conditions.push({email: userToUpdate.email});
  }
  if(userToUpdate.nick) {
    conditions.push({nick: userToUpdate.nick});
  }

  let duplicatedUsers = [];

  if(conditions.length > 0) {
    duplicatedUsers = await User.find({
      $or: conditions
    });
    
    let userIsset = false;
    duplicatedUsers.forEach(user => {
      if(user && user._id != userIdentity.id){
        userIsset = true;
      }
    });

    if(userIsset) {
      return res.status(400).json({
        status: 'error', 
        message: 'El email o nick ya está registrado'
      })
    }
  }

  // Si me llega la password cifrarla
  if(userToUpdate.password) {
    try {
      userToUpdate.password = await bcrypt.hash(userToUpdate.password, 10);
    } catch(err) {
      return res.status(400).json({
        status: 'error',
        message: 'Error al encriptar la contraseña'
      });
    }
  }
  
  // Buscar y actualizar
  try {
    const userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, {new: true});

    if(userUpdated) {
      return res.status(200).json({
        status: 'success',
        userUpdated
      });
    }
  } catch(error) {
    return res.status(400).json({
      status: 'error',
      message: 'Error al actualizar o usuario no encontrado',
    });
  }
};

const upload = (req, res) => {
  // Recoger el fichero de imagen y comprobar que existe
  if(!file) {

  }

  // Conseguir nombre del archivo

  // Sacar la extensión del archivo

  // Comprobar extensión

  // Si no es correcta, borrar archivo

  // Si lo es, guardar imagen en base de datos

  // Devolver respuesta

  return res.status(200).send({
    staus: 'success',
    message: 'Subida de imagenes',
    user: req.user,
    file: req.file
  });
}

// Exportar funciones
module.exports = {
  pruebaUser,
  register, 
  login,
  profile,
  list,
  update,
  upload
};