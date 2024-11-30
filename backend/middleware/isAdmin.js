// backend/middleware/isAdmin.js

const { errorResponse } = require('../utils/utils');

/**
 * Middleware para verificar si el usuario es administrador.
 */
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Acceso denegado: solo para administradores', 403);
  }
  next();
};

module.exports = isAdmin;
