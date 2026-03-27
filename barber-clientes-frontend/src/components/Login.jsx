import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1500&auto=format&fit=crop')" }}
    >
      {/* Overlay oscuro para que resalte la tarjeta */}
      <div className="absolute inset-0 bg-black/75"></div>

      {/* Tarjeta de Login (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 backdrop-blur-md bg-[#1a1e2d]/80 border border-white/10 rounded-3xl shadow-2xl mx-4">

        {/* Logo superior */}
        <div className="text-center mb-8">
          {/* Si tienes una imagen de logo, puedes usar <img src="/tu-logo.png" alt="Logo" className="mx-auto h-20 mb-4" /> */}
          <h1 className="text-4xl font-bold leading-tight text-[#CFAE79] tracking-widest drop-shadow-lg">
            Dakoo
            Barbershop
          </h1>
          <p className="text-gray-300 text-sm mt-2 tracking-wide font-light"> Inicia Sesión</p>
        </div>

        {/* Formulario */}
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Usuario o Correo Electrónico</label>
            <input
              className="w-full bg-black/40 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#CFAE79] focus:ring-1 focus:ring-[#CFAE79] transition-all placeholder:text-gray-500"
              type="text"
              placeholder="Ej: usuario@correo.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Contraseña</label>
            <input
              className="w-full bg-black/40 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#CFAE79] focus:ring-1 focus:ring-[#CFAE79] transition-all placeholder:text-gray-500"
              type="password"
              placeholder="••••••••"
            />
          </div>

          {/* Olvidé mi contraseña */}
          <div className="flex justify-end -mt-2">
            <Link to="#" className="text-sm text-[#CFAE79] hover:text-white transition-colors font-medium">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón Iniciar Sesión */}
          <button className="w-full bg-[#CFAE79] text-black font-bold text-lg py-3.5 rounded-xl mt-2 hover:bg-[#b89b6b] hover:shadow-[0_0_15px_rgba(207,174,121,0.4)] transition-all duration-300">
            Iniciar Sesión
          </button>
        </form>

        {/* Registrarse */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          ¿No tienes una cuenta?{' '}
          <Link to="/signup" className="text-[#CFAE79] font-bold hover:text-white transition-colors">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
