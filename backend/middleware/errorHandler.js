const { errorResponse } = require('../utils/utils'); // Utilidad para respuestas estandarizadas

/**
 * Middleware para manejar errores en la aplicación.
 * Captura errores no manejados y responde con un formato estandarizado.
 * @param {Error} err - Instancia del error capturado.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Siguiente middleware en la cadena (si se omite, termina el ciclo).
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Registro del error en la consola (detalles visibles solo en entornos no producción)
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${err.message}`);
    if (err.stack) console.error(err.stack);
  }

  // Respuesta estandarizada utilizando `errorResponse`
  errorResponse(
    res,
    err.message || 'Error interno del servidor',
    process.env.NODE_ENV !== 'production' ? err.stack : null,
    statusCode
  );
};

module.exports = errorHandler;
