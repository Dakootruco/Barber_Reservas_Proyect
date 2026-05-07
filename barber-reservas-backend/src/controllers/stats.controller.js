import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// CONTROLADOR DE ESTADÍSTICAS (DASHBOARD ADMIN)
// ==========================================

export const obtenerEstadisticas = async (req, res) => {
  try {
    // Rango del día de hoy
    const hoy = new Date();
    const inicioDelDia = new Date(hoy);
    inicioDelDia.setHours(0, 0, 0, 0);
    const finDelDia = new Date(hoy);
    finDelDia.setHours(23, 59, 59, 999);

    // Disparar TODAS las consultas a la vez (en paralelo)
    const [
      totalCitas,
      citasHoy,
      citasPorEstado,
      reservasValidas,
      totalClientes,
      totalServicios,
      barberos,
      proximasCitas
    ] = await Promise.all([
      prisma.reserva.count(),
      prisma.reserva.count({
        where: { fechaHora: { gte: inicioDelDia, lte: finDelDia } }
      }),
      prisma.reserva.groupBy({
        by: ['estado'],
        _count: { estado: true }
      }),
      prisma.reserva.findMany({
        where: { estado: { notIn: ['CANCELADA', 'NO_LLEGO'] } },
        include: { servicio: { select: { precio: true } } }
      }),
      prisma.cliente.count(),
      prisma.servicio.count(),
      prisma.barbero.findMany({
        include: {
          reservas: {
            where: { estado: { in: ['COMPLETADA', 'PENDIENTE'] } },
            include: { servicio: { select: { precio: true } } }
          }
        }
      }),
      prisma.reserva.findMany({
        where: {
          fechaHora: { gte: inicioDelDia, lte: finDelDia },
          estado: { in: ['PENDIENTE', 'COMPLETADA'] }
        },
        include: {
          cliente: { select: { id: true, nombre: true } },
          barbero: { select: { id: true, nombre: true } },
          servicio: { select: { id: true, nombre: true, precio: true } }
        },
        orderBy: { fechaHora: 'asc' },
        take: 10
      })
    ]);

    // Procesamiento en memoria (inmediato)
    const ingresosTotales = reservasValidas.reduce((acumulador, reserva) => {
      return acumulador + (reserva.servicio?.precio || 0);
    }, 0);

    const topBarberos = barberos
      .map(b => ({
        id: b.id,
        nombre: b.nombre,
        totalCitas: b.reservas.length,
        ingresos: b.reservas.reduce((acc, r) => acc + (r.servicio?.precio || 0), 0),
      }))
      .sort((a, b) => b.totalCitas - a.totalCitas);

    // Devolvemos todos los datos en un solo JSON
    res.status(200).json({
      ingresosTotales,
      totalCitas,
      citasHoy,
      totalClientes,
      totalServicios,
      desgloseEstados: citasPorEstado,
      topBarberos,
      proximasCitas,
    });

  } catch (error) {
    console.error("Error calculando estadísticas:", error);
    res.status(500).json({ error: "Error interno al procesar los datos del dashboard" });
  }
};
