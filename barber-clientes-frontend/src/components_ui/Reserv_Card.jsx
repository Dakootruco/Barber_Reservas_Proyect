import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Reserv_Card() {
    const [reserva, setReserva] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCanceling, setIsCanceling] = useState(false);

    const handleCancelarCita = async () => {
        const confirmar = window.confirm("¿Estás seguro de que deseas cancelar tu cita?");
        if (!confirmar) return;

        setIsCanceling(true);
        try {
            const endpoint = import.meta.env.PROD 
                ? `https://barber-reservas-proyect.onrender.com/api/admin/reservas/${reserva.id}`
                : `http://localhost:3000/api/admin/reservas/${reserva.id}`;
            
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 'CANCELADA' })
            });

            if (!response.ok) throw new Error("No se pudo cancelar la cita. Inténtalo de nuevo.");
            
            alert("Cita cancelada con éxito.");
            // Actualizamos el estado local para que la UI cambie inmediatamente
            setReserva(prev => ({ ...prev, estado: 'CANCELADA' }));
        } catch (error) {
            alert(error.message);
        } finally {
            setIsCanceling(false);
        }
    };

    useEffect(() => {
        const fetchMisReservas = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(import.meta.env.PROD ? "https://barber-reservas-proyect.onrender.com/api/cliente/reservas/mis-citas" : "http://localhost:3000/api/cliente/reservas/mis-citas", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok && data.length > 0) {
                    setReserva(data[0]); // Mostrar solo la cita más próxima
                }
            } catch (error) {
                console.error("Error al obtener reservas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMisReservas();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#2A2A3A] text-white p-5 rounded-[28px] shadow-lg w-full max-w-sm mx-auto flex justify-center items-center h-40 border border-white/5">
                <p className="text-gray-400">Cargando tu próxima cita...</p>
            </div>
        );
    }

    if (!reserva) {
        return (
            <div className="bg-[#2A2A3A] text-white p-6 rounded-[28px] shadow-lg w-full max-w-sm mx-auto flex flex-col gap-4 border border-white/5 text-center">
                <h2 className="text-[19px] font-bold tracking-wide text-gray-200">Aún no tienes reservas</h2>
                <p className="text-[14px] text-gray-400">¿Qué esperas para agendar tu próximo corte de pelo?</p>
                <Link to="/agendar" className="bg-[#CFAE79] text-black mt-2 py-3.5 rounded-xl font-bold hover:bg-[#b89b6b] transition-all">
                    Agendar Ahora
                </Link>
            </div>
        );
    }

    // Funciones para formatear (iguales a las de Schedule.jsx)
    const formatearFecha = (fechaString) => {
        const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(fechaString);
        const fechaText = date.toLocaleDateString('es-ES', opcionesFecha);
        return fechaText.charAt(0).toUpperCase() + fechaText.slice(1);
    };

    const formatearHora = (fechaString) => {
        const date = new Date(fechaString);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <h2 className="text-[17px] font-semibold text-white tracking-wide mb-3 px-1">Tu Próxima Cita</h2>
            <div className="bg-[#2A2A3A]/60 border border-white/10 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.01]">
                
                {/* Cabecera de la tarjeta (Fecha y Estado) */}
                <div className="bg-zinc-800/80 px-5 py-3 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#CFAE79]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-sm font-medium text-gray-300">{formatearFecha(reserva.fechaHora)}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                        reserva.estado === 'CONFIRMADA' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                        reserva.estado === 'PENDIENTE' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                        'bg-zinc-700 text-gray-300'
                    }`}>
                        {reserva.estado}
                    </span>
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="p-5 flex justify-between items-center">
                    <div className="flex flex-col gap-3">
                        {/* Servicio */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-100 tracking-wide">{reserva.servicio?.nombre || 'Corte'}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-sm text-gray-400">{reserva.servicio?.duracion || '30'} min</span>
                            </div>
                        </div>
                        
                        {/* Barbero */}
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-8 h-8 rounded-full bg-[#151620] border border-[#CFAE79]/50 flex items-center justify-center overflow-hidden">
                                {reserva.barbero?.imagen ? (
                                    <img src={reserva.barbero.imagen} alt="Barbero" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-5 h-5 text-[#CFAE79]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-semibold">Barbero</span>
                                <span className="text-sm font-medium text-gray-300 leading-tight">{reserva.barbero?.nombre || 'Sin asignar'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Hora y Precio */}
                    <div className="flex flex-col items-end gap-3 text-right">
                        <div className="bg-[#CFAE79]/10 border border-[#CFAE79]/30 px-4 py-2.5 rounded-xl text-center shadow-inner">
                            <span className="block text-xl font-bold text-[#CFAE79]">{formatearHora(reserva.fechaHora)}</span>
                        </div>
                        <span className="text-lg font-bold text-white">${reserva.servicio?.precio || '0.00'}</span>
                    </div>
                </div>

                {/* Botón de Cancelar Cita */}
                {reserva.estado !== 'CANCELADA' && reserva.estado !== 'COMPLETADA' && (
                    <div className="px-5 pb-5 pt-1">
                        <button 
                            onClick={handleCancelarCita}
                            disabled={isCanceling}
                            className={`w-full border py-3 rounded-xl font-semibold transition-all text-[15px] active:scale-95 
                                ${isCanceling 
                                    ? 'bg-gray-500/10 border-gray-500/30 text-gray-400 cursor-not-allowed' 
                                    : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'}`
                            }>
                            {isCanceling ? 'Cancelando...' : 'Cancelar Cita'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Reserv_Card;
