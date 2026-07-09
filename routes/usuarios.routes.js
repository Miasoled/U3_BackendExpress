const express = require("express");

const router = express.Router;

const conexion = require("../database/conexion");
const autenticacion = require("../middlewares/autenticacion");
const autorizacion = require("../middlewares/autorizacion");

router.get("/", autenticacion, autorizacion("CLIENTE"), async (req, res) => {
  try {
    const resultado = await conexion.query(`
            select * from productos order by id
            `);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en obtener datos" });
  }
});
