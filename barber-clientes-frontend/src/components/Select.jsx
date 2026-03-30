

import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Select() {
    const navigate = useNavigate();
    const location = useLocation();

    // Datos pasados desde Service_card
    const serviceInfo = location.state || {};

    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const [barberos, setBarberos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBarberos = async () => {
            try {
                const response = await fetch(import.meta.env.PROD ? "https://barber-reservas-proyect.onrender.com/api/cliente/barberos" : "http://localhost:3000/api/cliente/barberos");
                const data = await response.json();
                if (response.ok) {
                    setBarberos(data);
                } else {
                    console.error("Error al obtener barberos:", data.error);
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBarberos();
    }, []);

    const todayStr = useMemo(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }, []);

    // Calcular dinámicamente los horarios disponibles cada 30 min
    const availableTimes = useMemo(() => {
        // Agregado !selectedDate para no mostrar horas si no ha escogido fecha
        if (!selectedBarber || barberos.length === 0 || !selectedDate) return [];
        
        const barber = barberos.find(b => b.id === selectedBarber);
        if (!barber || !barber.horarioLaboral) return [];

        // Ej. "09:00 - 18:00"
        const partes = barber.horarioLaboral.split("-");
        if (partes.length !== 2) return [];

        const [startHour, startMin] = partes[0].trim().split(":").map(Number);
        const [endHour, endMin] = partes[1].trim().split(":").map(Number);

        const now = new Date();
        const isToday = selectedDate === todayStr;
        const currentHourReal = now.getHours();
        const currentMinReal = now.getMinutes();

        const times = [];
        let currentHour = startHour;
        let currentMin = startMin;

        // Bucle hasta que alcancemos la hora de salida
        while (currentHour < endHour || (currentHour === endHour && currentMin <= endMin)) {
            // Filtrar horas pasadas si el día seleccionado es HOY
            if (!isToday || currentHour > currentHourReal || (currentHour === currentHourReal && currentMin > currentMinReal)) {
                const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
                times.push(timeStr);
            }
            
            currentMin += 30;
            if (currentMin >= 60) {
                currentMin %= 60;
                currentHour += 1;
            }
        }
        return times;
    }, [selectedBarber, barberos, selectedDate, todayStr]);

    const handleAgendar = async () => {
        if (!selectedBarber || !selectedDate || !selectedTime) {
            alert("Por favor completa todos los campos (Barbero, Fecha y Hora).");
            return;
        }

        // Verificamos si el usuario inició sesión leyendo el almacenamiento del navegador
        const userInfoInfo = localStorage.getItem('user_info');
        if (!userInfoInfo) {
            alert("Debes iniciar sesión primero para poder agendar tu cita.");
            navigate('/login');
            return;
        }
        
        const userInfo = JSON.parse(userInfoInfo);

        try {
            // Construir la fecha exacta uniendo el día y la hora
            const fechaHoraCompleta = new Date(`${selectedDate}T${selectedTime}:00`);

            const response = await fetch(import.meta.env.PROD ? "https://barber-reservas-proyect.onrender.com/api/cliente/reservas" : "http://localhost:3000/api/cliente/reservas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    clienteId: userInfo.id,
                    barberoId: selectedBarber,
                    servicioId: serviceInfo.serviceId,
                    fechaHora: fechaHoraCompleta.toISOString()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al intentar crear la reserva.");
            }

            alert(`¡Éxito! ✂️\n\nTu cita ha sido agendada en la Base de Datos.\nServicio: ${serviceInfo.serviceName}\nDía: ${selectedDate}\nHora: ${selectedTime}`);
            navigate('/');

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="p-6 text-white pb-32 max-w-md mx-auto">
            {/* Cabecera */}
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white p-2 bg-zinc-800 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-2xl font-bold tracking-wide">Agendar Cita</h2>
            </div>

            {/* Info del servicio seleccionado */}
            {serviceInfo.serviceName && (
                <div className="bg-zinc-800/80 border border-zinc-700 p-4 rounded-xl mb-8 flex justify-between items-center shadow-md">
                    <div>
                        <h3 className="text-lg font-semibold text-[#CFAE79]">{serviceInfo.serviceName}</h3>
                        <p className="text-sm text-gray-400">{serviceInfo.serviceDuration}</p>
                    </div>
                    <div className="text-xl font-bold text-zinc-100">{serviceInfo.servicePrice}</div>
                </div>
            )}

            {/* Seleccionar Barbero */}
            <h3 className="text-lg font-semibold mb-4 text-zinc-100">1. Selecciona un Barbero</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-6">
                {loading ? (
                    <p className="text-gray-400 text-sm">Cargando barberos...</p>
                ) : barberos.length === 0 ? (
                    <p className="text-gray-400 text-sm">No hay barberos aún registrados en la base de datos.</p>
                ) : (
                    barberos.map((barber) => (
                        <div

                            key={barber.id}
                            onClick={() => {
                                setSelectedBarber(barber.id);
                                setSelectedTime(""); // Limpiar hora seleccionada al cambiar barbero
                            }}
                            className={`flex flex-col items-center min-w-[80px] cursor-pointer transition-all duration-300 ${selectedBarber === barber.id ? 'scale-110' : 'scale-100 opacity-70 hover:opacity-100'}`}
                        >
                            <div className={`w-[76px] h-[76px] rounded-full p-1 border-2 mb-2 overflow-hidden bg-[#2A2A3A] transition-colors ${selectedBarber === barber.id ? 'border-[#CFAE79]' : 'border-transparent'}`}>
                                <img src={barber.imagen} alt={barber.nombre} className="w-full h-full rounded-full object-cover" />
                            </div>
                            <span className={`text-[14px] font-semibold ${selectedBarber === barber.id ? 'text-[#CFAE79]' : 'text-gray-300'}`}>{barber.nombre}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Seleccionar Fecha */}
            <h3 className="text-lg font-semibold mb-4 text-zinc-100">2. Fecha de la cita</h3>
            <div className="mb-8">
                <input
                    type="date"
                    min={todayStr}
                    value={selectedDate}
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime(""); // Limpiar hora seleccionada si se cambia el día
                    }}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white p-4 rounded-xl focus:outline-none focus:border-[#CFAE79] focus:ring-1 focus:ring-[#CFAE79]"
                />
            </div>

            {/* Seleccionar Hora */}
            <h3 className="text-lg font-semibold mb-4 text-zinc-100">3. Hora de la cita</h3>
            {availableTimes.length === 0 ? (
                <p className="text-gray-400 text-sm mb-10">Selecciona un barbero y una fecha válida para ver horarios disponibles.</p>
            ) : (
                <div className="grid grid-cols-3 gap-3 mb-10">
                    {availableTimes.map((time) => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 rounded-lg text-sm font-medium transition-all duration-300 ${selectedTime === time ? 'bg-[#CFAE79] text-black shadow-lg shadow-[#CFAE79]/20' : 'bg-zinc-800 text-gray-300 border border-zinc-700 hover:border-gray-500 hover:bg-zinc-700'}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-4 mt-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex-1 py-4 px-4 bg-zinc-800 text-white font-semibold rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleAgendar}
                    className="flex-1 py-4 px-4 bg-[#CFAE79] text-black font-semibold rounded-xl hover:bg-[#b89b6b] transition-colors shadow-lg shadow-[#CFAE79]/30"
                >
                    Agendar Cita
                </button>
            </div>
        </div>
    );
}
