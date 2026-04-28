import React, { useState } from 'react';
import {
    Download,
    Calendar,
    Users,
    Scissors,
    DollarSign,
    ArrowUpRight,
    PieChart as PieChartIcon,
    BarChart2,
    LineChart as LineChartIcon
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

// Datos de prueba (Mocks)
const topServicesData = [
    { name: 'Corte Clásico', cantidad: 145 },
    { name: 'Fade Texturizado', cantidad: 98 },
    { name: 'Perfilado Barba', cantidad: 86 },
    { name: 'Corte + Barba', cantidad: 75 },
    { name: 'Colorimetría', cantidad: 32 },
];

const revenueDistributionData = [
    { name: 'Cortes', value: 5500, color: '#CFAE79' },
    { name: 'Productos', value: 2100, color: '#10b981' },
    { name: 'Barbas', value: 1800, color: '#3b82f6' },
    { name: 'Tratamientos', value: 900, color: '#8b5cf6' },
];

const clientGrowthData = [
    { name: 'Ene', recurrentes: 120, nuevos: 45 },
    { name: 'Feb', recurrentes: 135, nuevos: 52 },
    { name: 'Mar', recurrentes: 150, nuevos: 38 },
    { name: 'Abr', recurrentes: 162, nuevos: 65 },
    { name: 'May', recurrentes: 190, nuevos: 70 },
    { name: 'Jun', recurrentes: 210, nuevos: 85 },
];

export default function ReportesAnaliticas() {
    const [dateRange, setDateRange] = useState('Este Mes');

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Reportes y Analíticas</h1>
                    <p className="text-zinc-500 mt-1">Métricas clave para entender el crecimiento de tu negocio.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-white border border-zinc-200 text-zinc-700 text-sm font-medium rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none shadow-sm"
                    >
                        <option>Este Mes</option>
                        <option>Mes Pasado</option>
                        <option>Este Año</option>
                    </select>
                    <button className="flex-1 sm:flex-none bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg text-sm px-4 py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2">
                        <Download size={16} />
                        <span>Exportar PDF</span>
                    </button>
                </div>
            </div>

            {/* KPIs Estratégicos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <KpiCard
                    title="Ticket Promedio"
                    value="$32.50"
                    subtitle="Gasto por cliente"
                    icon={<DollarSign size={22} className="text-[#CFAE79]" />}
                    trend="+5.2%"
                    isPositive={true}
                />
                <KpiCard
                    title="Retención de Clientes"
                    value="78%"
                    subtitle="Vuelven antes de 45 días"
                    icon={<Users size={22} className="text-blue-500" />}
                    trend="+2.1%"
                    isPositive={true}
                />
                <KpiCard
                    title="Servicios Realizados"
                    value="436"
                    subtitle="Total en el periodo"
                    icon={<Scissors size={22} className="text-emerald-500" />}
                    trend="+14.5%"
                    isPositive={true}
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
                    <div className="flex-1 flex flex-col sm:flex-row items-center justify-center min-h-[250px]">
                        <div className="w-full sm:w-1/2 h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={revenueDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {revenueDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `$${value}`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full sm:w-1/2 mt-4 sm:mt-0 flex flex-col gap-3 justify-center pl-0 sm:pl-4">
                            {revenueDistributionData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm text-zinc-600">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-900">${item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
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
                    <div className="flex-1 min-h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topServicesData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f4f4f5" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} width={120} />
                                <Tooltip
                                    cursor={{ fill: '#f4f4f5' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="cantidad" name="Realizados" fill="#CFAE79" radius={[0, 4, 4, 0]} barSize={24}>
                                    {topServicesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#CFAE79' : '#e4e4e7'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Gráfico 3: Crecimiento de Clientes (Líneas) */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 mt-2">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-zinc-50 rounded-lg text-zinc-600"><LineChartIcon size={18} /></div>
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-800">Crecimiento de Clientes</h2>
                        <p className="text-xs text-zinc-500">Recurrentes vs Nuevos a lo largo del año</p>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={clientGrowthData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontWeight: 500 }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            <Line type="monotone" dataKey="recurrentes" name="Clientes Recurrentes" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="nuevos" name="Nuevos Clientes" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// Subcomponente KPI
function KpiCard({ title, value, subtitle, icon, trend, isPositive }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex items-start gap-4 hover:shadow-md transition-shadow duration-300">
            <div className="p-3 bg-zinc-50 rounded-xl">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-zinc-500 mt-0.5">{title}</p>
                <div className="flex items-end justify-between mt-1">
                    <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
                    <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                        <ArrowUpRight size={14} />
                        <span>{trend}</span>
                    </div>
                </div>
                <p className="text-xs text-zinc-400 mt-1.5">{subtitle}</p>
            </div>
        </div>
    );
}