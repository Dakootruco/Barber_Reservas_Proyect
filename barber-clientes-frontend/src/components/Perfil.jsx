import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar datos actuales desde localStorage al montar el componente
    const userInfoString = localStorage.getItem('user_info');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      setFormData({
        nombre: userInfo.nombre || "",
        email: userInfo.email || "",
        telefono: userInfo.telefono || ""
      });
    } else {
      // Si no hay sesión, obligar a logearse
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(import.meta.env.PROD ? "https://barber-reservas-proyect.onrender.com/api/cliente/mi-perfil" : "http://localhost:3000/api/cliente/mi-perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          telefono: formData.telefono
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error al actualizar.");
      }

      // Actualizar la caché del usuario (localStorage)
      localStorage.setItem('user_info', JSON.stringify(data.cliente));
      
      alert("¡Tu perfil fue actualizado con éxito!");
      navigate('/'); // Volver al inicio tras guardar

    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    } finally {
        setLoading(false);
    }
  };

  const handleCerrarSesion = () => {
    if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        navigate('/login');
    }
  };

  return (
    <div className="bg-linear-to-b from-[#1a1e2d] via-[#151620] to-[#0a0b10] min-h-screen text-white pb-24 font-sans p-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10 pt-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white p-2 bg-zinc-800/50 rounded-full transition-colors backdrop-blur-sm border border-white/5">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-bold tracking-wide text-gray-200">Mi Perfil</h1>
      </div>

      <div className="max-w-md mx-auto">
        {/* AVATAR SECTION */}
        <div className="flex justify-center mb-10">
            <div className="relative">
                <div className="w-28 h-28 rounded-full bg-[#2A2A3A] border-[3px] border-[#CFAE79] flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(207,174,121,0.2)]">
                    <svg className="w-14 h-14 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleGuardarCambios} className="bg-[#2A2A3A]/40 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col gap-5 backdrop-blur-md mb-8">
            <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-gray-400 ml-1 uppercase tracking-wider">Nombre Completo</label>
                <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#CFAE79] focus:ring-1 focus:ring-[#CFAE79] transition-all"
                    type="text"
                    required
                />
            </div>

            <div className="flex flex-col gap-2 opacity-60">
                <label className="text-[13px] font-medium text-gray-400 ml-1 uppercase tracking-wider">Correo Electrónico</label>
                <input
                    value={formData.email}
                    disabled
                    className="w-full bg-black/20 border border-white/5 text-gray-400 px-5 py-4 rounded-xl cursor-not-allowed"
                    type="email"
                />
                <span className="text-xs text-center mt-1 text-gray-500">El correo no puede ser modificado por seguridad.</span>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-gray-400 ml-1 uppercase tracking-wider">Teléfono</label>
                <input
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#CFAE79] focus:ring-1 focus:ring-[#CFAE79] transition-all"
                    type="tel"
                />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#CFAE79] text-black font-bold text-[16px] py-4 rounded-xl mt-4 hover:bg-[#b89b6b] hover:shadow-[0_0_15px_rgba(207,174,121,0.4)] transition-all duration-300 disabled:opacity-50">
                {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
        </form>

        {/* LOGOUT BUTTON */}
        <button 
            type="button" 
            onClick={handleCerrarSesion}
            className="w-full bg-red-500/10 border border-red-500/30 text-red-500 font-bold text-[16px] py-4 rounded-xl hover:bg-red-500/20 transition-all duration-300 flex justify-center items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Cerrar Sesión
        </button>
      </div>

    </div>
  );
}
