# API REST con JWT y Control de Acceso por Roles

API REST desarrollada con Node.js y Express para la administración de productos, con autenticación basada en JSON Web Token (JWT) y autorización por roles.

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- bcrypt
- jsonwebtoken
- dotenv
- nodemon

## Estructura del proyecto

```
ApiJWT/
├── config/
│   └── jwt.js
├── database/
│   ├── conexion.js
│   └── script.sql
├── middlewares/
│   ├── autentication.js
│   └── authorization.js
├── routes/
│   ├── auth.routes.js
│   ├── productos.routes.js
│   └── usuarios.routes.js
├── .env
├── index.js
└── package.json
```

## Instalación

1. Clonar o descargar el proyecto.

2. Instalar las dependencias:
```bash
npm install
```

3. Crear el archivo `.env` en la raíz del proyecto con el siguiente contenido:
```
PUERTO=3000
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=api_jwt
DB_USER=postgres
DB_PASSWORD=123456
JWT_SECRET=MiClaveSecretaJWT
```

4. Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE api_jwt;
```

5. Ejecutar el script SQL ubicado en `database/script.sql` para crear las tablas e insertar los roles iniciales.

6. Iniciar el servidor:
```bash
npm run dev
```

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| PUERTO | Puerto donde corre el servidor |
| DB_HOST | Host de PostgreSQL |
| DB_PORT | Puerto de PostgreSQL |
| DB_DATABASE | Nombre de la base de datos |
| DB_USER | Usuario de PostgreSQL |
| DB_PASSWORD | Contraseña de PostgreSQL |
| JWT_SECRET | Clave secreta para firmar los tokens JWT |

---

## Roles del sistema

| ID | Rol | Descripción |
|---|---|---|
| 1 | ADMIN | Acceso completo a todos los recursos |
| 2 | USER | Solo puede consultar productos |

---

## Endpoints

### Autenticación — `/auth`

#### Registrar usuario
```
POST /auth/register
```
Body:
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@gmail.com",
  "password": "123456"
}
```
Todos los usuarios registrados reciben automáticamente el rol USER.

#### Iniciar sesión
```
POST /auth/login
```
Body:
```json
{
  "correo": "juan@gmail.com",
  "password": "123456"
}
```
Devuelve un token JWT válido por 1 hora.

---

### Productos — `/productos`

| Método | Ruta | Descripción | Requiere token | Rol requerido |
|---|---|---|---|---|
| GET | /productos | Obtener todos los productos | No | — |
| GET | /productos/:id | Obtener un producto por ID | No | — |
| POST | /productos | Crear un producto | Sí | ADMIN |
| PUT | /productos/:id | Actualizar un producto | Sí | ADMIN |
| DELETE | /productos/:id | Eliminar un producto | Sí | ADMIN |

Ejemplo body para crear o actualizar un producto:
```json
{
  "nombre": "Laptop Lenovo",
  "descripcion": "Laptop Core i7 de 16 GB RAM",
  "precio": 1250,
  "stock": 10,
  "imagen": "https://servidor.com/laptop.jpg"
}
```

---

### Usuarios — `/usuarios`

| Método | Ruta | Descripción | Requiere token | Rol requerido |
|---|---|---|---|---|
| GET | /usuarios | Obtener todos los usuarios | Sí | ADMIN |

---

## Autenticación con JWT

Las rutas protegidas requieren enviar el token en el encabezado de la petición:

```
Authorization: Bearer <token>
```

El token se obtiene al iniciar sesión en `/auth/login`.

---

## Códigos de respuesta

| Código | Significado |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado correctamente |
| 400 | Datos inválidos o incompletos |
| 401 | Token ausente o inválido |
| 403 | Sin permisos para realizar la acción |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## Ejemplos de respuestas

#### 401 — Sin token
```json
{
  "mensaje": "Debe enviar un token"
}
```

#### 401 — Token inválido o expirado
```json
{
  "mensaje": "Token inválido o expirado"
}
```

#### 403 — Sin permisos
```json
{
  "mensaje": "No tiene permisos para realizar esta acción."
}
```

---

## Asignar rol ADMIN a un usuario

Ejecutar la siguiente consulta en PostgreSQL:

```sql
UPDATE usuarios SET rol_id = 1 WHERE correo = 'juan@gmail.com';
```

Después volver a iniciar sesión para obtener un nuevo token con el rol actualizado.
