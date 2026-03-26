


function Barbers() {
    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-zinc-100 tracking-wide">Nuestros Barberos</h2>
                <button className="text-[#CFAE79] text-[15px] pr-1">Ver el &gt;</button>
            </div>

            <div className="flex justify-between gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {/* Barbero 1 */}
                <div className="flex flex-col items-center min-w-[76px]">
                    <div className="w-[76px] h-[76px] rounded-full p-1 border border-[#CFAE79]/60 mb-2 overflow-hidden bg-[#2A2A3A]">
                        <img src="https://via.placeholder.com/150/333333/FFFFFF/?text=B1" alt="Barbero" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-200">Dacarlos</span>
                    <div className="text-[#CFAE79] text-xs tracking-tighter mt-0.5">★★★★★</div>
                </div>

                {/* Barbero 2 */}
                <div className="flex flex-col items-center min-w-[76px]">
                    <div className="w-[76px] h-[76px] rounded-full p-1 border border-gray-600 mb-2 overflow-hidden bg-[#2A2A3A]">
                        <img src="https://via.placeholder.com/150/333333/FFFFFF/?text=B2" alt="Barbero" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-200">Rienca</span>
                    <div className="text-[#CFAE79] text-xs tracking-tighter mt-0.5">★★★★★</div>
                </div>

                {/* Barbero 3 */}
                <div className="flex flex-col items-center min-w-[76px]">
                    <div className="w-[76px] h-[76px] rounded-full p-1 border border-gray-600 mb-2 overflow-hidden bg-[#2A2A3A]">
                        <img src="https://via.placeholder.com/150/333333/FFFFFF/?text=B3" alt="Barbero" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-200">Dacarlos</span>
                    <div className="text-[#CFAE79] text-xs tracking-tighter mt-0.5">★★★★<span className="text-gray-600">★</span></div>
                </div>

                {/* Barbero 4 */}
                <div className="flex flex-col items-center min-w-[76px]">
                    <div className="w-[76px] h-[76px] rounded-full p-1 border border-gray-600 mb-2 overflow-hidden bg-[#2A2A3A]">
                        <img src="https://via.placeholder.com/150/333333/FFFFFF/?text=B4" alt="Barbero" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-200">Kevin</span>
                    <div className="text-[#CFAE79] text-xs tracking-tighter mt-0.5">★★★★★</div>
                </div>
            </div>

            <div className="flex justify-end pr-2 mt-2">
                <button className="text-[#CFAE79] text-[15px]">Ver todos</button>
            </div>

        </div>
    )

}
export default Barbers