const express = require('express');
const { check, param } = require('express-validator');

const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController'); // Asegúrate de que todos los controladores estén correctamente importados

const auth = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest'); // Middleware de validación

const router = express.Router();

/**
 * Rutas para la gestión de categorías
 */

// Validaciones comunes para categorías
const categoryValidations = [
  check('name').notEmpty().withMessage('El nombre de la categoría es obligatorio'),
  check('subcategories')
    .optional()
    .isArray()
    .withMessage('Las subcategorías deben ser un arreglo válido'),
];

// Crear una nueva categoría
router.post(
  '/add',
  [
    auth, // Verifica que el usuario esté autenticado
    ...categoryValidations,
    validateRequest, // Middleware para manejar errores de validación
  ],
  (req, res, next) => {
    if (typeof addCategory !== 'function') {
      console.error('Error: addCategory no está definido.');
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor: controlador no definido.',
      });
    }
    addCategory(req, res, next);
  }
);

// Obtener todas las categorías
router.get('/', (req, res, next) => {
  if (typeof getCategories !== 'function') {
    console.error('Error: getCategories no está definido.');
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor: controlador no definido.',
    });
  }
  getCategories(req, res, next);
});

// Obtener una categoría por ID
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('El ID de la categoría debe ser un ID válido de MongoDB'),
    validateRequest, // Middleware para manejar errores de validación
  ],
  (req, res, next) => {
    if (typeof getCategoryById !== 'function') {
      console.error('Error: getCategoryById no está definido.');
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor: controlador no definido.',
      });
    }
    getCategoryById(req, res, next);
  }
);

// Actualizar una categoría
router.put(
  '/:id',
  [
    auth,
    param('id').isMongoId().withMessage('El ID de la categoría debe ser un ID válido de MongoDB'),
    ...categoryValidations,
    validateRequest,
  ],
  (req, res, next) => {
    if (typeof updateCategory !== 'function') {
      console.error('Error: updateCategory no está definido.');
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor: controlador no definido.',
      });
    }
    updateCategory(req, res, next);
  }
);

// Eliminar una categoría
router.delete(
  '/:id',
  [
    auth,
    param('id').isMongoId().withMessage('El ID de la categoría debe ser un ID válido de MongoDB'),
    validateRequest,
  ],
  (req, res, next) => {
    if (typeof deleteCategory !== 'function') {
      console.error('Error: deleteCategory no está definido.');
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor: controlador no definido.',
      });
    }
    deleteCategory(req, res, next);
  }
);

module.exports = router;
