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

    // 1. Conteo total histórico de citas registradas
    const totalCitas = await prisma.reserva.count();

    // 2. Citas de hoy
    const citasHoy = await prisma.reserva.count({
      where: {
        fechaHora: { gte: inicioDelDia, lte: finDelDia }
      }
    });

    // 3. Citas agrupadas por Estado
    const citasPorEstado = await prisma.reserva.groupBy({
      by: ['estado'],
      _count: { estado: true }
    });

    // 4. Ingresos Totales Estimados (Excluyendo reservas CANCELADAS y NO_LLEGO)
    const reservasValidas = await prisma.reserva.findMany({
      where: {
        estado: { notIn: ['CANCELADA', 'NO_LLEGO'] }
      },
      include: {
        servicio: { select: { precio: true } }
      }
    });

    const ingresosTotales = reservasValidas.reduce((acumulador, reserva) => {
      const precioVenta = reserva.servicio?.precio || 0;
      return acumulador + precioVenta;
    }, 0);

    // 5. Clientes totales registrados
    const totalClientes = await prisma.cliente.count();

    // 6. Total de servicios disponibles
    const totalServicios = await prisma.servicio.count();

    // 7. Top barberos por citas completadas (historial completo)
    const barberos = await prisma.barbero.findMany({
      include: {
        reservas: {
          where: { estado: { in: ['COMPLETADA', 'PENDIENTE'] } },
          include: { servicio: { select: { precio: true } } }
        }
      }
    });

    const topBarberos = barberos
      .map(b => ({
        id: b.id,
        nombre: b.nombre,
        totalCitas: b.reservas.length,
        ingresos: b.reservas.reduce((acc, r) => acc + (r.servicio?.precio || 0), 0),
      }))
      .sort((a, b) => b.totalCitas - a.totalCitas);

    // 8. Próximas citas de hoy (con joins)
    const proximasCitas = await prisma.reserva.findMany({
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
    });

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
