const { validationResult } = require("express-validator");
const { errorResponse } = require("../utils/utils");

/**
 * Middleware para manejar errores de validación de express-validator.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware/controlador.
 * @returns {object|function} Respuesta de error o pasa al siguiente middleware.
 */

/**
 * Middleware para manejar errores de validación de express-validator.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({ field: err.param, message: err.msg }));
    return errorResponse(res, "Errores de validación detectados", { errors: errorMessages }, 422);
  }

  next();
};



/**
 * Middleware para verificar la existencia de un cuerpo de solicitud (req.body).
 * Asegura que el cuerpo de la solicitud no esté vacío.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware/controlador.
 * @returns {object|function} Respuesta de error o pasa al siguiente middleware.
 */
const validateBodyExists = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(
      res,
      "El cuerpo de la solicitud no puede estar vacío",
      null,
      400
    );
  }
  next();
};

module.exports = {
  validateRequest,
  validateBodyExists,
};
