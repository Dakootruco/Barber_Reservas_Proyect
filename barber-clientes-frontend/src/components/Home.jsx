import { useState, useEffect } from 'react';
import Reserv_Card from '../components_ui/Reserv_Card';
import Barbers from '../components_ui/barbers';

export default function Home() {
  const [barberos, setBarberos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Variable temporal de imagen (hasta que tengas la real del backend)
  const img = null;

  // Extraer el nombre del usuario desde la sesión
  const userInfoInfo = localStorage.getItem('user_info');
  const userName = userInfoInfo ? JSON.parse(userInfoInfo).nombre : "Invitado";

  useEffect(() => {
    // Función para obtener los barberos reales desde el backend
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

  return (
    <div className="bg-linear-to-b from-[#1a1e2d] via-[#151620] to-[#0a0b10] min-h-screen text-white pb-24 font-sans px-5 pt-12">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[34px] font-medium leading-tight text-gray-200 tracking-wide">Hola,</h1>
          <h1 className="text-[34px] font-bold leading-tight text-[#CFAE79] tracking-wide">{userName}</h1>
        </div>

        <a href="/perfil" className="hover:cursor-pointer">
          {img == null ? (
            <div className="w-[52px] h-[52px] rounded-full bg-[#ffffff] flex items-center justify-center border border-gray-600 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="gray" className="icon icon-tabler icons-tabler-filled icon-tabler-user"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" /><path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" /></svg>
            </div>
          ) : (
            <img
              src={img}
              alt="User Profile"
              className="w-[52px] h-[52px] rounded-full object-cover border border-gray-600"
            />
          )}
        </a>
      </div>

      {/* RESERVATION CARD */}
      <div className="mb-8">
        <Reserv_Card />
      </div>

      {/* BARBERS SECTION */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-zinc-100 tracking-wide">Nuestros Barberos</h2>
        <button className="text-[#CFAE79] text-[15px] pr-1">Ver todos</button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {loading ? (
          <p className="text-gray-400 text-sm">Cargando barberos...</p>
        ) : barberos.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay barberos aún registrados en la base de datos.</p>
        ) : (
          barberos.map((barber) => (
            <Barbers
              key={barber.id}
              nombre={barber.nombre}
              imagen={barber.imagen}
              valoracion={barber.valoracion}
            />
          ))
        )}
      </div>
    </div>
  );
}
