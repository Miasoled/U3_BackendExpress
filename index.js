const express = require("express");

const productos = require("./routes/productos.routes");
const autenticacion = require("./routes/auth.routes");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use("/productos", productos);
app.use("/auth", autenticacion);

const PORT = process.env.PORT || 3000;

let usuarios = [
  {
    id: 1,
    nombre: "Lisseth ",
    edad: 21,
  },
  {
    id: 2,
    nombre: "Marta",
    edad: 21,
  },
  {
    id: 3,
    nombre: "Maicol ",
    edad: 21,
  },
];

app.get("/", (req, res) => {
  res.json(usuarios);
});

app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

app.get("/inicio", (req, res) => {
  res.send("Estoy en Inicio");
});

app.get("/prueba", (req, res) => {
  res.send("Estoy en Inicio");
});

app.listen(PORT, () => {
  console.log("Escuchando en el puerto " + PORT);
});
