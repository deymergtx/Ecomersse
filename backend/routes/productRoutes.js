const express = require("express");
const path = require("path");
const { body, param } = require("express-validator");
const router = express.Router();
const upload = require("../middleware/multer");
const auth = require("../middleware/auth"); // Middleware para autenticación
const { validateRequest } = require("../middleware/validateRequest"); // Middleware para validaciones
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  renderProductsPage,
  renderProductById,
  getProductsByCategory,
  getProductLocation,
  renderAddProductPage,
} = require("../controllers/productController");


// Validaciones
const validateProductBody = [
  body("name")
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio.")
    .isString()
    .withMessage("El nombre debe ser una cadena de texto."),
  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio.")
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser un número válido."),
  body("category")
    .notEmpty()
    .withMessage("La categoría es obligatoria."),
  body("location")
    .notEmpty()
    .withMessage("La ubicación es obligatoria.")
    .custom((value) => {
      const coords = value.split(",");
      if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
        throw new Error("La ubicación debe estar en formato 'latitud,longitud'.");
      }
      return true;
    }),
  validateRequest,
];

// Validación de parámetros (ejemplo: validar ID)
const validateProductId = [
  param("id").isMongoId().withMessage("ID de producto no válido."),
  validateRequest,
];

// Rutas para vistas de frontend
router.get("/list", (req, res, next) => {
  console.log("Ruta alcanzada: /products/list");
  next();
}, renderProductsPage);

router.get("/detail/:id", (req, res, next) => {
  console.log("Ruta alcanzada: /products/detail/:id");
  console.log("ID proporcionado:", req.params.id);
  next();
}, validateProductId, renderProductById);

router.get("/category/:category", (req, res, next) => {
  console.log("Ruta alcanzada: /products/category/:category");
  console.log("Categoría proporcionada:", req.params.category);
  next();
}, getProductsByCategory);

router.get("/location/:id", (req, res, next) => {
  console.log("Ruta alcanzada: /products/location/:id");
  console.log("ID proporcionado:", req.params.id);
  next();
}, validateProductId, getProductLocation);

router.get("/add", (req, res, next) => {
  console.log("Ruta alcanzada: /products/add");
  next();
}, auth, renderAddProductPage);

// Rutas de API para manejo de productos
router.post(
  "/add",
  upload.single("image"), // Middleware para manejar la subida de la imagen
  (req, res, next) => {
    // Logs para depuración
    console.log("Ruta alcanzada: /products/add (POST)");
    console.log("Datos recibidos en la solicitud:", req.body);
    console.log("Archivo subido:", req.file ? req.file.filename : "No se subió ningún archivo");

    // Validación: Verificar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "La imagen del producto es obligatoria.",
      });
    }

    next(); // Pasar al siguiente middleware si todo está correcto
  },
  auth, // Middleware de autenticación
  validateProductBody, // Middleware para validar el cuerpo de la solicitud
  addProduct // Controlador para agregar el producto
);


router.get("/", (req, res, next) => {
  console.log("Ruta alcanzada: /products/");
  next();
}, getProducts);

router.get("/:id", (req, res, next) => {
  console.log("Ruta alcanzada: /products/:id");
  console.log("ID proporcionado:", req.params.id);
  next();
}, auth, validateProductId, getProductById);

router.put("/:id", (req, res, next) => {
  console.log("Ruta alcanzada: /products/:id (PUT)");
  console.log("ID proporcionado:", req.params.id);
  console.log("Datos recibidos en la solicitud:", req.body);
  next();
}, auth, validateProductId, validateProductBody, updateProduct);

router.delete("/:id", (req, res, next) => {
  console.log("Ruta alcanzada: /products/:id (DELETE)");
  console.log("ID proporcionado:", req.params.id);
  next();
}, auth, validateProductId, deleteProduct);

// Diagnóstico: Mostrar las rutas registradas
console.log("Rutas de productos registradas:");
router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(
      `${Object.keys(middleware.route.methods)[0].toUpperCase()} ${
        middleware.route.path
      }`
    );
  }
});

module.exports = router;
