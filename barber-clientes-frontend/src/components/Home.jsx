import { useState } from 'react';
import Reserv_Card from '../components_ui/Reserv_Card';
import Barbers from '../components_ui/barbers';

export default function Home() {
  const mockBarbersFromDB = [
    {
      id: 1,
      nombre: "Dacarlos",
      imagen: null,
      valoracion: "★★★★★"
    },
    {
      id: 2,
      nombre: "Papo",
      imagen: null,
      valoracion: "★★★★★"
    },
    {
      id: 3,
      nombre: "Dakoo",
      imagen: null,
      valoracion: "★★★★★"
    },
    {
      id: 4,
      nombre: "Dacarlos",
      imagen: null,
      valoracion: "★★★★★"
    },
    {
      id: 5,
      nombre: "Dacarlos",
      imagen: null,
      valoracion: "★★★★★"
    }
  ];

  return (
    <div className="bg-linear-to-b from-[#1a1e2d] via-[#151620] to-[#0a0b10] min-h-screen text-white pb-24 font-sans px-5 pt-12">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[34px] font-medium leading-tight text-gray-200 tracking-wide">Hola,</h1>
          <h1 className="text-[34px] font-bold leading-tight text-[#CFAE79] tracking-wide">Dacarlos</h1>
        </div>
        <img
          src={null}
          alt="User Profile"
          className="w-[52px] h-[52px] rounded-full object-cover border border-gray-600"
        />
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
        {mockBarbersFromDB.map((barber) => (
          <Barbers
            key={barber.id}
            nombre={barber.nombre}
            imagen={barber.imagen}
            valoracion={barber.valoracion}
          />
        ))}
      </div>
    </div>
  );
}

