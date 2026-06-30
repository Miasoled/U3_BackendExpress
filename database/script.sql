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
);