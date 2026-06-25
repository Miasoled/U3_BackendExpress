//npm install express para instalar
//npm install -g nodemon
//npm i dotenv
const express = require("express");

const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 3000;

let usuarios = [
  {
    id: 1,
    nombre: "Lisseth ",
    edad: 21,
  },
  {
    id: 2,
    nombre: "Lisseth ",
    edad: 21,
  },
  {
    id: 3,
    nombre: "Lisseth ",
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
