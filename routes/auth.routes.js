const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const conexion = require("../database/conexion");
const generarToken = require("../config/jwt");

router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Ingrese el correo y la contraseña",
      });
    }

    const consulta = `
        select * from usuarios where corre = $1;
        `;

    const resultado = await conexion.query(consulta, [correo]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ Mensaje: "no encontrado" });
    }

    const usuario = resultado.rows[0];

    const esCorreo = await bcrypt.compare(password, correo.password);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
