const express = require('express');
const router = express.Router();

// Ruta para renderizar la vista del mapa
router.get('/map', (req, res) => {
  res.render('map'); // Asegúrate de que el archivo `map.ejs` esté en la carpeta `views`
});

module.exports = router;
