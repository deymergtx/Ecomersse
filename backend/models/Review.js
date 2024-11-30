const mongoose = require('mongoose');

/**
 * Esquema para las reseñas de productos realizadas por los usuarios.
 * @property {ObjectId} product - Referencia al producto reseñado.
 * @property {ObjectId} user - Referencia al usuario que realizó la reseña.
 * @property {number} rating - Calificación del producto (entre 1 y 5).
 * @property {string} comment - Comentario del usuario sobre el producto.
 * @property {Date} createdAt - Fecha en la que se creó la reseña.
 */
const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Referencia al modelo de Producto
      required: [true, 'La referencia al producto es obligatoria'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencia al modelo de Usuario
      required: [true, 'La referencia al usuario es obligatoria'],
    },
    rating: {
      type: Number,
      required: [true, 'La calificación es obligatoria'],
      min: [1, 'La calificación mínima es 1'],
      max: [5, 'La calificación máxima es 5'],
    },
    comment: {
      type: String,
      required: [true, 'El comentario es obligatorio'],
      trim: true, // Elimina espacios innecesarios
      maxlength: [500, 'El comentario no puede exceder los 500 caracteres'],
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    versionKey: false, // Elimina __v (campo de versión de documentos)
  }
);

/**
 * Modelo de la colección 'reviews' basado en el esquema de reseñas.
 */
module.exports = mongoose.model('Review', reviewSchema);
