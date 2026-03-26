import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clienteRoutes from './src/routes/cliente.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// RUTAS
// ==========================================

// Usar el nuevo archivo de rutas para todo lo de cliente
app.use('/api/cliente', clienteRoutes);

// Usar archivo de rutas para el portal de Administrador
app.use('/api/admin', adminRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('💈 Bienvenido al API de Reservas de Barbería 💈');
});

// ==========================================
// MANEJO DE ERRORES E INTERCEPTORES
// ==========================================
// 1. Si la petición llega aquí, es porque ninguna ruta anterior (ni admin ni cliente) hizo "match". 
//    Entonces es un 404 (Not Found).
app.use(notFoundHandler);

// 2. Si alguna ruta anterior crasheó y llamó a `next(error)`, caerá exactamente aquí.
app.use(errorHandler);

// Inicializar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`-> Probar guardar en base de datos: http://localhost:${PORT}/api/cliente/reserva-prueba`);
});
