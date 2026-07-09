const autorizacion = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      res.status(401).json({ Mensaje: "Usuario no autenticado" });
    }

    if (rolesPermitidos.includes(req.usuario.rol)) {
      res.status(403).json({ Mensaje: "Usuario no tienen permiso" });
    }

    next();
  };
};

module.exports = autorizacion;
