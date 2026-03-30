import { useState, useEffect } from 'react';
import Reserv_Card from '../components_ui/Reserv_Card';
import Barbers from '../components_ui/barbers';
import { FaUser } from "react-icons/fa";


export default function Home() {
  const [barberos, setBarberos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Variable temporal de imagen (hasta que tengas la real del backend)
  const img = null;

  useEffect(() => {
    // Función para obtener los barberos reales desde el backend
    const fetchBarberos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/cliente/barberos");
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
          <h1 className="text-[34px] font-bold leading-tight text-[#CFAE79] tracking-wide">Dacarlos</h1>
        </div>

        <a href="/perfil" className="hover:cursor-pointer">
          {img == null ? (
            <div className="w-[52px] h-[52px] rounded-full bg-[#ffffff] flex items-center justify-center border border-gray-600 shadow-inner">
              <FaUser className="text-2xl text-gray-400" />
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
