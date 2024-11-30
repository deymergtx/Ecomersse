const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const { errorResponse, successResponse } = require('../utils/utils');

/**
 * Sección de Usuarios
 */

// Registrar usuario
exports.registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    birthdate,
    documentId,
    address,
    city,
    state,
    occupation,
    phone,
    gender,
  } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'El usuario ya está registrado', 400);
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      birthdate,
      documentId,
      address,
      city,
      state,
      occupation,
      phone,
      gender,
      role: 'cliente',
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    return successResponse(res, 'Usuario registrado exitosamente', { user: newUser }, 201);
  } catch (error) {
    console.error('Error en el registro:', error.message);
    return errorResponse(res, 'Error en el registro del usuario');
  }
};

// Inicio de sesión de usuario
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'Credenciales inválidas', 400);
    }

    // Verificar si la contraseña coincide
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Credenciales inválidas', 400);
    }

    // Generar un token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Establecer token como una cookie segura
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return successResponse(res, 'Inicio de sesión exitoso', { token });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error.message);
    return errorResponse(res, 'Error en el inicio de sesión');
  }
};

/**
 * Sección de Pedidos
 */

// Crear un nuevo pedido
exports.createOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;

    // Crear un nuevo pedido
    const newOrder = new Order({
      user: req.user.userId,
      products,
      totalPrice,
    });

    // Guardar el pedido en la base de datos
    await newOrder.save();

    return successResponse(res, 'Pedido creado exitosamente', { order: newOrder }, 201);
  } catch (error) {
    console.error('Error al crear el pedido:', error.message);
    return errorResponse(res, 'Error al crear el pedido');
  }
};

// Obtener los pedidos del usuario autenticado
exports.getUserOrders = async (req, res) => {
  try {
    // Buscar pedidos relacionados con el usuario autenticado
    const orders = await Order.find({ user: req.user.userId }).populate(
      'products.product',
      'name price'
    );

    return successResponse(res, 'Pedidos obtenidos exitosamente', { orders });
  } catch (error) {
    console.error('Error al obtener los pedidos del usuario:', error.message);
    return errorResponse(res, 'Error al obtener los pedidos del usuario');
  }
};

// Actualizar el estado de un pedido (solo para administradores)
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validar que el ID sea válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 'ID de pedido no válido', 400);
  }

  try {
    // Actualizar el estado del pedido
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedOrder) {
      return errorResponse(res, 'Pedido no encontrado', 404);
    }

    return successResponse(res, 'Estado del pedido actualizado exitosamente', { order: updatedOrder });
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error.message);
    return errorResponse(res, 'Error al actualizar el estado del pedido');
  }
};

// Obtener todos los pedidos (solo para administradores)
exports.getAllOrders = async (req, res) => {
  try {
    // Obtener todos los pedidos con información adicional del usuario y productos
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price');

    return successResponse(res, 'Todos los pedidos obtenidos exitosamente', { orders });
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error.message);
    return errorResponse(res, 'Error al obtener todos los pedidos');
  }
};
