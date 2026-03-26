import { Router } from 'express';
import { 
  obtenerServicios, 
  crearReservaPrueba,
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
  crearReserva
} from '../controllers/cliente.controller.js';

import { obtenerBarberos } from '../controllers/barbero.controller.js';

const router = Router();

// Rutas para el Frontend del Cliente
router.get('/servicios', obtenerServicios);
router.get('/barberos', obtenerBarberos);

// Tarea #13: Algoritmo de Creación de Reservas reales
// POST http://localhost:3000/api/cliente/reservas
router.post('/reservas', crearReserva);

// Ruta de tipo GET solo para que el usuario pueda probarla haciendo clic desde el navegador
router.get('/reserva-prueba', crearReservaPrueba);

// ==========================================
// RUTAS CRUD DE CLIENTES
// ==========================================
router.post('/', crearCliente);
router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;
