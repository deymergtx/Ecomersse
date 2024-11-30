const mongoose = require('mongoose');

/**
 * Esquema para los pedidos realizados por los usuarios.
 * @property {ObjectId} user - Referencia al usuario que realizó el pedido.
 * @property {Array} products - Lista de productos incluidos en el pedido.
 * @property {number} totalPrice - Precio total del pedido.
 * @property {string} status - Estado actual del pedido. Valores permitidos: Pendiente, Enviado, Completado, Cancelado.
 * @property {Date} createdAt - Fecha y hora de creación del pedido.
 */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID del usuario es obligatorio'],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'El ID del producto es obligatorio'],
        },
        quantity: {
          type: Number,
          required: [true, 'La cantidad del producto es obligatoria'],
          min: [1, 'La cantidad debe ser al menos 1'],
        },
        price: {
          type: Number,
          required: [true, 'El precio del producto es obligatorio'],
          min: [0, 'El precio no puede ser negativo'],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, 'El precio total es obligatorio'],
      min: [0, 'El precio total no puede ser negativo'],
    },
    status: {
      type: String,
      enum: ['Pendiente', 'Enviado', 'Completado', 'Cancelado'],
      default: 'Pendiente',
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    versionKey: false, // Elimina __v (campo de versión de documentos)
  }
);

/**
 * Modelo de la colección 'orders' basado en el esquema de pedido.
 */
module.exports = mongoose.model('Order', orderSchema);
