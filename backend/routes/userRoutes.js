const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/userController');
const { validateRequest } = require('../middleware/validateRequest');
const auth = require('../middleware/auth');
const User = require('../models/User'); // Agregar esta línea


const router = express.Router();

/**
 * Ruta para registrar un nuevo usuario.
 */
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('El correo electrónico no es válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('birthdate').isISO8601().toDate().withMessage('La fecha de nacimiento no es válida'),
    body('documentId').notEmpty().withMessage('El documento de identidad es obligatorio'),
    body('address').notEmpty().withMessage('La dirección es obligatoria'),
    body('city').notEmpty().withMessage('La ciudad es obligatoria'),
    body('state').notEmpty().withMessage('El estado/departamento es obligatorio'),
    body('occupation').notEmpty().withMessage('La ocupación es obligatoria'),
    body('phone').isMobilePhone().withMessage('El número de teléfono no es válido'),
    body('gender').notEmpty().withMessage('El género es obligatorio'),
    validateRequest, // Middleware para validar la solicitud
  ],
  registerUser // Controlador para manejar la solicitud
);

/**
 * Ruta para iniciar sesión.
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('El correo electrónico no es válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validateRequest, // Middleware para validar la solicitud
  ],
  loginUser // Controlador para manejar la solicitud
);

/**
 * Cerrar sesión del usuario.
 * Limpia el token almacenado en las cookies.
 */
router.get("/logout", (req, res) => {
  try {
    // Limpiar la cookie del token
    res.clearCookie("token");
    console.log("Sesión cerrada correctamente.");
    res.redirect("/login"); // Redirige al usuario a la página de inicio de sesión
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).send("Error al cerrar la sesión.");
  }
});

// Renderizar la vista de perfil
router.get('/profile', auth, async (req, res) => {
  try {
    console.log(req.user);
    res.render('profile', { user: req.user });
  } catch (error) {
    console.error('Error al renderizar el perfil:', error);
    res.status(500).send('Error al cargar el perfil.');
  }
});

/**
 * Ruta para mostrar el formulario de configuración del perfil.
 */
// backend/routes/userRoutes.js

// Ruta para mostrar el formulario de configuración del perfil
router.get('/profile/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // Busca al usuario por su ID
    res.render('profileSettings', { user }); // Pasa los datos del usuario a la vista
  } catch (error) {
    console.error('Error al obtener los datos de usuario:', error);
    res.status(500).send('Error al cargar la configuración del perfil.');
  }
});

// Ruta para actualizar la información del perfil del usuario
router.post('/profile/settings', auth, async (req, res) => {
  try {
    const { name, email, phone, address, city, state, occupation } = req.body;

    // Actualiza la información del usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId, 
      { name, email, phone, address, city, state, occupation },
      { new: true } // Retorna el documento actualizado
    );

    // Redirige al perfil después de la actualización
    res.redirect('/profile');
  } catch (error) {
    console.error('Error al actualizar la información del usuario:', error);
    res.status(500).send('Error al actualizar la información del perfil.');
  }
});



module.exports = router;
