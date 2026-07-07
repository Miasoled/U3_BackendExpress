const express = require("express");

const router = express.Router();

const conexion = require("../database/conexion");
const autenticacion = require("../middlewares/autenticacion");

//Obteber todo
router.get("/", autenticacion, async (req, res) => {
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

//Obtener uno especifico
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await conexion.query(
      `
      SELECT * FROM productos WHERE id = $1
      `,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en obtener datos" });
  }
});

//Crear un registro
router.post("/", async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);

    const { nombre, descripcion, stock, precio, imagen } = req.body;

    const resultado = await conexion.query(
      `
      INSERT INTO productos (
        nombre, descripcion, stock, precio, imagen
      ) VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
      `,
      [nombre, descripcion, stock, precio, imagen],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al crear producto" });
  }
});

//Actualizar un registro
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("ID recibido:", id);
    console.log("Datos recibidos:", req.body);

    const { nombre, descripcion, stock, precio, imagen } = req.body;

    const resultado = await conexion.query(
      `
      UPDATE productos 
      SET nombre = $1, descripcion = $2, stock = $3, precio = $4, imagen = $5
      WHERE id = $6
      RETURNING *;
      `,
      [nombre, descripcion, stock, precio, imagen, id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al actualizar producto" });
  }
});

//sentencia de delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await conexion.query(
      `
      DELETE from productos WHERE id = $1 RETURNING *;
      `,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al eliminar" });
  }
});

module.exports = router;
