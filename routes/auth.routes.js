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
    const { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password || !rol) {
      return res.status(400).json({
        mensaje: "Ingrese las credenciales completas",
      });
    }

    const consulta = `
      SELECT 
        u.id,
        u.nombre,
        u.correo,
        r.nombre AS rol
      FROM usuarios u
      INNER JOIN roles r
        ON u.id_rol = r.id
      WHERE u.correo = $1;
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
      INSERT INTO usuarios 
      (nombre, correo, password, id_rol)
      VALUES (
        $1,
        $2,
        $3,
        (SELECT id FROM roles WHERE nombre = $4)
      )
      RETURNING id, nombre, correo;
      `,
      [nombre, correo, passwordEncriptada, rol],
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
