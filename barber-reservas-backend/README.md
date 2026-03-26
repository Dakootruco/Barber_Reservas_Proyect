# 💈 Barber-Reservas Backend API

Bienvenido a la rama principal del Backend de la plataforma **Barber-Reservas**. Este servidor estructurado en Node.js y Express proporciona una API REST lista para producción. Gestiona clientes, barberos, servicios y citas, utilizando **Prisma ORM** y **Supabase** (PostgreSQL).

## 🚀 Requisitos y Configuración Inicial

1. Asegúrate de tener Node.js instalado.
2. En la terminal del proyecto, instala las dependencias:
   ```bash
   npm install
   ```
3. Renombra el archivo `.env.example` a `.env` y configura tus variables de entorno, incluyendo la URL de tu base de datos de Supabase con conexión a PgBouncer (`DATABASE_URL`) y la de creación directa de tablas (`DIRECT_URL`).
4. Sincroniza las tablas de la base de datos (Ejecutar solo la primera vez): 
   ```bash
   npx prisma db push
   ```
5. Levanta el entorno de desarrollo en vivo: 
   ```bash
   npm run dev
   ```

---

## 📖 Documentación de Endpoints (Rutas)

### 👥 Módulo de Clientes (Frontend Público)
**Ruta Base:** `/api/cliente`

| Método | Endpoint | Descripción | Body Requerido (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/servicios` | Obtiene el catálogo completo de servicios | - |
| **GET** | `/barberos` | Obtiene la lista de barberos y su horario | - |
| **POST** | `/` | Registra a un nuevo cliente | `{ nombre, email, telefono }` |
| **GET** | `/` | Lista todos los clientes | - |
| **GET** | `/:id` | Obtiene un cliente específico + su *"Fidelity Card"* (Reservas) | - |
| **PUT** | `/:id` | Actualiza los datos de un cliente | `{ nombre, email, telefono }` |
| **DELETE**| `/:id` | Elimina un cliente permanentemente | - |
| **POST** | `/reservas` | **Crea una nueva cita (Incluye Algoritmo Anti-Overbooking)** | `{ clienteId, barberoId, servicioId, fechaHora }` |

<br/>

### 🛠️ Módulo de Administración (Dashboard Privado)
**Ruta Base:** `/api/admin`

| Método | Endpoint | Descripción | Body Requerido (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/reservas` | Línea de tiempo (*Join múltiple*) para pintar el Calendario | - |
| **PUT** | `/reservas/:id` | Cambiar estado de cita (Confirmar/Cancelar) | `{ estado }` |
| **POST** | `/servicios` | Agrega un nuevo servicio al catálogo | `{ nombre, descripcion, precio, duracion }` |
| **PUT** | `/servicios/:id` | Edita el precio o duración de un servicio dinámicamente | `{ precio, duracion }` |
| **POST** | `/barberos` | Registra personal nuevo hacia la peluquería | `{ nombre, horarioLaboral }` |
| **PUT** | `/barberos/:id` | Actualiza la jornada u horario de un barbero | `{ nombre, horarioLaboral }` |
| **GET** | `/stats` | **Estadísticas de ganancias y KPIS para gráficas de panel** | - |

---

## ⚙️ Tecnologías Base Implementadas
- **Node.js** & **Express**
- **Prisma ORM** (Seguridad de Modelos y Tipos de Datos estrictos)
- **Supabase** (Alojamiento en DaaS usando PostgreSQL)
- **Nodemon** (Hot-Reload de desarrollo)
- **Manejo Global de Errores** interceptados vía Middlewares en `/middlewares/errorHandler.js`
