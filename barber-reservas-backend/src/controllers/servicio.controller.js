import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//=======================================
// CONTROLADOR DE SERVICIOS (VISTA ADMIN)
//=======================================

export const crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion, precio, duracion } = req.body;
    const nuevoServicio = await prisma.servicio.create({
      data: { nombre, descripcion, precio, duracion }
    });
    res.status(201).json({
        mensaje: "¡Servicio creado con éxito!",
        servicio: nuevoServicio
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el servicio" });
  }
};

export const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { precio, duracion } = req.body;

    // Armamos un objeto solo con los campos que el frontend realmente envió.
    // Además, usamos parseFloat y parseInt para evitar que el servidor explote 
    // si el Frontend envía "25.50" (texto) en lugar de 25.50 (número).
    const datosDinamicos = {};
    if (precio !== undefined) datosDinamicos.precio = parseFloat(precio);
    if (duracion !== undefined) datosDinamicos.duracion = parseInt(duracion);

    const servicioActualizado = await prisma.servicio.update({
        where: { id: parseInt(id) },
        data: datosDinamicos
    });
    
    // Cambiamos 201 por 200 (200 OK = Modificación exitosa, 201 Created = Creación exitosa)
    res.status(200).json(servicioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el servicio" });
  }
};