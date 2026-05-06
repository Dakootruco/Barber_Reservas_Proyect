import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// CONTROLADOR DE TRANSACCIONES / FINANZAS
// ==========================================

export const obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await prisma.transaccion.findMany({
      orderBy: { fecha: 'desc' }
    });
    res.json(transacciones);
  } catch (error) {
    console.error("Error obteniendo transacciones:", error);
    res.status(500).json({ error: "Error al obtener las transacciones" });
  }
};

export const crearTransaccion = async (req, res) => {
  try {
    const { fecha, descripcion, categoria, tipo, monto } = req.body;

    if (!descripcion || !tipo || monto === undefined) {
      return res.status(400).json({ error: "Descripción, tipo y monto son obligatorios" });
    }

    const tiposPermitidos = ["INGRESO", "GASTO"];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({ error: "Tipo debe ser INGRESO o GASTO" });
    }

    const nuevaTransaccion = await prisma.transaccion.create({
      data: {
        fecha: fecha ? new Date(fecha) : new Date(),
        descripcion,
        categoria: categoria || 'General',
        tipo,
        monto: parseFloat(monto)
      }
    });

    res.status(201).json({
      mensaje: "¡Transacción registrada!",
      transaccion: nuevaTransaccion
    });
  } catch (error) {
    console.error("Error al crear transacción:", error);
    res.status(500).json({ error: "Error interno al registrar la transacción" });
  }
};

export const eliminarTransaccion = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.transaccion.delete({
      where: { id: parseInt(id) }
    });
    res.json({ mensaje: "Transacción eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    res.status(500).json({ error: "Error al eliminar la transacción" });
  }
};
