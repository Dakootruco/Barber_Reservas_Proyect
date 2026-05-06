import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  X,
  Calendar,
  Trash2,
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
  Legend
} from 'recharts';

const API_BASE = 'http://localhost:3000/api';

function mapTransaccionToUi(t) {
  return {
    id: t.id,
    date: new Date(t.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    rawDate: t.fecha,
    description: t.descripcion,
    category: t.categoria,
    type: t.tipo === 'INGRESO' ? 'Ingreso' : 'Gasto',
    dbType: t.tipo,
    amount: t.monto,
  };
}

export default function Finanzas() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('Ingreso');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/transacciones`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setTransactions(data.map(mapTransaccionToUi));
    } catch (err) {
      console.error('Error al obtener transacciones:', err);
      setError('No se pudieron cargar las transacciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // KPIs
  const totalIncome = transactions.filter(t => t.type === 'Ingreso').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Gasto').reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalIncome - totalExpense;

  // Chart: agrupar por mes
  const monthlyData = {};
  transactions.forEach(t => {
    const fecha = new Date(t.rawDate);
    const mesKey = fecha.toLocaleDateString('es-ES', { month: 'short' });
    if (!monthlyData[mesKey]) monthlyData[mesKey] = { name: mesKey, ingresos: 0, gastos: 0 };
    if (t.type === 'Ingreso') monthlyData[mesKey].ingresos += t.amount;
    else monthlyData[mesKey].gastos += t.amount;
  });
  const chartData = Object.values(monthlyData);

  const handleOpenModal = (type) => { setTransactionType(type); setIsModalOpen(true); };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      fecha: formData.get('date'),
      descripcion: formData.get('description'),
      categoria: formData.get('category'),
      tipo: formData.get('type') === 'Ingreso' ? 'INGRESO' : 'GASTO',
      monto: parseFloat(formData.get('amount')),
    };

    try {
      const response = await fetch(`${API_BASE}/admin/transacciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Error al guardar');
      await fetchTransactions();
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar transacción:', err);
      alert('Error al guardar la transacción.');
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/transacciones/${transactionToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar');
      await fetchTransactions();
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
    } catch (err) {
      console.error('Error al eliminar transacción:', err);
      alert('Error al eliminar la transacción.');
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <Loader2 size={36} className="text-[#CFAE79] animate-spin" />
        <p className="text-zinc-500 text-sm">Cargando transacciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <AlertCircle size={36} className="text-red-400" />
        <p className="text-zinc-700 font-medium">{error}</p>
        <button onClick={fetchTransactions} className="px-4 py-2 text-sm font-medium text-white bg-[#CFAE79] hover:bg-[#b89965] rounded-lg transition-colors">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Finanzas</h1>
          <p className="text-zinc-500 mt-1">Control de ingresos, gastos y rentabilidad de la barbería.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => handleOpenModal('Gasto')} className="flex-1 sm:flex-none bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium rounded-lg text-sm px-4 py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2">
            <TrendingDown size={16} />
            <span>Gasto</span>
          </button>
          <button onClick={() => handleOpenModal('Ingreso')} className="flex-1 sm:flex-none bg-[#CFAE79] hover:bg-[#b89965] text-white font-medium rounded-lg text-sm px-4 py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2">
            <Plus size={16} />
            <span>Ingreso</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <KpiCard title="Ingresos Totales" value={`$${totalIncome.toFixed(2)}`} icon={<TrendingUp size={22} className="text-emerald-500" />} />
        <KpiCard title="Gastos Totales" value={`$${totalExpense.toFixed(2)}`} icon={<TrendingDown size={22} className="text-red-500" />} />
        <KpiCard title="Ganancia Neta" value={`$${netProfit.toFixed(2)}`} isHighlight={netProfit >= 0} icon={<DollarSign size={22} className={netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'} />} />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
          <h2 className="text-lg font-semibold text-zinc-800 mb-4">Ingresos vs Gastos por Mes</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="ingresos" name="Ingresos" fill="#CFAE79" radius={[6, 6, 0, 0]} />
                <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-lg font-semibold text-zinc-800">Historial de Transacciones</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Descripción</th>
                <th className="px-6 py-4 font-medium">Categoría</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium text-right">Monto</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {transactions.length > 0 ? transactions.map(t => (
                <tr key={t.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-zinc-500"><Calendar size={14} /><span>{t.date}</span></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-900">{t.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-medium">{t.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${t.type === 'Ingreso' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{t.type}</span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${t.type === 'Ingreso' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.type === 'Ingreso' ? '+' : '-'}${t.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => { setTransactionToDelete(t); setIsDeleteModalOpen(true); }}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100" title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-zinc-500">No hay transacciones registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear Transacción */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-zinc-100">
              <h2 className="text-lg font-semibold text-zinc-800">Nuevo {transactionType}</h2>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveTransaction} className="p-5 space-y-4">
              <input type="hidden" name="type" value={transactionType} />
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Descripción</label>
                <input type="text" name="description" required placeholder="Ej. Cortes del día" className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Monto ($)</label>
                  <input type="number" name="amount" step="0.01" min="0.01" required placeholder="450.00" className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Fecha</label>
                  <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Categoría</label>
                <select name="category" className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none">
                  <option value="Servicios">Servicios</option>
                  <option value="Productos">Productos</option>
                  <option value="Inventario">Inventario</option>
                  <option value="Alquiler">Alquiler</option>
                  <option value="Servicios Básicos">Servicios Básicos</option>
                  <option value="Nómina">Nómina</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className={`px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${transactionType === 'Ingreso' ? 'bg-[#CFAE79] hover:bg-[#b89965]' : 'bg-red-500 hover:bg-red-600'}`}>
                  Registrar {transactionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} /></div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">¿Eliminar Transacción?</h2>
            <p className="text-sm text-zinc-500 mb-6">Estás a punto de eliminar <span className="font-semibold text-zinc-800">{transactionToDelete?.description}</span>.</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleDeleteTransaction} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm">Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ title, value, icon, isHighlight }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-300">
      <div className="p-3 bg-zinc-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
        <h3 className="text-zinc-600 text-sm font-medium mt-0.5">{title}</h3>
      </div>
    </div>
  );
}
