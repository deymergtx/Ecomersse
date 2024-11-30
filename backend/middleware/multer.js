const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Verifica y crea la carpeta de uploads si no existe
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Define el directorio donde se almacenarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombra el archivo con la fecha actual y el nombre original
  },
});

// Configuración de filtros para validar el tipo de archivo
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const isExtValid = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeValid = allowedFileTypes.test(file.mimetype);

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes en formato JPEG, JPG o PNG"));
  }
};

// Inicializa el middleware de multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo de 5MB
});

module.exports = upload;
