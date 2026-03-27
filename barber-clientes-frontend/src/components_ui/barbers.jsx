
function Barbers({ nombre, imagen, valoracion }) {
    const imgUrl = imagen || null;
    const barberName = nombre || 'Dacarlos';
    const barberRating = valoracion || '★★★★★';

    return (
        <div className="flex flex-col items-center min-w-[76px]">
            <div className="w-[76px] h-[76px] rounded-full p-1 border border-[#CFAE79]/60 mb-2 overflow-hidden bg-[#2A2A3A]">
                <img src={imgUrl} alt="Barbero" className="w-full h-full rounded-full object-cover" />
            </div>
            <span className="text-[14px] font-semibold text-gray-200">{barberName}</span>
            <div className="text-[#CFAE79] text-xs tracking-tighter mt-0.5">{barberRating}</div>
        </div>
    );
}

export default Barbers;