import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// CONTROLADOR DE RESERVAS (VISTA ADMIN)
// ==========================================

export const obtenerTodasLasReservasAdmin = async (req, res) => {
  try {
    // Para el Dashboard Administrativo (Tarea #7)
    // Buscamos MÚLTIPLES reservas y le indicamos a Prisma mediante "include"
    // que haga el "JOIN" de las tablas relacionales para traernos también
    // los datos del cliente, del barbero y del servicio en la misma consulta.
    const reservas = await prisma.reserva.findMany({
      include: {
        cliente: {
          select: { id: true, nombre: true, telefono: true } 
        },
        barbero: {
          select: { id: true, nombre: true }
        },
        servicio: {
          select: { id: true, nombre: true, precio: true, duracion: true }
        }
      },
      orderBy: {
        fechaHora: 'asc' // Las ordenamos por fecha cronológica para el Calendario/Timeline
      }
    });

    res.json(reservas);
  } catch (error) {
    console.error("Error obteniendo reservas admin:", error);
    res.status(500).json({ error: "Error interno al obtener las reservas del sistema" });
  }
};

export const actualizarEstadoReserva = async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el ID de la url (/reservas/5)
    const { estado } = req.body; // El frontend nos envía el nuevo estado ("CONFIRMADA", "CANCELADA", etc.)

    // Pequeña validación de seguridad para evitar errores tipográficos del frontend
    const estadosPermitidos = ["PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ error: "Estado no válido. Usa: PENDIENTE, CONFIRMADA, CANCELADA o COMPLETADA" });
    }

    // Le decimos a Prisma que busque la reserva por ID y sobrescriba su campo "estado"
    const reservaActualizada = await prisma.reserva.update({
      where: { id: parseInt(id) },
      data: { estado }
    });

    res.json({
      mensaje: `¡Genial! La reserva #${id} ha sido marcada como ${estado}`,
      reserva: reservaActualizada
    });
  } catch (error) {
    console.error("Error al actualizar la reserva:", error);
    res.status(500).json({ error: "Ocurrió un error al intentar cambiar el estado de la reserva" });
  }
};
