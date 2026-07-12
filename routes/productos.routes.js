const express = require("express");

const router = express.Router();

const conexion = require("../database/conexion");
const authentication = require("../middlewares/autentication");
const authorization = require("../middlewares/authorization");

router.get("/", async (req, res) => {
  try {
    const resultado = await conexion.query(`
            SELECT *
            FROM productos
            ORDER BY id;
        `);

    res.status(200).json(resultado.rows);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await conexion.query(
      `
            SELECT *
            FROM productos
            WHERE id = $1;
            `,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado.",
      });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
});

// Crear producto
router.post("/", authentication, authorization("ADMIN"), async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen } = req.body;

    const resultado = await conexion.query(
      `
                INSERT INTO productos
                (
                    nombre,
                    descripcion,
                    precio,
                    stock,
                    imagen
                )
                VALUES
                (
                    $1,$2,$3,$4,$5
                )
                RETURNING *;
                `,
      [nombre, descripcion, precio, stock, imagen],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
});

// Actualizar producto

router.put("/:id", authentication, authorization("ADMIN"), async (req, res) => {
  try {
    const { id } = req.params;

    const { nombre, descripcion, precio, stock, imagen } = req.body;

    const resultado = await conexion.query(
      `
                UPDATE productos
                SET
                    nombre=$1,
                    descripcion=$2,
                    precio=$3,
                    stock=$4,
                    imagen=$5
                WHERE id=$6
                RETURNING *;
                `,
      [nombre, descripcion, precio, stock, imagen, id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado.",
      });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
});

// Eliminar producto
router.delete(
  "/:id",
  authentication,
  authorization("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const resultado = await conexion.query(
        `
                DELETE
                FROM productos
                WHERE id = $1
                RETURNING *;
                `,
        [id],
      );

      if (resultado.rows.length === 0) {
        return res.status(404).json({
          mensaje: "Producto no encontrado.",
        });
      }

      res.status(200).json({
        mensaje: "Producto eliminado correctamente.",
      });
    } catch (error) {
      res.status(500).json({
        mensaje: error.message,
      });
    }
  },
);

module.exports = router;
