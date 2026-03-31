
function Barbers({ nombre, imagen, valoracion }) {
    const imgUrl = imagen || null;
    const barberName = nombre || 'Dacarlos';
    const barberRating = valoracion || '★★★★★';

    return (
        <div className="flex flex-col items-center min-w-[76px]">
            <div className="w-[76px] h-[76px] rounded-full p-1 border border-[#CFAE79]/60 mb-2 overflow-hidden bg-[#2A2A3A] flex items-center justify-center">
                {imgUrl ? (
                    <img src={imgUrl} alt="Barbero" className="w-full h-full rounded-full object-cover" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#CFAE79" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M8 3v2" />
                      <path d="M12 3v2" />
                      <path d="M16 3v2" />
                      <path d="M9 12v6a3 3 0 0 0 6 0v-6h-6" />
                      <path d="M8 5h8l-1 4h-6l-1 -4" />
                      <path d="M12 17v1" />
                    </svg>
                )}
            </div>
            <span className="text-[14px] font-semibold text-gray-200">{barberName}</span>
            <div className="text-[#CFAE79] text-xs tracking-tighter mt-0.5">{barberRating}</div>
        </div>
    );
}

export default Barbers;