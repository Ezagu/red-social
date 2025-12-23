// Importar dependencias
const connection = require('./database/connection.js');
const express = require('express');
const cors = require('cors');

console.log('API NODE para RED SOCIAL arrancada!!')

// Conexion a base de datos
connection();

// Crear servidor de node
const app = express();
const puerto = 3900;

// Configurar el cors
app.use(cors());

// Convertir datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar conf rutas
const userRoutes = require('./routes/user.js');
const publicationRoutes = require('./routes/publication.js');
const followRoutes = require('./routes/follow.js'); 

app.use('/api/user', userRoutes);
app.use('/api/publication', publicationRoutes);
app.use('/api/follow', followRoutes);


// Ruta de prueba
app.get('/prueba', (req, res) => {
  res.status(200).json({
    mensaje: 'hola a todos'
  })
});


// Poner servidor a escuchar peticiones http
app.listen(puerto, () => {
  console.log('Servidor de node corriendo en el puerto: ' + puerto);
});