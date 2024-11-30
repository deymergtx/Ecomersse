const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const providerRoutes = require('./routes/providerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const mapRoutes = require('./routes/map'); // Ruta para la funcionalidad del mapa


// Importar modelos
const Product = require('./models/Product'); // Modelo de productos

// Importar middlewares
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/auth');

// Importar controladores
const productController = require('./controllers/productController');

// Configurar dotenv
dotenv.config();

// Inicializar la aplicación
const app = express();

// Configurar vistas y archivos estáticos
app.set('views', path.join(__dirname, '../frontend/views')); // Ruta de las vistas EJS
app.set('view engine', 'ejs'); // Motor de vistas
app.use(express.static(path.join(__dirname, '../frontend/public'))); // Archivos estáticos (CSS, JS, imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Ruta estática para imágenes subidas

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Logs de diagnóstico
console.log('Inicializando servidor...');
console.log('Directorios configurados:');
console.log(`Vistas: ${path.join(__dirname, '../frontend/views')}`);
console.log(`Archivos estáticos: ${path.join(__dirname, '../frontend/public')}`);

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/', mapRoutes);
app.use('/api/products', productRoutes);
app.use("/", userRoutes);

// Rutas para productos
app.use('/products', productRoutes);

// Rutas de vistas (frontend)
app.get('/', productController.renderHomePage);
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));

// Ruta protegida: panel de usuario
app.get('/panel', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.render('panel', { user: req.user, products });
  } catch (error) {
    console.error('Error al cargar el panel:', error);
    res.status(500).send('Error al cargar el panel.');
  }
});

// Middleware de manejo de errores
app.use(errorHandler);

console.log('Servidor configurado exitosamente.');

module.exports = app;
