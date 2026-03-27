import Service_card from "../components_ui/Service_card";

export default function Service() {
  // Simularemos los datos que vendrán de la base de datos (BD)
  // Cuando tengas tu backend listo, reemplazarás esto con un estado y un useEffect (fetch).
  const mockServicesFromDB = [
    {
      id: 1,
      name: "Corte Clásico",
      price: "$15",
      duration: "30 Minutos",
      image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Corte y Barba",
      price: "$25",
      duration: "45 Minutos",
      image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Corte Fade",
      price: "$20",
      duration: "40 Minutos",
      image: "https://images.unsplash.com/photo-1582230200388-1db25345aedc?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Perfilado de Cejas",
      price: "$10",
      duration: "15 Minutos",
      image: "https://images.unsplash.com/photo-1593702288056-cc1562681561?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-zinc-100 tracking-wide mb-8">Nuestros Servicios</h2>
      
      {/* Contenedor Grid Responsivo: 1 columna en móviles, 2 en tablets, 3 o 4 en pantallas grandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {mockServicesFromDB.map((service) => (
          <Service_card 
            key={service.id}
            name={service.name}
            price={service.price}
            duration={service.duration}
            image={service.image}
          />
        ))}
      </div>
    </div>
  );
}
