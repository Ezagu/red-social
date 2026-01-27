const dotenv = require("dotenv");
dotenv.config();

// Importar dependencias
const connection = require("./database/connection.js");
const express = require("express");
const cors = require("cors");

// Modelos
const Like = require("./models/like.js");
const Follow = require("./models/follow.js");
const Notification = require("./models/notification.js");

// Rutas
const userRoutes = require("./routes/user.js");
const publicationRoutes = require("./routes/publication.js");
const followRoutes = require("./routes/follow.js");
const likeRoutes = require("./routes/like.js");
const commentRoutes = require("./routes/comment.js");
const notificationRoutes = require("./routes/notification.js");

console.log("Arrancando API NODE para RED SOCIAL");

const startServer = async () => {
  try {
    // Conexion a base de datos
    await connection();

    // Sincronizar indices (SOLO EN DEV)
    await Like.syncIndexes();
    await Follow.syncIndexes();
    await Notification.syncIndexes();

    console.log("Indices sincronizados");

    // Crear servidor de node
    const app = express();
    const puerto = 3900;

    // Configurar el cors
    app.use(cors());

    // Convertir datos del body a objetos js
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Cargar conf rutas
    app.use("/api/user", userRoutes);
    app.use("/api/publication", publicationRoutes);
    app.use("/api/follow", followRoutes);
    app.use("/api/like", likeRoutes);
    app.use("/api/comment", commentRoutes);
    app.use("/api/notification", notificationRoutes);

    // Poner servidor a escuchar peticiones http
    app.listen(puerto, () => {
      console.log("Servidor de node corriendo en el puerto: " + puerto);
    });
  } catch (error) {
    console.log("Error al iniciar la app: ", error);
  }
};

startServer();
