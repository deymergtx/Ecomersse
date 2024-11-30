const express = require('express');
const { body, param } = require('express-validator');

const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');

const { validateRequest } = require('../middleware/validateRequest');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

/**
 * Rutas para el manejo de pedidos.
 */

// Crear un nuevo pedido
router.post(
  '/',
  [
    auth,
    body('products').isArray({ min: 1 }).withMessage('Debe proporcionar al menos un producto'),
    body('totalPrice').isNumeric().withMessage('El precio total debe ser un número'),
    validateRequest,
  ],
  createOrder
);

// Obtener los pedidos del usuario autenticado
router.get('/', auth, getUserOrders);

// Actualizar el estado de un pedido (solo para administradores)
router.put(
  '/:id',
  [
    auth,
    isAdmin,
    param('id').isMongoId().withMessage('El ID proporcionado no es válido'),
    body('status')
      .isString()
      .withMessage('El estado es obligatorio')
      .isIn(['Pendiente', 'Enviado', 'Completado', 'Cancelado'])
      .withMessage(
        'El estado debe ser uno de los siguientes: Pendiente, Enviado, Completado o Cancelado'
      ),
    validateRequest,
  ],
  updateOrderStatus
);

// Obtener todos los pedidos (solo para administradores)
router.get('/all', [auth, isAdmin], getAllOrders);

module.exports = router;
