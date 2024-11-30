const Category = require('../models/Category');
const { errorResponse, successResponse } = require('../utils/utils'); // Utilidades para respuestas estándar
const mongoose = require('mongoose');

// Agregar una nueva categoría
exports.addCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;

    const category = new Category({ name, subcategories });
    await category.save();

    return successResponse(res, 'Categoría creada exitosamente', category, 201);
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    return errorResponse(res, 'Error al crear la categoría');
  }
};

// Obtener todas las categorías
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return successResponse(res, 'Categorías obtenidas exitosamente', categories);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    return errorResponse(res, 'Error al obtener las categorías');
  }
};

// Obtener una categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 'ID de categoría no válido', null, 400);
    }

    const category = await Category.findById(id);
    if (!category) {
      return errorResponse(res, 'Categoría no encontrada', null, 404);
    }

    return successResponse(res, 'Categoría obtenida exitosamente', category);
  } catch (error) {
    console.error('Error al obtener la categoría:', error);
    return errorResponse(res, 'Error al obtener la categoría');
  }
};

// Actualizar una categoría
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subcategories } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 'ID de categoría no válido', null, 400);
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, subcategories },
      { new: true }
    );

    if (!category) {
      return errorResponse(res, 'Categoría no encontrada', null, 404);
    }

    return successResponse(res, 'Categoría actualizada exitosamente', category);
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    return errorResponse(res, 'Error al actualizar la categoría');
  }
};

// Eliminar una categoría
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 'ID de categoría no válido', null, 400);
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return errorResponse(res, 'Categoría no encontrada', null, 404);
    }

    return successResponse(res, 'Categoría eliminada exitosamente');
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    return errorResponse(res, 'Error al eliminar la categoría');
  }
};
