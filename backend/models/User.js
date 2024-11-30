const mongoose = require('mongoose');

/**
 * Esquema para los usuarios de la plataforma.
 * @property {string} name - Nombre completo del usuario.
 * @property {string} email - Dirección de correo electrónico del usuario (único).
 * @property {string} password - Contraseña cifrada del usuario.
 * @property {Date} birthdate - Fecha de nacimiento del usuario.
 * @property {string} documentId - Identificación única del usuario (DNI, cédula, etc.).
 * @property {string} address - Dirección del usuario.
 * @property {string} city - Ciudad de residencia del usuario.
 * @property {string} state - Estado o región del usuario.
 * @property {string} occupation - Ocupación laboral del usuario.
 * @property {string} phone - Número de teléfono del usuario.
 * @property {string} gender - Género del usuario.
 * @property {string} role - Rol del usuario (por defecto, 'cliente').
 */

/**
 * Esquema para los usuarios de la plataforma.
 * Define la estructura y validaciones para los datos de los usuarios.
 * Incluye campos como nombre, email, contraseña, ubicación, entre otros.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder los 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo electrónico no es válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    birthdate: {
      type: Date,
      required: [true, 'La fecha de nacimiento es obligatoria'],
    },
    documentId: {
      type: String,
      required: [true, 'El documento de identidad es obligatorio'],
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'La dirección es obligatoria'],
      trim: true,
      maxlength: [200, 'La dirección no puede exceder los 200 caracteres'],
    },
    city: {
      type: String,
      required: [true, 'La ciudad es obligatoria'],
      trim: true,
      maxlength: [100, 'La ciudad no puede exceder los 100 caracteres'],
    },
    state: {
      type: String,
      required: [true, 'El estado o región es obligatorio'],
      trim: true,
      maxlength: [100, 'El estado o región no puede exceder los 100 caracteres'],
    },
    occupation: {
      type: String,
      required: [true, 'La ocupación es obligatoria'],
      trim: true,
      maxlength: [100, 'La ocupación no puede exceder los 100 caracteres'],
    },
    phone: {
      type: String,
      required: [true, 'El número de teléfono es obligatorio'],
      match: [/^\+?[0-9]{10,15}$/, 'El número de teléfono no es válido'],
    },
    gender: {
      type: String,
      required: [true, 'El género es obligatorio'],
      enum: ['Masculino', 'Femenino', 'Otro', 'Prefiero no decirlo'],
    },
    role: {
      type: String,
      default: 'cliente',
      enum: ['cliente', 'admin', 'proveedor'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'], // GeoJSON para manejar ubicaciones
      },
      coordinates: {
        type: [Number], // Almacena [longitud, latitud]
        default: undefined, // Opcional hasta que el usuario registre la ubicación
      },
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    versionKey: false, // Desactiva el campo __v
  }
);

// Índice geoespacial para búsquedas por ubicación (si la ubicación es usada).
userSchema.index({ location: '2dsphere' });

/**
 * Modelo de la colección 'users' basado en el esquema de usuarios.
 */
module.exports = mongoose.model('User', userSchema);