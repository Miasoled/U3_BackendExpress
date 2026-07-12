CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE
);

--Insertar los roles a la tabla 	
INSERT INTO roles(nombre)
VALUES
('ADMIN'),
('USER');

CREATE TABLE usuarios(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(120) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol_id INTEGER NOT NULL,
    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (rol_id)
        REFERENCES roles(id)
);
CREATE TABLE productos(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    imagen TEXT
);

--Para Modificar la tabla de Usuarios
ALTER TABLE usuarios
ADD COLUMN id_rol INTEGER NOT NULL;

ALTER TABLE usuarios
ADD CONSTRAINT fk_rol
FOREIGN KEY (id_rol)
REFERENCES roles(id);
