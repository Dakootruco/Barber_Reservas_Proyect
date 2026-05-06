import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  X,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Filter,
  Loader2
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

// Mapeo: lo que guarda la BD (MAYÚSCULAS) ↔ lo que muestra la UI (legible)
const statusDbToUi = {
  'PENDIENTE': 'Pendiente',
  'CONFIRMADA': 'Pendiente',  // Confirmada se muestra como Pendiente en el admin
  'COMPLETADA': 'Completada',
  'CANCELADA': 'Cancelada',
  'NO_LLEGO': 'No llegó',
};

const statusUiToDb = {
  'Pendiente': 'PENDIENTE',
  'Completada': 'COMPLETADA',
  'No llegó': 'NO_LLEGO',
  'Cancelada': 'CANCELADA',
};

const statusColors = {
  'Pendiente': 'bg-amber-100 text-amber-700 border-amber-200',
  'Completada': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'No llegó': 'bg-red-100 text-red-700 border-red-200',
  'Cancelada': 'bg-zinc-100 text-zinc-600 border-zinc-200'
};

// Transforma una reserva de la BD al formato que usa el componente
function mapReservaToAppointment(reserva) {
  const fecha = new Date(reserva.fechaHora);
  return {
    id: reserva.id,
    time: fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase(),
    date: fecha,
    client: reserva.cliente?.nombre || 'Sin cliente',
    service: reserva.servicio?.nombre || 'Sin servicio',
    barber: reserva.barbero?.nombre || 'Sin barbero',
    price: `$${(reserva.servicio?.precio || 0).toFixed(2)}`,
    priceNum: reserva.servicio?.precio || 0,
    status: statusDbToUi[reserva.estado] || reserva.estado,
    avatar: (reserva.cliente?.nombre || 'NN').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
  };
}

export default function Citas() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el modal de nueva cita
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FETCH: Obtener citas desde la BD ---
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/reservas`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setAppointments(data.map(mapReservaToAppointment));
    } catch (err) {
      console.error('Error al obtener citas:', err);
      setError('No se pudieron cargar las citas. ¿Está el backend corriendo?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filtrado
  const filteredAppointments = appointments.filter(app =>
    app.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.barber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // KPIs
  const totalToday = appointments.length;
  const completed = appointments.filter(a => a.status === 'Completada').length;
  const pending = appointments.filter(a => a.status === 'Pendiente').length;

  // Calcular ingresos (sumar completados + pendientes como estimado)
  const estimatedRevenue = appointments
    .filter(a => a.status === 'Completada' || a.status === 'Pendiente')
    .reduce((acc, curr) => acc + curr.priceNum, 0);

  // --- PUT: Actualizar estado de la reserva en la BD ---
  const handleStatusChange = async (id, newUiStatus) => {
    const dbStatus = statusUiToDb[newUiStatus];

    // Optimistic update: actualiza la UI inmediatamente
    setAppointments(prev =>
      prev.map(app => app.id === id ? { ...app, status: newUiStatus } : app)
    );

    try {
      const response = await fetch(`${API_BASE}/admin/reservas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: dbStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar');
      }
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      // Revertir si falla → recargar del server
      fetchAppointments();
    }
  };

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    // TODO: Cuando se conecte el modal a la BD, usar POST /api/cliente/reservas
    // Por ahora el modal queda como placeholder visual
    setIsModalOpen(false);
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <Loader2 size={36} className="text-[#CFAE79] animate-spin" />
        <p className="text-zinc-500 text-sm">Cargando citas desde la base de datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <AlertCircle size={36} className="text-red-400" />
        <p className="text-zinc-700 font-medium">{error}</p>
        <button
          onClick={fetchAppointments}
          className="px-4 py-2 text-sm font-medium text-white bg-[#CFAE79] hover:bg-[#b89965] rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Agenda de Hoy</h1>
          <p className="text-zinc-500 mt-1">Gestiona las reservas y estados en tiempo real.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="bg-white border border-zinc-200 text-zinc-700 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 shadow-sm outline-none cursor-pointer"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#CFAE79] hover:bg-[#b89965] text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <KpiCard
          title="Total Citas"
          value={totalToday.toString()}
          icon={<CalendarIcon size={22} className="text-blue-500" />}
        />
        <KpiCard
          title="Pendientes"
          value={pending.toString()}
          icon={<Clock size={22} className="text-amber-500" />}
        />
        <KpiCard
          title="Completadas"
          value={completed.toString()}
          icon={<CheckCircle2 size={22} className="text-emerald-500" />}
        />
        <KpiCard
          title="Ingresos Est."
          value={`$${estimatedRevenue.toFixed(2)}`}
          icon={<DollarSign size={22} className="text-[#CFAE79]" />}
        />
      </div>

      {/* Toolbar & Search */}
      <div className="bg-white p-4 rounded-t-2xl shadow-sm border border-zinc-100 border-b-0 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por cliente, barbero o servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] block w-full pl-10 p-2.5 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors w-full sm:w-auto">
          <Filter size={16} />
          Filtrar Estados
        </button>
      </div>

      {/* Tabla Interactiva de Citas */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Hora</th>
                <th scope="col" className="px-6 py-4 font-medium">Cliente</th>
                <th scope="col" className="px-6 py-4 font-medium">Servicio</th>
                <th scope="col" className="px-6 py-4 font-medium">Barbero</th>
                <th scope="col" className="px-6 py-4 font-medium">Precio</th>
                <th scope="col" className="px-6 py-4 font-medium w-48">Estado (Clic para cambiar)</th>
                <th scope="col" className="px-6 py-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-900 font-semibold">
                        <Clock size={14} className="text-[#CFAE79]" />
                        {app.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-semibold text-xs border border-zinc-200">
                          {app.avatar}
                        </div>
                        <span className="font-medium text-zinc-900">{app.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{app.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-700">{app.barber}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-800">{app.price}</td>

                    {/* Selector de Estado Interactivo */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`appearance-none w-full px-3 py-1.5 pr-8 rounded-full text-xs font-medium border outline-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-[#CFAE79]/50 transition-colors ${statusColors[app.status] || 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Completada">Completada</option>
                          <option value="No llegó">No llegó</option>
                          <option value="Cancelada">Cancelada</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                          <svg className={`h-3 w-3 ${(statusColors[app.status] || '').split(' ')[1] || 'text-zinc-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                    {appointments.length === 0 ? 'No hay citas registradas en la base de datos.' : 'No se encontraron citas en la búsqueda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear Cita */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-zinc-100">
              <h2 className="text-lg font-semibold text-zinc-800">Nueva Cita</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveAppointment} className="p-5 space-y-4">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle size={32} className="text-amber-400 mb-3" />
                <p className="text-sm text-zinc-500 max-w-xs">
                  La creación de citas desde el admin se conectará al sistema de reservas en una próxima fase.
                  Por ahora, las citas se crean desde el <span className="font-semibold">frontend de clientes</span>.
                </p>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponente KPI
function KpiCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-zinc-100 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow duration-300">
      <div className="p-2.5 sm:p-3 bg-zinc-50 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
        <h3 className="text-zinc-500 text-xs sm:text-sm font-medium mt-0.5">{title}</h3>
      </div>
    </div>
  );
}
