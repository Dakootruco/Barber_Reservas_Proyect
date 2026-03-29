import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Instanciamos Prisma para conectarnos a Supabase
const prisma = new PrismaClient();

export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await prisma.servicio.findMany();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener servicios" });
  }
};

export const crearReservaPrueba = async (req, res) => {
  try {
    // 1. Buscamos o creamos un Cliente de prueba
    let cliente = await prisma.cliente.findFirst();
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: { nombre: "Juan Pérez", email: "juan@test.com", telefono: "+123456789" }
      });
    }

    // 2. Buscamos o creamos un Barbero de prueba
    let barbero = await prisma.barbero.findFirst();
    if (!barbero) {
      barbero = await prisma.barbero.create({
        data: { nombre: "Dakoo", horarioLaboral: "09:00 - 18:00" }
      });
    }

    // 3. Buscamos o creamos un Servicio de prueba
    let servicio = await prisma.servicio.findFirst();
    if (!servicio) {
      servicio = await prisma.servicio.create({
        data: { nombre: "Corte Clásico", precio: 15.00, duracion: 30 }
      });
    }

    // 4. Creamos la Reserva en Supabase uniendo los 3 usando Prisma
    const nuevaReserva = await prisma.reserva.create({
      data: {
        fechaHora: new Date(), // Fecha actual
        estado: "CONFIRMADA",
        clienteId: cliente.id,
        barberoId: barbero.id,
        servicioId: servicio.id
      },
      include: {
        cliente: true,
        barbero: true,
        servicio: true
      }
    });

    res.json({
      mensaje: "¡Éxito! Reserva guardada en Supabase 🎉",
      reserva: nuevaReserva
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la reserva de prueba en Supabase" });
  }
};

// ==========================================
// CRUD DE CLIENTES
// ==========================================

export const registrarCliente = async (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Faltan datos obligatorios (nombre, email, password)" });
    }

    // Verificar si el correo ya existe
    const clienteExistente = await prisma.cliente.findUnique({ where: { email } });
    if (clienteExistente) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoCliente = await prisma.cliente.create({
      data: { 
        nombre, 
        email, 
        telefono, 
        password: hashedPassword 
      }
    });

    res.status(201).json({ mensaje: "Cliente registrado con éxito", clienteId: nuevoCliente.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el cliente" });
  }
};

export const loginCliente = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Por favor provee email y contraseña" });
    }

    // Verificar si el cliente existe
    const cliente = await prisma.cliente.findUnique({ where: { email } });
    if (!cliente) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, cliente.password);
    if (!passwordValida) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar Token JWT
    const token = jwt.sign(
      { id: cliente.id, email: cliente.email },
      process.env.JWT_SECRET || 'supersecretkey_cambiame_en_produccion',
      { expiresIn: '7d' }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        email: cliente.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor durante el login" });
  }
};

export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
};

export const obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
      include: { reservas: true } // Incluir historial de reservas
    });
    
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el cliente" });
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono } = req.body;
    
    const clienteActualizado = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: { nombre, email, telefono }
    });
    
    res.json(clienteActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cliente.delete({
      where: { id: parseInt(id) }
    });
    res.json({ mensaje: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el cliente" });
  }
};

// ==========================================
// SISTEMA DE RESERVAS (VISTA CLIENTE / ALGORITMO)
// ==========================================

export const crearReserva = async (req, res) => {
  try {
    const { clienteId, barberoId, servicioId, fechaHora } = req.body;
    const fechaInicioNueva = new Date(fechaHora);

    // 1. Obtener la duración del servicio solicitado
    const servicioFrontera = await prisma.servicio.findUnique({
      where: { id: parseInt(servicioId) }
    });

    if (!servicioFrontera) {
      return res.status(404).json({ error: "El servicio solicitado no existe." });
    }

    // Calculamos de forma matemática la hora de fin sumando los minutos a la fecha base
    // (Un minuto = 60,000 milisegundos)
    const fechaFinNueva = new Date(fechaInicioNueva.getTime() + servicioFrontera.duracion * 60000);

    // 2. Traer las reservas del barbero para ESE MISMO DÍA 
    // (No traemos toda la BD por eficiencia)
    const inicioDelDia = new Date(fechaInicioNueva);
    inicioDelDia.setHours(0, 0, 0, 0);
    const finDelDia = new Date(fechaInicioNueva);
    finDelDia.setHours(23, 59, 59, 999);

    const reservasDelDia = await prisma.reserva.findMany({
      where: {
        barberoId: parseInt(barberoId),
        fechaHora: { gte: inicioDelDia, lte: finDelDia },
        estado: { in: ["PENDIENTE", "CONFIRMADA"] }
      },
      include: {
        servicio: true // Requerimos el servicio para saber cuánto duran esas citas ya ocupadas
      }
    });

    // 3. EL ALGORITMO ANTI-OVERBOOKING (Overlapping Test)
    // Dos eventos de tiempo (A y B) chocan SI Y SÓLO SI:
    // La hora de inicio de A empieza antes de que termine B, Y la hora final de A termina después de que empiece B
    const cruceDeHorarios = reservasDelDia.some(reservaOcupada => {
      const inicioOcupado = new Date(reservaOcupada.fechaHora);
      const finOcupado = new Date(inicioOcupado.getTime() + reservaOcupada.servicio.duracion * 60000);
      
      return (fechaInicioNueva < finOcupado) && (fechaFinNueva > inicioOcupado);
    });

    if (cruceDeHorarios) {
      return res.status(400).json({ 
        error: "¡Conflicto de horario! El barbero ya está atendiendo a alguien en esa franja de tiempo." 
      });
    }

    // 4. Si logramos llegar a esta línea, la franja estaba 100% libre.
    const nuevaReserva = await prisma.reserva.create({
      data: {
        clienteId: parseInt(clienteId),
        barberoId: parseInt(barberoId),
        servicioId: parseInt(servicioId),
        fechaHora: fechaInicioNueva,
        estado: "PENDIENTE"
      }
    });

    res.status(201).json({
      mensaje: "¡Cita reservada con éxito! La franja estaba libre.",
      reserva: nuevaReserva
    });

  } catch (error) {
    console.error("Error grave en reservación:", error);
    res.status(500).json({ error: "Ocurrió un error en el servidor al procesar la cita" });
  }
};
