require("dotenv").config();

const express = require("express");

const app = express();

const PUERTO = process.env.PUERTO || 3000;

app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
app.use("/productos", require("./routes/productos.routes"));
app.use("/usuarios", require("./routes/usuarios.routes"));

app.listen(PUERTO, () => {
  console.log("Servidor ejecutándose en el puerto " + PUERTO);
});
