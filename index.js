require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PUERTO = process.env.PUERTO || 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", require("./routes/auth.routes"));
app.use("/productos", require("./routes/productos.routes"));
app.use("/usuarios", require("./routes/usuarios.routes"));

app.listen(PUERTO, () => {
  console.log("Servidor ejecutándose en el puerto " + PUERTO);
});
