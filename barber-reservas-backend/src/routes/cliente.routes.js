import { Router } from 'express';
import { 
  obtenerServicios, 
  crearReservaPrueba,
  registrarCliente,
  loginCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
  crearReserva
} from '../controllers/cliente.controller.js';

import { obtenerBarberos } from '../controllers/barbero.controller.js';

const router = Router();

// ==========================================
// RUTAS DE AUTENTICACION
// ==========================================
router.post('/register', registrarCliente);
router.post('/login', loginCliente);

// ==========================================
// Rutas para el Frontend del Cliente
// ==========================================
router.get('/servicios', obtenerServicios);
router.get('/barberos', obtenerBarberos);

// Tarea #13: Algoritmo de Creación de Reservas reales
// POST http://localhost:3000/api/cliente/reservas
router.post('/reservas', crearReserva);

// Ruta de tipo GET solo para que el usuario pueda probarla haciendo clic desde el navegador
router.get('/reserva-prueba', crearReservaPrueba);

// ==========================================
// RUTAS CRUD DE CLIENTES (ADMIN)
// ==========================================
router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;
