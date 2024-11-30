const mongoose = require("mongoose");
const Product = require("../models/Product");
const { errorResponse, successResponse } = require("../utils/utils");

/**
 * Crear un nuevo producto.
 */
exports.addProduct = async (req, res) => {
  try {
    const { name, price, category, newCategory, location, description } = req.body;

    const image = req.file ? req.file.filename : null;
    if (!image) {
      return errorResponse(res, "La imagen del producto es obligatoria.", 400);
    }

    if (!req.user || !req.user.userId) {
      return errorResponse(res, "El usuario propietario es obligatorio.", 400);
    }

    const finalCategory = category === "Nueva" ? newCategory?.trim() : category;
    const locationArray = location.split(",");

    const product = new Product({
      name,
      price,
      category: finalCategory,
      image,
      location: {
        type: "Point",
        coordinates: [parseFloat(locationArray[1]), parseFloat(locationArray[0])],
      },
      description: description?.trim(),
      user: req.user.userId,
    });

    await product.save();

    // Redirigir al panel con un parámetro de éxito
    return res.redirect('/panel?success=true');
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return errorResponse(res, "Error al crear el producto.");
  }
};




/**
 * Obtener todos los productos.
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return successResponse(res, "Productos obtenidos exitosamente", products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return errorResponse(res, "Error al obtener los productos.");
  }
};

/**
 * Obtener un producto por ID.
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "ID de producto no válido", 400);
    }

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, "Producto no encontrado", 404);
    }

    return successResponse(res, "Producto obtenido exitosamente", product);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return errorResponse(res, "Error al obtener el producto.");
  }
};

/**
 * Actualizar un producto.
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, location, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "ID de producto no válido", 400);
    }

    const locationArray = location.split(",");
    if (locationArray.length !== 2 || isNaN(locationArray[0]) || isNaN(locationArray[1])) {
      return errorResponse(res, "La ubicación debe estar en formato 'latitud,longitud'.", 400);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        category,
        location: {
          type: "Point",
          coordinates: [parseFloat(locationArray[1]), parseFloat(locationArray[0])],
        },
        description,
      },
      { new: true }
    );

    if (!product) {
      return errorResponse(res, "Producto no encontrado.", 404);
    }

    return successResponse(res, "Producto actualizado exitosamente", product);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return errorResponse(res, "Error al actualizar el producto.");
  }
};

/**
 * Eliminar un producto.
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "ID de producto no válido", 400);
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return errorResponse(res, "Producto no encontrado.", 404);
    }

    return successResponse(res, "Producto eliminado exitosamente");
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return errorResponse(res, "Error al eliminar el producto.");
  }
};

/**
 * Renderizar la página de productos con la lista de productos.
 */
exports.renderProductsPage = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("products", { products });
  } catch (error) {
    console.error("Error al cargar la página de productos:", error);
    return res.status(500).send("Error al cargar la página de productos.");
  }
};

/**
 * Renderizar la página de detalles de un producto.
 */
exports.renderProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).render("404", { message: "ID de producto no válido" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).render("404", { message: "Producto no encontrado" });
    }

    res.render("productDetail", { product });
  } catch (error) {
    console.error("Error al cargar los detalles del producto:", error);
    return res.status(500).send("Error al cargar los detalles del producto.");
  }
};

/**
 * Obtener productos por categoría.
 */
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category });
    res.render("categoryProducts", { products, category });
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    return res.status(500).send("Error al obtener productos por categoría.");
  }
};

/**
 * Obtener ubicación de un producto.
 */
exports.getProductLocation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "ID de producto no válido", 400);
    }

    const product = await Product.findById(id).select("location name");
    if (!product) {
      return errorResponse(res, "Producto no encontrado", 404);
    }

    return successResponse(res, "Ubicación del producto obtenida exitosamente", {
      location: product.location,
      name: product.name,
    });
  } catch (error) {
    console.error("Error al obtener la ubicación del producto:", error);
    return errorResponse(res, "Error al obtener la ubicación del producto.");
  }
};

/**
 * Renderizar la página para agregar un nuevo producto.
 */
exports.renderAddProductPage = (req, res) => {
  try {
    const predefinedCategories = ["Yuca", "Plátano", "Ñame", "Maíz"];
    res.render("addProduct", { predefinedCategories });
  } catch (error) {
    console.error("Error al renderizar la página de agregar producto:", error);
    res.status(500).send("Error al cargar la página de agregar producto.");
  }
};

/**
 * Renderizar la página principal con productos destacados.
 */
exports.renderHomePage = async (req, res) => {
  try {
    const products = await Product.find().limit(10); // Limita los productos destacados a 10
    res.render("index", { products });
  } catch (error) {
    console.error("Error al cargar la página principal:", error);
    res.status(500).send("Error al cargar la página principal.");
  }
};
