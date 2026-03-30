import { Router } from 'express';
import { 
  obtenerServicios, 
  crearServicio,
  crearReservaPrueba,
  registrarCliente,
  loginCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
  crearReserva,
  obtenerMisReservas,
  actualizarMiPerfil
} from '../controllers/cliente.controller.js';

import { obtenerBarberos, crearBarbero } from '../controllers/barbero.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// ==========================================
// RUTAS DE AUTENTICACION
// ==========================================
//localhost:3000/api/cliente/register
router.post('/register', registrarCliente);
//localhost:3000/api/cliente/login
router.post('/login', loginCliente);

// ==========================================
// Rutas para el Frontend del Cliente
// ==========================================
//localhost:3000/api/cliente/servicios
router.get('/servicios', obtenerServicios);
router.post('/servicios', crearServicio);
//localhost:3000/api/cliente/barberos
router.get('/barberos', obtenerBarberos);
router.post('/barberos', crearBarbero);

// Tarea #13: Algoritmo de Creación de Reservas reales
// POST http://localhost:3000/api/cliente/reservas
router.post('/reservas', crearReserva);
// GET http://localhost:3000/api/cliente/reservas/mis-citas
router.get('/reservas/mis-citas', verificarToken, obtenerMisReservas);

// PUT http://localhost:3000/api/cliente/mi-perfil
router.put('/mi-perfil', verificarToken, actualizarMiPerfil);

// Ruta de tipo GET solo para que el usuario pueda probarla haciendo clic desde el navegador
router.get('/reserva-prueba', crearReservaPrueba);

// ==========================================
// RUTAS CRUD DE CLIENTES (ADMIN)
// ==========================================
//localhost:3000/api/cliente
router.get('/', obtenerClientes);
//localhost:3000/api/cliente/:id
router.get('/:id', obtenerClientePorId);
//localhost:3000/api/cliente/:id
router.put('/:id', actualizarCliente);
//localhost:3000/api/cliente/:id
router.delete('/:id', eliminarCliente);

export default router;
