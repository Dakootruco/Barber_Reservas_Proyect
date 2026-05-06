import React, { useState, useEffect } from 'react';
import {
    Download,
    Users,
    Scissors,
    DollarSign,
    PieChart as PieChartIcon,
    BarChart2,
    LineChart as LineChartIcon,
    Loader2,
    AlertCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from 'recharts';

const API_BASE = 'http://localhost:3000/api';

export default function ReportesAnaliticas() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReportes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE}/admin/reportes`);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error('Error al obtener reportes:', err);
            setError('No se pudieron cargar los reportes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportes();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
                <Loader2 size={36} className="text-[#CFAE79] animate-spin" />
                <p className="text-zinc-500 text-sm">Cargando reportes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
                <AlertCircle size={36} className="text-red-400" />
                <p className="text-zinc-700 font-medium">{error}</p>
                <button onClick={fetchReportes} className="px-4 py-2 text-sm font-medium text-white bg-[#CFAE79] hover:bg-[#b89965] rounded-lg transition-colors">Reintentar</button>
            </div>
        );
    }

    const {
        topServicios = [],
        distribucionIngresos = [],
        clientGrowthData = [],
        totalReservasValidas = 0,
        ticketPromedio = 0,
        totalClientes = 0,
    } = data || {};

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Reportes y Analíticas</h1>
                    <p className="text-zinc-500 mt-1">Métricas clave para entender el crecimiento de tu negocio.</p>
                </div>
                <button onClick={fetchReportes} className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg text-sm px-4 py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <Download size={16} />
                    <span>Actualizar</span>
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <KpiCard
                    title="Ticket Promedio"
                    value={`$${ticketPromedio.toFixed(2)}`}
                    subtitle="Gasto promedio por cita"
                    icon={<DollarSign size={22} className="text-[#CFAE79]" />}
                />
                <KpiCard
                    title="Total Clientes"
                    value={totalClientes.toString()}
                    subtitle="Registrados en el sistema"
                    icon={<Users size={22} className="text-blue-500" />}
                />
                <KpiCard
                    title="Servicios Realizados"
                    value={totalReservasValidas.toString()}
                    subtitle="Total de citas completadas"
                    icon={<Scissors size={22} className="text-emerald-500" />}
                />
            </div>

            {/* Grid de Gráficos Superiores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Gráfico 1: Distribución de Ingresos (Pastel) */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-zinc-50 rounded-lg text-zinc-600"><PieChartIcon size={18} /></div>
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-800">Distribución de Ingresos</h2>
                            <p className="text-xs text-zinc-500">¿De dónde viene el dinero?</p>
                        </div>
                    </div>
                    {distribucionIngresos.length > 0 ? (
                        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center min-h-[250px]">
                            <div className="w-full sm:w-1/2 h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={distribucionIngresos} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {distribucionIngresos.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full sm:w-1/2 mt-4 sm:mt-0 flex flex-col gap-3 justify-center pl-0 sm:pl-4">
                                {distribucionIngresos.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-sm text-zinc-600">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-zinc-900">${item.value.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center min-h-[250px] text-zinc-400 text-sm">No hay datos</div>
                    )}
                </div>

                {/* Gráfico 2: Servicios Populares (Barras Horizontales) */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-zinc-50 rounded-lg text-zinc-600"><BarChart2 size={18} /></div>
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-800">Top 5 Servicios</h2>
                            <p className="text-xs text-zinc-500">Los más solicitados</p>
                        </div>
                    </div>
                    {topServicios.length > 0 ? (
                        <div className="flex-1 min-h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topServicios} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f4f4f5" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} width={120} />
                                    <Tooltip cursor={{ fill: '#f4f4f5' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="cantidad" name="Realizados" fill="#CFAE79" radius={[0, 4, 4, 0]} barSize={24}>
                                        {topServicios.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#CFAE79' : '#e4e4e7'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center min-h-[250px] text-zinc-400 text-sm">No hay datos</div>
                    )}
                </div>
            </div>

            {/* Gráfico 3: Crecimiento de Clientes (Líneas) */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 mt-2">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-zinc-50 rounded-lg text-zinc-600"><LineChartIcon size={18} /></div>
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-800">Crecimiento de Clientes</h2>
                        <p className="text-xs text-zinc-500">Nuevos clientes por mes (últimos 6 meses)</p>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={clientGrowthData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} allowDecimals={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontWeight: 500 }} />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            <Line type="monotone" dataKey="nuevos" name="Nuevos Clientes" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, subtitle, icon }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex items-start gap-4 hover:shadow-md transition-shadow duration-300">
            <div className="p-3 bg-zinc-50 rounded-xl">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-zinc-500 mt-0.5">{title}</p>
                <p className="text-2xl font-bold text-zinc-900 tracking-tight mt-1">{value}</p>
                {subtitle && <p className="text-xs text-zinc-400 mt-1.5">{subtitle}</p>}
            </div>
        </div>
    );
}