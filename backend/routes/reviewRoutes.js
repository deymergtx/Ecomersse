const express = require('express');
const { body, param } = require('express-validator');

const { addReview, getProductReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

/**
 * Rutas para la gestión de reseñas.
 */

// Ruta para agregar una reseña
router.post(
  '/',
  [
    auth, // Middleware para verificar que el usuario está autenticado
    body('productId')
      .isMongoId()
      .withMessage('El ID del producto debe ser un ID válido de MongoDB'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('La calificación debe ser un número entre 1 y 5'),
    body('comment')
      .isString()
      .notEmpty()
      .withMessage('El comentario no puede estar vacío'),
    validateRequest, // Middleware para manejar errores de validación
  ],
  (req, res, next) => {
    if (typeof addReview !== 'function') {
      console.error('Error: addReview no está definido.');
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor: controlador no definido.',
      });
    }
    addReview(req, res, next);
  }
);

// Ruta para obtener las reseñas de un producto específico
router.get(
  '/:productId',
  [
    param('productId')
      .isMongoId()
      .withMessage('El ID del producto debe ser un ID válido de MongoDB'),
    validateRequest, // Middleware para manejar errores de validación
  ],
  (req, res, next) => {
    if (typeof getProductReviews !== 'function') {
      console.error('Error: getProductReviews no está definido.');
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor: controlador no definido.',
      });
    }
    getProductReviews(req, res, next);
  }
);

module.exports = router;
