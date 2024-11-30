/**
 * Utils.js: Utilidades comunes para respuestas estandarizadas y manejo de errores en la API.
 */

/**
 * Devuelve una respuesta de error estandarizada.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {string} message - Mensaje de error para el cliente.
 * @param {object|null} details - Detalles opcionales del error (por ejemplo, stack trace o información adicional).
 * @param {number} statusCode - Código de estado HTTP (por defecto 500).
 * @returns {object} Respuesta JSON con formato de error.
 */
const errorResponse = (res, message = "Error interno del servidor", details = null, statusCode = 500) => {
  const errorPayload = {
    success: false,
    error: message,
  };

  if (details && process.env.NODE_ENV !== 'production') {
    errorPayload.details = details; // Incluye detalles del error solo si no estamos en producción
  }

  return res.status(statusCode).json(errorPayload);
};

/**
 * Devuelve una respuesta de éxito estandarizada.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {string} message - Mensaje de éxito para el cliente.
 * @param {object|null} data - Datos opcionales que se incluirán en la respuesta (por ejemplo, el resultado de una operación).
 * @param {number} statusCode - Código de estado HTTP (por defecto 200).
 * @returns {object} Respuesta JSON con formato de éxito.
 */
const successResponse = (res, message = "Operación exitosa", data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Logea errores en la consola para su monitoreo en desarrollo o en sistemas de logging en producción.
 * @param {Error} error - Instancia de Error capturada.
 * @param {string} context - Descripción del contexto donde ocurrió el error.
 */
const logError = (error, context = "Error no especificado") => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR EN ${context}:`);
  console.error(error.stack || error.message || error);
};

/**
 * Genera una respuesta con paginación estándar.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Array} data - Array de datos que se incluirán en la respuesta.
 * @param {number} totalItems - Número total de elementos disponibles.
 * @param {number} page - Página actual solicitada.
 * @param {number} limit - Número máximo de elementos por página.
 * @param {string} message - Mensaje opcional para la respuesta.
 * @returns {object} Respuesta JSON con formato de paginación.
 */
const paginatedResponse = (res, data, totalItems, page, limit, message = "Operación exitosa") => {
  const totalPages = Math.ceil(totalItems / limit);
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    },
  });
};

/**
 * Maneja promesas con sintaxis async/await para simplificar control de errores.
 * @param {Promise} promise - Promesa a resolver.
 * @returns {Array} Un arreglo con [error, resultado]. Solo uno de los dos estará definido.
 */
const handleAsync = async (promise) => {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error];
  }
};

module.exports = {
  errorResponse,
  successResponse,
  logError,
  paginatedResponse,
  handleAsync,
};
