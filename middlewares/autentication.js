const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const encabezado = req.headers.authorization;

  if (!encabezado) {
    return res.status(401).json({
      mensaje: "Debe enviar un token.",
    });
  }

  const token = encabezado.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      mensaje: "Token inválido.",
    });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token expirado o inválido.",
    });
  }
};

module.exports = authentication;
