import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// CONTROLADOR DE REPORTES / ANALÍTICAS
// Calcula métricas a partir de las tablas existentes
// ==========================================

export const obtenerReportes = async (req, res) => {
  try {
    // 1. Top servicios: cuántas veces se ha reservado cada servicio
    const servicios = await prisma.servicio.findMany({
      include: {
        reservas: {
          where: { estado: { notIn: ['CANCELADA', 'NO_LLEGO'] } },
          select: { id: true, servicio: { select: { precio: true } } }
        }
      }
    });

    const topServicios = servicios
      .map(s => ({
        name: s.nombre,
        cantidad: s.reservas.length,
        ingresos: s.reservas.length * s.precio,
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    // 2. Distribución de ingresos por servicio (para pie chart)
    const COLORS = ['#CFAE79', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
    const distribucionIngresos = servicios
      .map((s, i) => ({
        name: s.nombre,
        value: s.reservas.length * s.precio,
        color: COLORS[i % COLORS.length],
      }))
      .filter(s => s.value > 0)
      .sort((a, b) => b.value - a.value);

    // 3. Crecimiento de clientes por mes (últimos 6 meses)
    const seisAtras = new Date();
    seisAtras.setMonth(seisAtras.getMonth() - 5);
    seisAtras.setDate(1);
    seisAtras.setHours(0, 0, 0, 0);

    const clientesPorMes = await prisma.cliente.findMany({
      where: { createdAt: { gte: seisAtras } },
      select: { createdAt: true }
    });

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const crecimientoClientes = {};
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      crecimientoClientes[key] = { name: meses[d.getMonth()], nuevos: 0 };
    }

    clientesPorMes.forEach(c => {
      const key = `${c.createdAt.getFullYear()}-${c.createdAt.getMonth()}`;
      if (crecimientoClientes[key]) {
        crecimientoClientes[key].nuevos++;
      }
    });

    const clientGrowthData = Object.values(crecimientoClientes);

    // 4. KPIs rápidos
    const totalReservasValidas = await prisma.reserva.count({
      where: { estado: { notIn: ['CANCELADA', 'NO_LLEGO'] } }
    });

    const reservasConPrecio = await prisma.reserva.findMany({
      where: { estado: { notIn: ['CANCELADA', 'NO_LLEGO'] } },
      include: { servicio: { select: { precio: true } } }
    });

    const ingresosTotales = reservasConPrecio.reduce((acc, r) => acc + (r.servicio?.precio || 0), 0);
    const ticketPromedio = totalReservasValidas > 0 ? ingresosTotales / totalReservasValidas : 0;

    const totalClientes = await prisma.cliente.count();

    res.json({
      topServicios,
      distribucionIngresos,
      clientGrowthData,
      totalReservasValidas,
      ticketPromedio,
      totalClientes,
    });

  } catch (error) {
    console.error("Error generando reportes:", error);
    res.status(500).json({ error: "Error al generar los reportes" });
  }
};
