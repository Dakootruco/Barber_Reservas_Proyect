import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// CONTROLADOR DE BARBEROS (VISTA CLIENTE)
// ==========================================

export const obtenerBarberos = async (req, res) => {
  try {
    // Usamos findMany() para traer todos los registros de la tabla Barbero
    // Puedes elegir qué campos devolver. Aquí incluimos el id, nombre y el horarioLaboral.
    const barberos = await prisma.barbero.findMany({
      select: {
        id: true,
        nombre: true,
        horarioLaboral: true
      }
    });
    
    // Respondemos a la petición con un código 200 (OK por defecto) y los datos en JSON
    res.json(barberos);
  } catch (error) {
    console.error("Error obteniendo barberos:", error);
    // Si algo falla, devolvemos un error 500 (Internal Server Error)
    res.status(500).json({ error: "Error al obtener la lista de barberos" });
  }
};

// ==========================================
// CONTROLADOR DE BARBEROS (VISTA ADMIN)
// ==========================================

export const crearBarbero = async (req, res) => {
  try {
    const { nombre, horarioLaboral } = req.body;
    
    // Validación básica: al menos necesitamos el nombre para crear un barbero
    if (!nombre) {
      return res.status(400).json({ error: "El nombre del barbero es obligatorio" });
    }

    const nuevoBarbero = await prisma.barbero.create({
      data: { 
        nombre, 
        horarioLaboral: horarioLaboral || "09:00 - 18:00" // Horario por defecto si no lo envían
      }
    });
    
    res.status(201).json({
      mensaje: "¡Barbero registrado con éxito!",
      barbero: nuevoBarbero
    });
  } catch (error) {
    console.error("Error al registrar barbero:", error);
    res.status(500).json({ error: "Error interno al intentar guardar el barbero" });
  }
};

export const actualizarBarbero = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, horarioLaboral } = req.body;
    
    const barberoActualizado = await prisma.barbero.update({
      where: { id: parseInt(id) },
      data: { nombre, horarioLaboral }
    });
    
    res.status(200).json({
      mensaje: "¡Barbero actualizado con éxito!",
      barbero: barberoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar barbero:", error);
    res.status(500).json({ error: "Error interno al intentar actualizar el barbero" });
  }
};

    
  