import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  X, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Datos de prueba (Mocks)
const chartData = [
  { name: 'Ene', ingresos: 4000, gastos: 2400 },
  { name: 'Feb', ingresos: 3000, gastos: 1398 },
  { name: 'Mar', ingresos: 2000, gastos: 9800 },
  { name: 'Abr', ingresos: 2780, gastos: 3908 },
  { name: 'May', ingresos: 1890, gastos: 4800 },
  { name: 'Jun', ingresos: 2390, gastos: 3800 },
  { name: 'Jul', ingresos: 3490, gastos: 4300 },
];

const initialTransactions = [
  { id: 1, date: '2026-04-28', description: 'Cortes y Servicios (Día)', category: 'Servicios', type: 'Ingreso', amount: 450.00 },
  { id: 2, date: '2026-04-27', description: 'Compra de Insumos (Pomadas)', category: 'Inventario', type: 'Gasto', amount: 120.00 },
  { id: 3, date: '2026-04-26', description: 'Cortes y Servicios (Día)', category: 'Servicios', type: 'Ingreso', amount: 520.00 },
  { id: 4, date: '2026-04-25', description: 'Pago de Electricidad', category: 'Servicios Básicos', type: 'Gasto', amount: 85.00 },
  { id: 5, date: '2026-04-24', description: 'Venta de Productos (Caja)', category: 'Productos', type: 'Ingreso', amount: 95.00 },
  { id: 6, date: '2026-04-23', description: 'Alquiler Local (Abril)', category: 'Alquiler', type: 'Gasto', amount: 800.00 },
];

export default function Finanzas() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('Ingreso'); // 'Ingreso' o 'Gasto'

  // Cálculos de KPIs
  const totalIncome = transactions
    .filter(t => t.type === 'Ingreso')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'Gasto')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const netProfit = totalIncome - totalExpense;

  // Funciones de manejo
  const handleOpenModal = (type) => {
    setTransactionType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTransaction = {
      id: Date.now(),
      date: formData.get('date'),
      description: formData.get('description'),
      category: formData.get('category'),
      type: formData.get('type'),
      amount: parseFloat(formData.get('amount')),
    };

    // Agregar y ordenar por fecha (más reciente primero)
    const newTransactionsList = [newTransaction, ...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    setTransactions(newTransactionsList);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Finanzas</h1>
          <p className="text-zinc-500 mt-1">Control de ingresos, gastos y rentabilidad de la barbería.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => handleOpenModal('Gasto')}
            className="flex-1 sm:flex-none bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium rounded-lg text-sm px-4 py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <TrendingDown size={16} className="text-red-500" />
            <span>Registrar Gasto</span>
          </button>
          <button 
            onClick={() => handleOpenModal('Ingreso')}
            className="flex-1 sm:flex-none bg-[#CFAE79] hover:bg-[#b89965] text-white font-medium rounded-lg text-sm px-4 py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <TrendingUp size={16} />
            <span>Nuevo Ingreso</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <KpiCard 
          title="Ingresos Totales (Mes)" 
          value={`$${totalIncome.toFixed(2)}`} 
          icon={<TrendingUp size={22} className="text-emerald-500" />} 
          trend="+12.5%"
          isPositive={true}
        />
        <KpiCard 
          title="Gastos Totales (Mes)" 
          value={`$${totalExpense.toFixed(2)}`} 
          icon={<TrendingDown size={22} className="text-red-500" />} 
          trend="-2.4%"
          isPositive={true} // Es positivo que los gastos bajen
        />
        <KpiCard 
          title="Beneficio Neto" 
          value={`$${netProfit.toFixed(2)}`} 
          icon={<DollarSign size={22} className="text-[#CFAE79]" />} 
          trend="+18.2%"
          isPositive={true}
          highlight={true}
        />
      </div>

      {/* Gráfico y Analíticas */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-800">Flujo de Caja Anual</h2>
            <p className="text-sm text-zinc-500">Comparativa mensual de ingresos vs gastos</p>
          </div>
          <select className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2 outline-none">
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} dx={-10} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                cursor={{fill: '#f4f4f5', opacity: 0.4}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 500 }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historial de Transacciones */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden mt-2">
        <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-800">Historial de Movimientos</h2>
            <p className="text-sm text-zinc-500">Últimas transacciones registradas</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
              <Filter size={16} />
              Filtrar
            </button>
            <button className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
              <Download size={16} />
              Exportar
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Fecha</th>
                <th scope="col" className="px-6 py-4 font-medium">Descripción</th>
                <th scope="col" className="px-6 py-4 font-medium">Categoría</th>
                <th scope="col" className="px-6 py-4 font-medium">Tipo</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Calendar size={14} />
                        {t.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-zinc-900">{t.description}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`flex items-center gap-1 text-xs font-medium ${
                        t.type === 'Ingreso' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {t.type === 'Ingreso' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                      <span className={t.type === 'Ingreso' ? 'text-emerald-600' : 'text-zinc-900'}>
                        {t.type === 'Ingreso' ? '+' : '-'}${t.amount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                    No hay movimientos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Movimiento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`flex justify-between items-center p-5 border-b border-zinc-100 ${
              transactionType === 'Ingreso' ? 'bg-emerald-50/50' : 'bg-red-50/50'
            }`}>
              <div className="flex items-center gap-2">
                {transactionType === 'Ingreso' ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><TrendingUp size={16} /></div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><TrendingDown size={16} /></div>
                )}
                <h2 className="text-lg font-semibold text-zinc-800">Registrar {transactionType}</h2>
              </div>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveTransaction} className="p-5 space-y-4">
              <input type="hidden" name="type" value={transactionType} />
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Descripción</label>
                <input 
                  type="text" 
                  name="description" 
                  required
                  placeholder={transactionType === 'Ingreso' ? 'Ej. Venta de productos' : 'Ej. Pago de luz'}
                  className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Monto ($)</label>
                  <input 
                    type="number" 
                    name="amount" 
                    step="0.01"
                    required
                    placeholder="0.00"
                    min="0"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Fecha</label>
                  <input 
                    type="date" 
                    name="date" 
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Categoría</label>
                <select 
                  name="category"
                  className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                >
                  {transactionType === 'Ingreso' ? (
                    <>
                      <option value="Servicios">Servicios (Cortes, etc)</option>
                      <option value="Productos">Venta de Productos</option>
                      <option value="Propinas">Propinas</option>
                      <option value="Otros Ingresos">Otros Ingresos</option>
                    </>
                  ) : (
                    <>
                      <option value="Inventario">Inventario / Insumos</option>
                      <option value="Alquiler">Alquiler del Local</option>
                      <option value="Servicios Básicos">Servicios (Luz, Agua, Internet)</option>
                      <option value="Nómina">Nómina / Pago a Barberos</option>
                      <option value="Marketing">Marketing / Publicidad</option>
                      <option value="Otros Gastos">Otros Gastos</option>
                    </>
                  )}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${
                    transactionType === 'Ingreso' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Guardar {transactionType}
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
function KpiCard({ title, value, icon, trend, isPositive, highlight }) {
  return (
    <div className={`rounded-2xl p-5 shadow-sm border flex items-start gap-4 hover:shadow-md transition-shadow duration-300 ${
      highlight ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white border-zinc-100'
    }`}>
      <div className={`p-3 rounded-xl ${highlight ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium mt-0.5 ${highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>{title}</p>
        <div className="flex items-end justify-between mt-1">
          <p className={`text-2xl font-bold tracking-tight ${highlight ? 'text-white' : 'text-zinc-900'}`}>{value}</p>
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
            isPositive 
              ? (highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600') 
              : (highlight ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600')
          }`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{trend}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
