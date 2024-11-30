const app = require('./app');
const connectDB = require('./config/db');

// Configuración del puerto
const PORT = process.env.PORT || 5000;

/**
 * Función principal para iniciar el servidor.
 */
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    //console.log('Conexión exitosa a la base de datos.');

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor  ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);

    // Salir del proceso con un error si falla la conexión
    process.exit(1);
  }
};

// Ejecutar la función para iniciar el servidor
startServer();
