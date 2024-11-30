// middleware/auth.js

const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/utils');
const User = require('../models/User');


/**
 * Middleware de autenticación.
 * Verifica el token JWT en las cookies o en el encabezado Authorization.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Siguiente middleware a ejecutar.
 */

const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).render('unauthorized', { message: 'Debes iniciar sesión para acceder al panel.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).render('unauthorized', { message: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.' });
      }

      const user = await User.findById(decoded.userId).select('-password'); // Excluir la contraseña
      if (!user) {
        return res.status(404).render('unauthorized', { message: 'Usuario no encontrado.' });
      }

      req.user = user; // Ahora req.user tiene toda la información del usuario
      next();
    });
  } catch (error) {
    console.error('Error en el middleware de autenticación:', error.message);
    return res.status(500).send('Error interno en el servidor.');
  }
};

module.exports = auth;
