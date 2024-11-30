const express = require('express');
const { addProduct } = require('../controllers/productController');
const auth = require('../middleware/auth');
const { errorResponse } = require('../utils/utils');

const router = express.Router();

/**
 * Ruta para que un proveedor agregue un producto.
 * Requiere autenticación y verificación de rol de proveedor.
 */
router.post('/add', auth, (req, res, next) => {
  try {
    if (req.user && req.user.isProvider) {
      // Si el usuario autenticado es un proveedor, permite agregar el producto
      return addProduct(req, res, next);
    }
    // Si no es un proveedor, devuelve un error de acceso denegado
    return errorResponse(res, 'Acceso denegado', 403);
  } catch (error) {
    console.error('Error en la ruta de proveedor:', error.message);
    return errorResponse(res, 'Error al procesar la solicitud');
  }
});

module.exports = router;
