// ==========================================
// MIDDLEWARES DE MANEJO DE ERRORES GLOBAL
// ==========================================

// Atrapa solicitudes a rutas que no existen
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`La ruta que intentas buscar ('${req.originalUrl}') no existe en el API.`);
  error.statusCode = 404;
  next(error); // Pasa este error al manejador global
};

// El paracaídas principal. Si algún controlador "crashea", Express pasa el error aquí automáticamente.
export const errorHandler = (err, req, res, next) => {
  console.error("🔴 [Error Global Interceptado]:", err.message);

  const statusCode = err.statusCode || 500;
  let mensajeUsuario = err.message || "Ocurrió un error interno catastrófico en el servidor.";

  // Podemos personalizar errores específicos aquí
  // Por ejemplo, los errores de validación de Prisma suelen empezar con 'P'
  if (err.code && err.code.startsWith('P')) {
    mensajeUsuario = "Error interno de Base de Datos (Prisma). Revisa los datos enviados.";
  }

  // Si estamos en entorno de pruebas/local, mandamos el stacktrace para debuggear. En producción lo ocultamos.
  res.status(statusCode).json({
    error: mensajeUsuario,
    stack: process.env.NODE_ENV === 'development' ? err.stack : "🔒 Oculto en producción"
  });
};
