const Review = require('../models/Review');
const { errorResponse, successResponse } = require('../utils/utils');

/**
 * Agregar una reseña a un producto.
 */
exports.addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    // Verificar si el usuario ya ha dejado una reseña para este producto
    const existingReview = await Review.findOne({ product: productId, user: req.user.userId });
    if (existingReview) {
      return errorResponse(res, 'Ya has dejado una reseña para este producto', 400);
    }

    // Crear la reseña
    const newReview = new Review({
      product: productId,
      user: req.user.userId,
      rating,
      comment,
    });

    await newReview.save();
    return successResponse(res, 'Reseña agregada exitosamente', { review: newReview }, 201);
  } catch (error) {
    console.error('Error al agregar la reseña:', error.message);
    return errorResponse(res, 'Error al agregar la reseña');
  }
};

/**
 * Obtener todas las reseñas de un producto.
 */
exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId }).populate('user', 'name');

    if (!reviews.length) {
      return successResponse(res, 'No hay reseñas para este producto', { reviews: [] });
    }

    return successResponse(res, 'Reseñas obtenidas exitosamente', { reviews });
  } catch (error) {
    console.error('Error al obtener las reseñas:', error.message);
    return errorResponse(res, 'Error al obtener las reseñas');
  }
};
