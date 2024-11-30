const Order = require('../models/Order');
const mongoose = require('mongoose');
const { errorResponse, successResponse } = require('../utils/utils');

/**
 * Crear un nuevo pedido.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta JSON con el estado de la operación.
 */
exports.createOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;

    // Validar campos requeridos
    if (!products || !Array.isArray(products) || products.length === 0) {
      return errorResponse(res, 'La lista de productos es obligatoria y debe tener al menos un elemento.', 400);
    }
    if (!totalPrice || typeof totalPrice !== 'number') {
      return errorResponse(res, 'El precio total es obligatorio y debe ser un número.', 400);
    }

    // Crear el pedido
    const newOrder = new Order({
      user: req.user.userId,
      products,
      totalPrice,
    });

    await newOrder.save();

    return successResponse(res, 'Pedido creado exitosamente.', { order: newOrder }, 201);
  } catch (error) {
    console.error('Error al crear el pedido:', error.message);
    return errorResponse(res, 'Error al crear el pedido.', null, 500);
  }
};

/**
 * Obtener los pedidos del usuario autenticado.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta JSON con los pedidos del usuario.
 */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('products.product', 'name price');
    return successResponse(res, 'Pedidos obtenidos exitosamente.', { orders });
  } catch (error) {
    console.error('Error al obtener los pedidos del usuario:', error.message);
    return errorResponse(res, 'Error al obtener los pedidos del usuario.', null, 500);
  }
};

/**
 * Actualizar el estado de un pedido (solo para administradores).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta JSON con el estado actualizado del pedido.
 */
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validar el ID del pedido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 'ID de pedido no válido.', null, 400);
  }

  // Validar el estado
  const validStatuses = ['Pendiente', 'Enviado', 'Completado', 'Cancelado'];
  if (!validStatuses.includes(status)) {
    return errorResponse(res, `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}.`, null, 400);
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedOrder) {
      return errorResponse(res, 'Pedido no encontrado.', null, 404);
    }

    return successResponse(res, 'Estado del pedido actualizado exitosamente.', { order: updatedOrder });
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error.message);
    return errorResponse(res, 'Error al actualizar el estado del pedido.', null, 500);
  }
};

/**
 * Obtener todos los pedidos (solo para administradores).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta JSON con todos los pedidos.
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price');
    return successResponse(res, 'Todos los pedidos obtenidos exitosamente.', { orders });
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error.message);
    return errorResponse(res, 'Error al obtener todos los pedidos.', null, 500);
  }
};
