import { Router } from 'express';
import { 
  obtenerTodasLasReservasAdmin,
  actualizarEstadoReserva 
} from '../controllers/reserva.controller.js';

import { 
    crearServicio,
    actualizarServicio
} from '../controllers/servicio.controller.js';

import { 
    crearBarbero, actualizarBarbero 
} from '../controllers/barbero.controller.js';

import { obtenerEstadisticas } from '../controllers/stats.controller.js';

const router = Router();

// ==========================================
// RUTAS PARA EL PANEL DE ADMINISTRADOR
// ==========================================

// Tarea #7: Obtener todas las reservas (con clientes, barberos y servicios)
// Se accede vía GET http://localhost:3000/api/admin/reservas
router.get('/reservas', obtenerTodasLasReservasAdmin);

// Tarea #8: Confirmar/Cancelar una reserva (Actualizar estado)
// Se accede vía PUT http://localhost:3000/api/admin/reservas/:id
router.put('/reservas/:id', actualizarEstadoReserva);

// Tarea #9: Agregar nuevos cortes/servicios
// Se accede vía POST http://localhost:3000/api/admin/servicios
router.post('/servicios', crearServicio);

// Tarea #10: Actualizar precios/duración de servicios
// Se accede vía PUT http://localhost:3000/api/admin/servicios/:id
router.put('/servicios/:id', actualizarServicio);

// Tarea #11: Registro de Personal
// Se accede vía POST http://localhost:3000/api/admin/barberos
router.post('/barberos', crearBarbero);

// Tarea #11.5: Actualizar barberos
// Se accede vía PUT http://localhost:3000/api/admin/barberos/:id
router.put('/barberos/:id', actualizarBarbero);

// Tarea #12: Datos rápidos para Dashboard (Estadísticas y KPI)
// Se accede vía GET http://localhost:3000/api/admin/stats
router.get('/stats', obtenerEstadisticas);

export default router;
