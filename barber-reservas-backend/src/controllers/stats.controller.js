import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// CONTROLADOR DE ESTADÍSTICAS (DASHBOARD ADMIN)
// ==========================================

export const obtenerEstadisticas = async (req, res) => {
  try {
    // 1. Conteo total histórico de citas registradas
    const totalCitas = await prisma.reserva.count();

    // 2. Citas agrupadas por Estado (Ideal para gráfica de pastel: Pendientes vs Confirmadas vs Canceladas)
    const citasPorEstado = await prisma.reserva.groupBy({
      by: ['estado'],
      _count: { estado: true }
    });

    // 3. Ingresos Totales Estimados (Excluyendo reservas CANCELADAS)
    // Prisma nos trae las reservas válidas y hacemos un "JOIN" para saber el precio del servicio de cada una
    const reservasValidas = await prisma.reserva.findMany({
      where: { 
        estado: { not: 'CANCELADA' } 
      },
      include: { 
        servicio: { select: { precio: true } } 
      }
    });

    // Sumamos iterativamente todos los precios usando la función reduce de Javascript
    const ingresosTotales = reservasValidas.reduce((acumulador, reserva) => {
      const precioVenta = reserva.servicio?.precio || 0;
      return acumulador + precioVenta;
    }, 0);

    // 4. Clientes totales registrados
    const totalClientes = await prisma.cliente.count();

    // Devolvemos toda la artillería en un solo JSON
    res.status(200).json({
      ingresosTotales,
      totalCitas,
      totalClientes,
      desgloseEstados: citasPorEstado
    });

  } catch (error) {
    console.error("Error calculando estadísticas:", error);
    res.status(500).json({ error: "Error interno al procesar los datos del dashboard" });
  }
};
