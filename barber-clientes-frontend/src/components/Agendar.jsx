import Service_card from "../components_ui/Service_card";
import { useState, useEffect } from 'react';

export default function Service() {
  // Simularemos los datos que vendrán de la base de datos (BD)
  // Cuando tengas tu backend listo, reemplazarás esto con un estado y un useEffect (fetch).
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/cliente/servicios");
        const data = await response.json();
        if (response.ok) {
          setServices(data);
        } else {
          console.error("Error al obtener servicios:", data.error);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-zinc-100 tracking-wide mb-8">Nuestros Servicios</h2>

      {/* Contenedor Grid Responsivo: 1 columna en móviles, 2 en tablets, 3 o 4 en pantallas grandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {loading ? (
          <p className="text-gray-400 text-sm">Cargando servicios...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay servicios aún registrados en la base de datos.</p>
        ) : (
          services.map((service) => (
            <Service_card
              key={service.id}
              id={service.id}
              name={service.nombre}
              price={`$${service.precio}`}
              duration={`${service.duracion} Minutos`}
              image={service.imagen}
            />
          ))
        )}
      </div>
    </div>
  );
}
