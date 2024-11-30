const mongoose = require('mongoose');

/**
 * Esquema para las categorías de productos.
 * @property {string} name - Nombre de la categoría. Campo obligatorio.
 * @property {string[]} subcategories - Lista de subcategorías asociadas a la categoría. Opcional.
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
      trim: true,
    },
    subcategories: [
      {
        type: String,
        trim: true, // Elimina espacios en blanco al inicio y final del texto
      },
    ],
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    versionKey: false, // Elimina __v (campo de versión de documentos)
  }
);

/**
 * Modelo de la colección 'categories' basado en el esquema de categoría.
 */
module.exports = mongoose.model('Category', categorySchema);
