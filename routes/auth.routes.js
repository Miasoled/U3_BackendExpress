const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const conexion = require("../database/conexion");
const generarToken = require("../config/jwt");

router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Debe completar todos los campos.",
      });
    }

    const consultaCorreo = `
            SELECT id
            FROM usuarios
            WHERE correo = $1;
        `;

    const resultadoCorreo = await conexion.query(consultaCorreo, [correo]);

    if (resultadoCorreo.rows.length > 0) {
      return res.status(400).json({
        mensaje: "El correo ya se encuentra registrado.",
      });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const consulta = `
            INSERT INTO usuarios
            (
                nombre,
                correo,
                password,
                rol_id
            )
            VALUES
            (
                $1,
                $2,
                $3,
                2
            )
            RETURNING
                id,
                nombre,
                correo;
        `;

    const resultado = await conexion.query(consulta, [
      nombre,
      correo,
      passwordEncriptada,
    ]);

    res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      usuario: resultado.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error interno del servidor.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Debe ingresar el correo y la contraseña.",
      });
    }

    const consulta = `
            SELECT
                u.id,
                u.nombre,
                u.correo,
                u.password,
                r.nombre AS rol
            FROM usuarios u
            INNER JOIN roles r
                ON u.rol_id = r.id
            WHERE u.correo = $1;
        `;

    const resultado = await conexion.query(consulta, [correo]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado.",
      });
    }

    const usuario = resultado.rows[0];

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta.",
      });
    }

    const token = generarToken(usuario);

    delete usuario.password;

    res.status(200).json({
      mensaje: "Inicio de sesión correcto.",
      token,
      usuario,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error interno del servidor.",
    });
  }
});

module.exports = router;
