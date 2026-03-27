

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Select() {
    const navigate = useNavigate();
    const location = useLocation();

    // Datos pasados desde Service_card
    const serviceInfo = location.state || {};

    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const mockBarbers = [
        { id: 1, nombre: "Dacarlos", imagen: null },
        { id: 2, nombre: "Papo", imagen: null },
        { id: 3, nombre: "Dakoo", imagen: null },
        { id: 4, nombre: "Kevin", imagen: null },
    ];

    const availableTimes = ["09:00", "10:00", "11:30", "13:00", "15:00", "17:00"];

    const handleAgendar = () => {
        if (!selectedBarber || !selectedDate || !selectedTime) {
            alert("Por favor completa todos los campos (Barbero, Fecha y Hora).");
            return;
        }
        alert(`¡Cita agendada!\nServicio: ${serviceInfo.serviceName || 'Corte'}\nFecha: ${selectedDate}\nHora: ${selectedTime}`);
        navigate('/schedule'); // Puedes redirigir a donde quieras después de agendar
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
                {mockBarbers.map((barber) => (
                    <div
                        key={barber.id}
                        onClick={() => setSelectedBarber(barber.id)}
                        className={`flex flex-col items-center min-w-[80px] cursor-pointer transition-all duration-300 ${selectedBarber === barber.id ? 'scale-110' : 'scale-100 opacity-70 hover:opacity-100'}`}
                    >
                        <div className={`w-[76px] h-[76px] rounded-full p-1 border-2 mb-2 overflow-hidden bg-[#2A2A3A] transition-colors ${selectedBarber === barber.id ? 'border-[#CFAE79]' : 'border-transparent'}`}>
                            <img src={barber.imagen} alt={barber.nombre} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <span className={`text-[14px] font-semibold ${selectedBarber === barber.id ? 'text-[#CFAE79]' : 'text-gray-300'}`}>{barber.nombre}</span>
                    </div>
                ))}
            </div>

            {/* Seleccionar Fecha */}
            <h3 className="text-lg font-semibold mb-4 text-zinc-100">2. Fecha de la cita</h3>
            <div className="mb-8">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white p-4 rounded-xl focus:outline-none focus:border-[#CFAE79] focus:ring-1 focus:ring-[#CFAE79]"
                />
            </div>

            {/* Seleccionar Hora */}
            <h3 className="text-lg font-semibold mb-4 text-zinc-100">3. Hora de la cita</h3>
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
