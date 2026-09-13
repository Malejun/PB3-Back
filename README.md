# Backend - E-commerce / Carrito de Compras

API REST desarrollada con Node.js, Express y Prisma para una tienda online con autenticación, gestión de productos, carrito, wishlist y facturas PDF.

## 🚀 Descripción

Este backend sirve como API para una aplicación de comercio electrónico. Permite:

- Registro e inicio de sesión de usuarios.
- Autenticación con JWT en cookies y Authorization header.
- CRUD de productos para administradores.
- Carrito de compras por usuario.
- Wishlist de productos.
- Checkout de pedidos.
- Generación de facturas en PDF por pedido.
- Integración con PostgreSQL mediante Prisma.
- Subida de imágenes a Cloudinary.

## 🛠️ Stack tecnológico

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Cloudinary
- bcrypt
- cookie-parser
- Multer
- Stripe (dependencia presente en el proyecto)

## 📁 Estructura del proyecto

```bash
.
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── invoice.controller.js
│   │   ├── products.controller.js
│   │   └── wishlist.controller.js
│   ├── lib/
│   │   ├── cloudinary.js
│   │   └── prisma.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── cart.routes.js
│   │   ├── invoice.routes.js
│   │   ├── products.routes.js
│   │   └── wishlist.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── cart.service.js
│   │   ├── invoice.service.js
│   │   ├── products.service.js
│   │   └── wishlist.service.js
│   └── server.js
├── tests/
│   └── invoice.test.js
├── package.json
├── prisma.config.ts
├── README.md
└── .env
```

## ✅ Requisitos previos

- Node.js 18 o superior
- PostgreSQL en funcionamiento
- npm o pnpm
- Cuenta de Cloudinary para subir imágenes

## ⚙️ Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd Back
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
COMPANY_NAME="Mi Tienda"
NODE_ENV=development
```

> Ajusta los valores según tu configuración local de PostgreSQL y Cloudinary.

4. Genera el cliente de Prisma y aplica las migraciones:

```bash
npx prisma generate
npx prisma db push
```

## ▶️ Ejecución

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

La API quedará disponible normalmente en:

```text
http://localhost:3000
```

## 🔐 Autenticación

La autenticación se realiza con JWT y se guarda en una cookie llamada `token`.

También se acepta el header:

```http
Authorization: Bearer <token>
```

## 📡 Endpoints principales

### Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
GET /api/me
```

### Productos

```http
GET /api/products
POST /api/products
POST /api/products/upload
PUT /api/products/:id
DELETE /api/products/:id
```

> Las rutas de creación, edición y eliminación de productos requieren rol `ADMIN`.

### Carrito

```http
GET /api/cart
POST /api/cart/items
DELETE /api/cart/items/:productId
DELETE /api/cart/items
POST /api/cart/checkout
GET /api/cart/orders
```

### Wishlist

```http
GET /api/wishlist
POST /api/wishlist/toggle
```

### Facturas

```http
GET /api/invoices/:orderId/pdf
```

## 🧩 Modelo de datos

El esquema Prisma incluye estos modelos principales:

- `User`
- `Product`
- `CartItem`
- `WishlistItem`
- `Order`
- `OrderItem`

## 🧪 Pruebas

Se incluye una prueba para verificar que la generación de PDF funciona correctamente:

```bash
node --test
```

## 📝 Notas importantes

- Las imágenes de productos se suben a Cloudinary.
- El usuario autenticado puede ver su propio carrito, wishlist y pedidos.
- Los administradores pueden gestionar productos y cargas de imágenes.
- El cliente Prisma se inicializa con PostgreSQL mediante `DATABASE_URL`.

## 👨‍💻 Autor

Proyecto backend para una tienda online desarrollado en el bootcamp.

Miguel del Llano Lombardo
https://github.com/Malejun