import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// CONTROLADOR DE PRODUCTOS / INVENTARIO
// ==========================================

export const obtenerProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { nombre: 'asc' }
    });
    res.json(productos);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { nombre, categoria, precio, stock } = req.body;

    if (!nombre || !categoria || precio === undefined) {
      return res.status(400).json({ error: "Nombre, categoría y precio son obligatorios" });
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        categoria,
        precio: parseFloat(precio),
        stock: parseInt(stock) || 0
      }
    });

    res.status(201).json({
      mensaje: "¡Producto creado con éxito!",
      producto: nuevoProducto
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error interno al guardar el producto" });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, precio, stock } = req.body;

    const datos = {};
    if (nombre !== undefined) datos.nombre = nombre;
    if (categoria !== undefined) datos.categoria = categoria;
    if (precio !== undefined) datos.precio = parseFloat(precio);
    if (stock !== undefined) datos.stock = parseInt(stock);

    const productoActualizado = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: datos
    });

    res.json({
      mensaje: "¡Producto actualizado!",
      producto: productoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.producto.delete({
      where: { id: parseInt(id) }
    });
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};
