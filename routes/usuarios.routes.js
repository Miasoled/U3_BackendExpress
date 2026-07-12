const express = require("express");

const router = express.Router();

const conexion = require("../database/conexion");

const authentication = require("../middlewares/autentication");
const authorization = require("../middlewares/authorization");

// Obtener todos los usuarios
router.get("/", authentication, authorization("ADMIN"), async (req, res) => {
  try {
    const resultado = await conexion.query(`
                SELECT
                    u.id,
                    u.nombre,
                    u.correo,
                    r.nombre AS rol
                FROM usuarios u
                INNER JOIN roles r
                    ON u.rol_id = r.id
                ORDER BY u.id;
            `);

    res.status(200).json(resultado.rows);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
});

module.exports = router;
