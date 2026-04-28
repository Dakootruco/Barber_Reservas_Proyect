import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Star, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Scissors
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Datos de prueba (Mocks)
const revenueData = [
  { name: 'Lun', current: 4000, previous: 2400 },
  { name: 'Mar', current: 3000, previous: 1398 },
  { name: 'Mié', current: 2000, previous: 9800 },
  { name: 'Jue', current: 2780, previous: 3908 },
  { name: 'Vie', current: 1890, previous: 4800 },
  { name: 'Sáb', current: 2390, previous: 3800 },
  { name: 'Dom', current: 3490, previous: 4300 },
];

const upcomingAppointments = [
  { id: 1, client: 'Carlos Mendoza', service: 'Corte Clásico + Barba', barber: 'David G.', time: '10:00 AM', status: 'Confirmada', avatar: 'CM' },
  { id: 2, client: 'Luis Torres', service: 'Fade Texturizado', barber: 'Andrés P.', time: '10:30 AM', status: 'En espera', avatar: 'LT' },
  { id: 3, client: 'Javier Roca', service: 'Perfilado de Barba', barber: 'David G.', time: '11:15 AM', status: 'Confirmada', avatar: 'JR' },
  { id: 4, client: 'Miguel Ángel', service: 'Corte VIP', barber: 'Roberto S.', time: '12:00 PM', status: 'Confirmada', avatar: 'MA' },
];

const topBarbers = [
  { id: 1, name: 'David G.', rating: 4.9, appointments: 42, revenue: '$1,250' },
  { id: 2, name: 'Andrés P.', rating: 4.8, appointments: 38, revenue: '$1,100' },
  { id: 3, name: 'Roberto S.', rating: 4.7, appointments: 30, revenue: '$950' },
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('Esta Semana');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Resumen general de tu barbería hoy.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-zinc-200 text-zinc-700 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] block w-full p-2.5 shadow-sm outline-none transition-all cursor-pointer"
          >
            <option>Hoy</option>
            <option>Esta Semana</option>
            <option>Este Mes</option>
            <option>Este Año</option>
          </select>
          <button className="bg-[#CFAE79] hover:bg-[#b89965] text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors shadow-sm flex items-center gap-2">
            <CalendarIcon size={16} />
            <span>Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* KPIs (Key Performance Indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KpiCard 
          title="Ingresos Totales" 
          value="$12,450" 
          trend="+15.3%" 
          isPositive={true} 
          icon={<DollarSign size={22} className="text-[#CFAE79]" />} 
        />
        <KpiCard 
          title="Citas Hoy" 
          value="24" 
          trend="+5.2%" 
          isPositive={true} 
          icon={<CalendarIcon size={22} className="text-blue-500" />} 
        />
        <KpiCard 
          title="Nuevos Clientes" 
          value="8" 
          trend="-2.1%" 
          isPositive={false} 
          icon={<Users size={22} className="text-purple-500" />} 
        />
        <KpiCard 
          title="Servicios Realizados" 
          value="142" 
          trend="+12.5%" 
          isPositive={true} 
          icon={<Scissors size={22} className="text-emerald-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Principal */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-800">Análisis de Ingresos</h2>
              <p className="text-sm text-zinc-500">Comparativa con el periodo anterior</p>
            </div>
            <button className="p-2 hover:bg-zinc-50 rounded-full transition-colors">
              <MoreVertical size={20} className="text-zinc-400" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CFAE79" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#CFAE79" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#27272a', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="current" name="Actual" stroke="#CFAE79" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                <Area type="monotone" dataKey="previous" name="Anterior" stroke="#e4e4e7" strokeWidth={2} fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Barberos */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-zinc-800">Top Barberos</h2>
            <button className="text-sm text-[#CFAE79] hover:text-[#b89965] font-medium transition-colors">Ver todos</button>
          </div>
          <div className="space-y-5">
            {topBarbers.map((barber, index) => (
              <div key={barber.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-semibold border-2 border-white shadow-sm">
                      {barber.name.split(' ')[0][0]}{barber.name.split(' ')[1][0]}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                        <Star size={8} className="text-white fill-current" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-zinc-800 group-hover:text-[#CFAE79] transition-colors">{barber.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                      <Star size={12} className="text-yellow-400 fill-current" />
                      <span>{barber.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{barber.appointments} citas</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-zinc-800 bg-zinc-50 px-2.5 py-1 rounded-lg">
                  {barber.revenue}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-zinc-100">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Actividad Reciente</h2>
             </div>
             <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#CFAE79] mt-1.5"></div>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-700">Nueva reserva de <span className="font-medium">Carlos M.</span></p>
                    <p className="text-xs text-zinc-400 mt-0.5">Hace 5 minutos</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></div>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-700">Pago recibido <span className="font-medium">$25.00</span></p>
                    <p className="text-xs text-zinc-400 mt-0.5">Hace 12 minutos</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Próximas Citas */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-800">Próximas Citas</h2>
            <p className="text-sm text-zinc-500">Gestión de la agenda del día</p>
          </div>
          <button className="text-sm bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium px-4 py-2 rounded-lg transition-colors">
            Ver Agenda Completa
          </button>
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
                <th scope="col" className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {upcomingAppointments.map((appointment) => (
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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'Confirmada' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-zinc-400 hover:text-[#CFAE79] transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Subcomponente para las tarjetas KPI
function KpiCard({ title, value, trend, isPositive, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-zinc-50 rounded-xl">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{trend}</span>
        </div>
      </div>
      <div>
        <h3 className="text-zinc-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
