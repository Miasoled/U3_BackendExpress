create table productos (
	id serial primary key,
	nombre text,
	descripcion text,
	stock int,
	precio numeric(10,2),
	imagen text
);

create table usuarios (
    id serial primary key,
    nombre text not null,
    correo text not null,
    password text not null
	id_rol integer not null,
	constrain fk_rol foreign key (id_rol) references roles(id) 
);

create table roles (
    id serial primary key,
    nombre text not null unique
);

--Para Modificar la tabla de Usuarios
ALTER TABLE usuarios
ADD COLUMN id_rol INTEGER NOT NULL;

ALTER TABLE usuarios
ADD CONSTRAINT fk_rol
FOREIGN KEY (id_rol)
REFERENCES roles(id);

--Insertar los roles a la tabla 	
insert into roles (nombre) values ('ADMIN'), ('VENDEDOR'), ('CLIENTE');