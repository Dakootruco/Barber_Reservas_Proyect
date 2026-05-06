import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  DollarSign,
  Star,
  Clock,
  ArrowUpRight,
  MoreVertical,
  Scissors,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const API_BASE = 'http://localhost:3000/api';

// Mapeo de estados DB → UI
const statusDbToUi = {
  'PENDIENTE': 'Pendiente',
  'COMPLETADA': 'Completada',
  'CANCELADA': 'Cancelada',
  'NO_LLEGO': 'No llegó',
};

const statusColors = {
  'Pendiente': 'bg-amber-100 text-amber-700',
  'Completada': 'bg-emerald-100 text-emerald-700',
  'Cancelada': 'bg-zinc-100 text-zinc-600',
  'No llegó': 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/stats`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
      setError('No se pudieron cargar los datos del dashboard. ¿Está el backend corriendo?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- RENDER ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <Loader2 size={36} className="text-[#CFAE79] animate-spin" />
        <p className="text-zinc-500 text-sm">Cargando dashboard desde la base de datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <AlertCircle size={36} className="text-red-400" />
        <p className="text-zinc-700 font-medium">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 text-sm font-medium text-white bg-[#CFAE79] hover:bg-[#b89965] rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Extraer datos del stats
  const {
    ingresosTotales = 0,
    totalCitas = 0,
    citasHoy = 0,
    totalClientes = 0,
    totalServicios = 0,
    topBarberos = [],
    proximasCitas = [],
  } = stats || {};

  // Preparar datos para el gráfico desde el desglose de estados
  const desgloseEstados = stats?.desgloseEstados || [];
  const chartData = desgloseEstados.map(item => ({
    name: statusDbToUi[item.estado] || item.estado,
    cantidad: item._count.estado,
  }));

  // Mapear las próximas citas
  const appointmentsList = proximasCitas.map(reserva => {
    const fecha = new Date(reserva.fechaHora);
    const uiStatus = statusDbToUi[reserva.estado] || reserva.estado;
    return {
      id: reserva.id,
      client: reserva.cliente?.nombre || 'Sin cliente',
      service: reserva.servicio?.nombre || 'Sin servicio',
      barber: reserva.barbero?.nombre || 'Sin barbero',
      time: fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase(),
      status: uiStatus,
      avatar: (reserva.cliente?.nombre || 'NN').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    };
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Resumen general de tu barbería.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-[#CFAE79] hover:bg-[#b89965] text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors shadow-sm flex items-center gap-2"
        >
          <CalendarIcon size={16} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KpiCard
          title="Ingresos Totales"
          value={`$${ingresosTotales.toFixed(2)}`}
          icon={<DollarSign size={22} className="text-[#CFAE79]" />}
        />
        <KpiCard
          title="Citas Hoy"
          value={citasHoy.toString()}
          icon={<CalendarIcon size={22} className="text-blue-500" />}
        />
        <KpiCard
          title="Total Clientes"
          value={totalClientes.toString()}
          icon={<Users size={22} className="text-purple-500" />}
        />
        <KpiCard
          title="Total Citas"
          value={totalCitas.toString()}
          icon={<Scissors size={22} className="text-emerald-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Citas por Estado */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-800">Citas por Estado</h2>
              <p className="text-sm text-zinc-500">Distribución del total de reservas</p>
            </div>
          </div>
          {chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCantidad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#CFAE79" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#CFAE79" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#27272a', fontWeight: 500 }}
                  />
                  <Area type="monotone" dataKey="cantidad" name="Citas" stroke="#CFAE79" strokeWidth={3} fillOpacity={1} fill="url(#colorCantidad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-zinc-400 text-sm">
              No hay datos de citas para mostrar
            </div>
          )}
        </div>

        {/* Top Barberos */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-zinc-800">Top Barberos</h2>
          </div>
          <div className="space-y-5">
            {topBarberos.length > 0 ? (
              topBarberos.map((barber, index) => {
                const initials = (barber.nombre || 'NN').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                return (
                  <div key={barber.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-semibold border-2 border-white shadow-sm">
                          {initials}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                            <Star size={8} className="text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-zinc-800 group-hover:text-[#CFAE79] transition-colors">{barber.nombre}</h3>
                        <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                          <CalendarIcon size={12} />
                          <span>{barber.totalCitas} citas</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-zinc-800 bg-zinc-50 px-2.5 py-1 rounded-lg">
                      ${barber.ingresos.toFixed(2)}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-zinc-400 text-center py-8">No hay barberos registrados</p>
            )}
          </div>
        </div>
      </div>

      {/* Próximas Citas */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-800">Citas de Hoy</h2>
            <p className="text-sm text-zinc-500">Reservas programadas para el día</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Cliente</th>
                <th scope="col" className="px-6 py-4 font-medium">Servicio</th>
                <th scope="col" className="px-6 py-4 font-medium">Barbero</th>
                <th scope="col" className="px-6 py-4 font-medium">Hora</th>
                <th scope="col" className="px-6 py-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {appointmentsList.length > 0 ? (
                appointmentsList.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#CFAE79]/20 text-[#CFAE79] flex items-center justify-center font-semibold text-xs">
                          {appointment.avatar}
                        </div>
                        <span className="font-medium text-zinc-900">{appointment.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{appointment.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{appointment.barber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-zinc-400" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status] || 'bg-zinc-100 text-zinc-600'}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                    No hay citas programadas para hoy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Subcomponente para las tarjetas KPI
function KpiCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-zinc-50 rounded-xl">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-zinc-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
