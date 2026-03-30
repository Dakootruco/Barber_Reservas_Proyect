import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Reserv_Card() {
    const [reserva, setReserva] = useState(null);
    const [loading, setLoading] = useState(true);

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
                <p className="text-[14px] text-gray-400">¿Qué esperas para agendar tu próximo corte de cabello y lookear?</p>
                <Link to="/agendar" className="bg-[#CFAE79] text-black mt-2 py-3.5 rounded-xl font-bold hover:bg-[#b89b6b] transition-all">
                    Agendar Ahora
                </Link>
            </div>
        );
    }

    const dateObj = new Date(reserva.fechaHora);
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Obtener las partes
    const diaSemana = dias[dateObj.getDay()];
    const diaMes = dateObj.getDate();
    const mes = meses[dateObj.getMonth()];
    const horaStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-[#2A2A3A] text-white p-5 rounded-[28px] shadow-lg w-full max-w-sm mx-auto flex flex-col gap-5 border border-white/5">
            <h2 className="text-[17px] font-semibold text-white tracking-wide">Tu Próxima Cita</h2>

            <div className="flex gap-4 items-center">
                {/* Cuadro de la fecha (Izquierda) */}
                <div className="bg-[#353545] flex flex-col justify-center items-center rounded-2xl min-w-[72px] h-[78px]">
                    <span className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">{diaSemana}</span>
                    <span className="text-2xl font-bold text-white leading-none mt-0.5 mb-1">{diaMes}</span>
                    <span className="text-[11px] text-[#CFAE79] font-medium tracking-wide uppercase">{mes}</span>
                </div>

                {/* Hora, Barbero y Servicio (Derecha) */}
                <div className="flex flex-col flex-1 pl-1 gap-2">
                    <p className="font-medium text-[17px] text-gray-200">Hora: {horaStr}</p>
                    <p className="text-[13px] text-[#CFAE79] font-semibold -mt-1">{reserva.servicio?.nombre || 'Corte'}</p>

                    <div className="flex items-center gap-2 mt-1">
                        <img
                            src={reserva.barbero?.imagen || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop'}
                            alt="Barbero"
                            className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-[14px] font-medium text-gray-300">Barbero: {reserva.barbero?.nombre || 'No asignado'}</span>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 mt-1">
                <button className="flex-1 bg-transparent border border-gray-500/50 text-gray-300 py-3.5 rounded-[14px] font-semibold transition-all text-[15px] active:scale-95 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50">
                    Cancelar Cita
                </button>
            </div>
        </div>
    );
}

export default Reserv_Card;
