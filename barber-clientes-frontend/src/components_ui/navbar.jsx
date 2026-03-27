import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();

    // Función para saber si estamos en esa ruta
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A24] border-t border-[#2A2A3A] px-6 py-3 pb-8 md:pb-3 z-50">
            <ul className="flex justify-between items-center max-w-md mx-auto">
                {/* INICIO */}
                <li>
                    <Link to="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-[#CFAE79]' : 'text-gray-500 hover:text-gray-400'}`}>
                        <svg className="w-6 h-6" fill={isActive('/') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive('/') ? "0" : "2"}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-[11px] font-medium">Inicio</span>
                    </Link>
                </li>

                {/* AGENDAR*/}
                <li>
                    <Link to="/Agendar" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/Agendar') ? 'text-[#CFAE79]' : 'text-gray-500 hover:text-gray-400'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-[11px] font-medium">Agendar</span>
                    </Link>
                </li>

                {/* CALENDARIO */}
                <li>
                    <Link to="/schedule" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/schedule') ? 'text-[#CFAE79]' : 'text-gray-500 hover:text-gray-400'}`}>
                        <svg className="w-6 h-6" fill={isActive('/schedule') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive('/schedule') ? "0" : "2"}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[11px] font-medium">Calendario</span>
                    </Link>
                </li>

                {/* PERFIL */}
                <li>
                    <Link to="/perfil" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/perfil') ? 'text-[#CFAE79]' : 'text-gray-500 hover:text-gray-400'}`}>
                        <svg className="w-6 h-6" fill={isActive('/perfil') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive('/perfil') ? "0" : "2"}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-[11px] font-medium">Perfil</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
