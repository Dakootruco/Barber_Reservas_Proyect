function Reserv_Card() {
    return (
        <div className="bg-[#2A2A3A] text-white p-5 rounded-[28px] shadow-lg w-full max-w-sm mx-auto flex flex-col gap-5 border border-white/5">
            <h2 className="text-[17px] font-semibold text-white tracking-wide">Próxima Cita</h2>

            <div className="flex gap-4 items-center">
                {/* Cuadro de la fecha (Izquierda) */}
                <div className="bg-[#353545] flex flex-col justify-center items-center rounded-2xl min-w-[72px] h-[78px]">
                    <span className="text-[11px] text-gray-400 font-medium tracking-wide">Mié</span>
                    <span className="text-2xl font-bold text-white leading-none mt-0.5 mb-1">26</span>
                    <span className="text-[11px] text-gray-400 font-medium tracking-wide">Junio</span>
                </div>

                {/* Hora, Barbero y Servicio (Derecha) */}
                <div className="flex flex-col flex-1 pl-1 gap-2">
                    <p className="font-medium text-[17px] text-gray-200">Hora: 10:00</p>

                    <div className="flex items-center gap-2 mt-1">
                        <img
                            src=""
                            alt="Barbero"
                            className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-[15px] font-medium text-gray-300">Barbero: Dacarlos</span>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 mt-1">
                <button className="flex-1 bg-[#CFAE79] text-[#1a1b26] py-3.5 rounded-[14px] font-bold transition-all text-[15px] active:scale-95 shadow-sm">
                    Reprogramar
                </button>
                <button className="flex-1 bg-transparent border border-gray-500/50 text-gray-300 py-3.5 rounded-[14px] font-semibold transition-all text-[15px] active:scale-95 hover:bg-gray-500/10">
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default Reserv_Card;
