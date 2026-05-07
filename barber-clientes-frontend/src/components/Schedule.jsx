import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importamos los estilos base que sobrescribiremos

export default function Schedule() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  
  // Estado para el calendario
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  useEffect(() => {
    const fetchCitas = async () => {
      // Verificamos si el usuario inició sesión
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(import.meta.env.PROD ? "https://barber-reservas-proyect.onrender.com/api/cliente/reservas/mis-citas" : "http://localhost:3000/api/cliente/reservas/mis-citas", {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          throw new Error("Error al obtener las citas");
        }

        const data = await response.json();
        setCitas(data);
      } catch (error) {
        console.error("Error cargando citas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, [navigate]);

  const handleCancelarCita = async (citaId) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar esta cita?");
    if (!confirmar) return;

    setCancelingId(citaId);
    try {
        const endpoint = import.meta.env.PROD 
            ? `https://barber-reservas-proyect.onrender.com/api/admin/reservas/${citaId}`
            : `http://localhost:3000/api/admin/reservas/${citaId}`;
        
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'CANCELADA' })
        });

        if (!response.ok) throw new Error("No se pudo cancelar la cita.");
        
        alert("Cita cancelada con éxito.");
        
        // Actualizar el estado local para reflejar la cancelación inmediatamente
        setCitas(prevCitas => 
            prevCitas.map(cita => 
                cita.id === citaId ? { ...cita, estado: 'CANCELADA' } : cita
            )
        );
    } catch (error) {
        alert(error.message);
    } finally {
        setCancelingId(null);
    }
  };

  // Utilidades para fechas
  const sonMismoDia = (fecha1, fecha2) => {
    return fecha1.getDate() === fecha2.getDate() &&
           fecha1.getMonth() === fecha2.getMonth() &&
           fecha1.getFullYear() === fecha2.getFullYear();
  };

  const formatearFechaLarga = (dateObj) => {
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaText = dateObj.toLocaleDateString('es-ES', opcionesFecha);
    return fechaText.charAt(0).toUpperCase() + fechaText.slice(1);
  };

  const formatearHora = (fechaString) => {
    const date = new Date(fechaString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
  };

  // Filtrar citas para el día seleccionado
  const citasDelDiaSeleccionado = citas.filter(cita => {
    const fechaCita = new Date(cita.fechaHora);
    return sonMismoDia(fechaCita, fechaSeleccionada);
  });

  // Función mágica para inyectar clases al calendario
  const tileClassNameHandler = ({ date, view }) => {
    // Solo sombreamos días en la vista de "mes"
    if (view === 'month') {
      // ¿Alguna de mis citas cae en este "date"?
      const tieneCita = citas.some(cita => sonMismoDia(new Date(cita.fechaHora), date));
      
      if (tieneCita) {
        return 'dia-con-cita'; // Esta clase inyecta el sombreado/puntito desde index.css
      }
    }
    return null;
  };

  return (
    <div className="bg-linear-to-b from-[#1a1e2d] via-[#151620] to-[#0a0b10] min-h-screen text-white pb-24 font-sans p-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white p-2 bg-zinc-800/50 rounded-full transition-colors backdrop-blur-sm border border-white/5">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-gray-200">Mis Citas</h1>
          <p className="text-sm text-gray-400 mt-1">Navega por tu agenda mensual</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
        {/* LADO IZQUIERDO: EL CALENDARIO */}
        <div className="bg-[#2A2A3A]/40 border border-white/10 p-6 rounded-3xl shadow-xl backdrop-blur-md">
            {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                    <p className="text-[#CFAE79] animate-pulse font-medium">Cargando calendario...</p>
                </div>
            ) : (
                <Calendar 
                    onChange={setFechaSeleccionada} 
                    value={fechaSeleccionada}
                    tileClassName={tileClassNameHandler}
                    locale="es-ES"
                />
            )}
        </div>

        {/* LADO DERECHO: DETALLES DEL DÍA SELECCIONADO */}
        <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-[#CFAE79] border-b border-white/10 pb-3">
                {formatearFechaLarga(fechaSeleccionada)}
            </h2>

            {loading ? (
                <p className="text-gray-500 text-sm">Cargando detalles...</p>
            ) : citasDelDiaSeleccionado.length === 0 ? (
                <div className="bg-zinc-800/30 border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                    <svg className="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-gray-400 font-medium">No tienes citas este día</p>
                    <button onClick={() => navigate('/Agendar')} className="mt-2 text-sm text-[#CFAE79] hover:underline">
                        + Agendar una cita aquí
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {citasDelDiaSeleccionado.map((cita) => (
                        <div key={cita.id} className="bg-[#2A2A3A]/80 border border-[#CFAE79]/20 rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                            
                            {/* Cabecera de la tarjeta */}
                            <div className="bg-zinc-800 px-4 py-2 border-b border-white/5 flex justify-between items-center">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                                    cita.estado === 'CONFIRMADA' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                    cita.estado === 'PENDIENTE' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                                    'bg-zinc-700 text-gray-300'
                                }`}>
                                    {cita.estado}
                                </span>
                                <span className="text-lg font-bold text-[#CFAE79]">{formatearHora(cita.fechaHora)}</span>
                            </div>

                            {/* Cuerpo de la tarjeta */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-100">{cita.servicio?.nombre || 'Corte'}</h3>
                                <div className="flex items-center gap-1.5 mt-1 mb-4 text-gray-400 text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{cita.servicio?.duracion || '30'} min</span>
                                </div>
                                
                                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-[#151620] border border-[#CFAE79]/50 overflow-hidden flex items-center justify-center">
                                            {cita.barbero?.imagen ? (
                                                <img src={cita.barbero.imagen} alt="Barbero" className="w-full h-full object-cover" />
                                            ) : (
                                                <svg className="w-4 h-4 text-[#CFAE79]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-300">{cita.barbero?.nombre || 'Sin asignar'}</span>
                                    </div>
                                    <span className="font-bold text-white">${cita.servicio?.precio || '0.00'}</span>
                                </div>
                            </div>

                            {/* Botón de Cancelar Cita */}
                            {cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA' && (
                                <div className="px-4 pb-4 pt-1">
                                    <button 
                                        onClick={() => handleCancelarCita(cita.id)}
                                        disabled={cancelingId === cita.id}
                                        className={`w-full border py-2.5 rounded-xl font-semibold transition-all text-sm active:scale-95
                                            ${cancelingId === cita.id 
                                                ? 'bg-gray-500/10 border-gray-500/30 text-gray-400 cursor-not-allowed'
                                                : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                                            }`
                                        }>
                                        {cancelingId === cita.id ? 'Cancelando...' : 'Cancelar Cita'}
                                    </button>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>

    </div>
  );
}
