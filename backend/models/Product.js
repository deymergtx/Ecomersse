const mongoose = require('mongoose');

/**
 * Esquema para los productos disponibles en la plataforma.
 * @property {string} name - Nombre del producto.
 * @property {string} description - Descripción opcional del producto.
 * @property {number} price - Precio del producto.
 * @property {string} category - Categoría principal del producto (Ej: "Maíz", "Ñame").
 * @property {string} image - URL de la imagen del producto.
 * @property {number} stock - Cantidad disponible en inventario (por defecto 0).
 * @property {object} location - Ubicación en formato GeoJSON (punto con latitud y longitud).
 * @property {ObjectId} user - ID del usuario propietario del producto.
 * @property {Date} createdAt - Fecha de creación del producto.
 */

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "La descripción no puede exceder los 500 caracteres"],
    },
    image: {
      type: String,
      required: [true, "La imagen del producto es obligatoria"],
    },
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: [true, "El tipo de ubicación es obligatorio"],
      },
      coordinates: {
        type: [Number],
        required: [true, "Las coordenadas son obligatorias"],
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario propietario es obligatorio"],
    },
  },
  { timestamps: true }
);

productSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Product", productSchema);

