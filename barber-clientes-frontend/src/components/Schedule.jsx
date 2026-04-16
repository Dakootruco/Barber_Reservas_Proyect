import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importar español para las fechas
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

const misCitas = [
  {
    title: 'Corte de Cabello - Juan',
    start: new Date(2026, 3, 16, 10, 0), // Nota: los meses en JS empiezan en 0 (3 es Abril)
    end: new Date(2026, 3, 16, 11, 0),
  },
  {
    title: 'Barba - Carlos',
    start: new Date(2026, 3, 16, 11, 30),
    end: new Date(2026, 3, 16, 12, 0),
  }
];

export default function Schedule() {
  
  // 1. FUNCIÓN PARA ESTILIZAR LOS EVENTOS USANDO TAILWIND
  const eventStyleGetter = (event, start, end, isSelected) => {
    const isBarba = event.title.includes('Barba');
    
    // ¡AQUÍ ES DONDE PASAS TUS CLASES DE TAILWIND!
    const tailwindClasses = isBarba 
      ? 'bg-[#CFAE79] text-zinc-900 font-semibold rounded-md border-none shadow-sm text-sm px-1' 
      : 'bg-zinc-800 text-white font-semibold rounded-md border-none shadow-sm text-sm px-1';

    return {
      className: tailwindClasses,
      style: {
        outline: 'none' // Solo dejamos esto para quitar el borde de enfoque azul molesto de los navegadores
      }
    };
  };

  return (
    <div className="p-8 h-full flex flex-col bg-gray-50">
      <h1 className="text-3xl font-bold text-zinc-800">Calendario de Citas</h1>
      <p className="mt-2 text-zinc-500 font-medium mb-6">Administra tus reservas de forma visual.</p>

      {/* Contenedor del calendario */}
      <div className="flex-1 min-h-[600px] bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
        <Calendar
          localizer={localizer}
          events={misCitas}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter} // <--- ASIGNAMOS LOS ESTILOS AQUÍ
          style={{ height: '100%' }}
          messages={{
            next: "Sig",
            previous: "Ant",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "No hay citas programadas en este rango.",
          }}
        />
      </div>
    </div>
  );
}
