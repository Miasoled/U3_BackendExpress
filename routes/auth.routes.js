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
        select * from usuarios where correo = $1;
        `;

    const resultado = await conexion.query(consulta, [correo]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ Mensaje: "Credenciales incorrectas" });
    }

    const usuario = resultado.rows[0];

    const esCorrecto = await bcrypt.compare(password, usuario.password);

    if (!esCorrecto) {
      return res.status(404).json({ Mensaje: "Credenciales incorrectas" });
    }

    const token = generarToken(usuario);

    delete usuario.password;

    res.json({
      mensaje: "Inicio de sesion exitoso",
      token,
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

//Nueva ruta
router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Ingrese las credenciales completas",
      });
    }

    const consulta = `
      SELECT id FROM usuarios WHERE correo = $1;
    `;

    const resultado = await conexion.query(consulta, [correo]);

    if (resultado.rows.length > 0) {
      return res.status(400).json({
        mensaje: "El correo ya existe",
      });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const nuevoUsuario = await conexion.query(
      `
      INSERT INTO usuarios (nombre, correo, password)
      VALUES ($1, $2, $3)
      RETURNING id, nombre, correo;
      `,
      [nombre, correo, passwordEncriptada],
    );

    res.status(201).json({
      mensaje: "Usuario creado exitosamente",
      usuario: nuevoUsuario.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error en el servidor",
    });
  }
});

module.exports = router;
