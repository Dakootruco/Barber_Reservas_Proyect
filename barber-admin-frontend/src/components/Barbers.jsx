import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Users, 
  Star, 
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Coffee
} from 'lucide-react';

// Datos de prueba iniciales (Mocks)
const initialBarbers = [
  { id: 1, name: 'David García', phone: '+1 234-567-0001', status: 'Activo', appointmentsToday: 6, rating: 4.9, earned: '$1,250', avatar: 'DG' },
  { id: 2, name: 'Andrés Pérez', phone: '+1 234-567-0002', status: 'Activo', appointmentsToday: 5, rating: 4.8, earned: '$1,100', avatar: 'AP' },
  { id: 3, name: 'Roberto Sánchez', phone: '+1 234-567-0003', status: 'Descanso', appointmentsToday: 0, rating: 4.7, earned: '$950', avatar: 'RS' },
  { id: 4, name: 'Miguel Torres', phone: '+1 234-567-0004', status: 'Vacaciones', appointmentsToday: 0, rating: 4.5, earned: '$0', avatar: 'MT' },
];

export default function Barbers() {
  const [barbers, setBarbers] = useState(initialBarbers);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBarber, setCurrentBarber] = useState(null); // null = Crear, object = Editar
  const [barberToDelete, setBarberToDelete] = useState(null);

  // Filtrado de barberos
  const filteredBarbers = barbers.filter(barber => 
    barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barber.phone.includes(searchTerm)
  );

  // Cálculos de KPIs
  const totalBarbers = barbers.length;
  const activeBarbers = barbers.filter(b => b.status === 'Activo').length;
  const bestBarber = [...barbers].sort((a, b) => b.rating - a.rating)[0];

  // Funciones de manejo
  const handleOpenCreateModal = () => {
    setCurrentBarber(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (barber) => {
    setCurrentBarber(barber);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (barber) => {
    setBarberToDelete(barber);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBarber(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBarberToDelete(null);
  };

  const handleSaveBarber = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBarberData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      status: formData.get('status') || 'Activo',
      appointmentsToday: currentBarber ? currentBarber.appointmentsToday : 0,
      rating: currentBarber ? currentBarber.rating : 5.0,
      earned: currentBarber ? currentBarber.earned : '$0.00',
      avatar: formData.get('name').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    };

    if (currentBarber) {
      setBarbers(barbers.map(b => b.id === currentBarber.id ? { ...b, ...newBarberData } : b));
    } else {
      setBarbers([{ id: Date.now(), ...newBarberData }, ...barbers]);
    }
    handleCloseModal();
  };

  const handleDeleteBarber = () => {
    setBarbers(barbers.filter(b => b.id !== barberToDelete.id));
    handleCloseDeleteModal();
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Activo': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'Descanso': return <Coffee size={14} className="text-amber-500" />;
      case 'Vacaciones': return <Calendar size={14} className="text-blue-500" />;
      default: return <XCircle size={14} className="text-zinc-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Barberos</h1>
          <p className="text-zinc-500 mt-1">Gestiona a tu equipo de profesionales.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-[#CFAE79] hover:bg-[#b89965] text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Nuevo Barbero</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <KpiCard 
          title="Total en Equipo" 
          value={`${activeBarbers} / ${totalBarbers}`} 
          subtitle="Trabajando hoy"
          icon={<Users size={22} className="text-blue-500" />} 
        />
        <KpiCard 
          title="Barbero Destacado" 
          value={bestBarber ? bestBarber.name : '-'} 
          subtitle={bestBarber ? `Calificación: ${bestBarber.rating}` : ''}
          icon={<Star size={22} className="text-yellow-400" />} 
        />
        <KpiCard 
          title="Citas Asignadas Hoy" 
          value={barbers.reduce((acc, curr) => acc + curr.appointmentsToday, 0).toString()} 
          subtitle="En todo el equipo"
          icon={<Calendar size={22} className="text-emerald-500" />} 
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
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] block w-full pl-10 p-2.5 outline-none transition-all"
          />
        </div>
      </div>

      {/* Tabla de Barberos */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Barbero</th>
                <th scope="col" className="px-6 py-4 font-medium">Teléfono</th>
                <th scope="col" className="px-6 py-4 font-medium">Estado</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Citas Hoy</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Calificación</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Generado (Mes)</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredBarbers.length > 0 ? (
                filteredBarbers.map((barber) => (
                  <tr key={barber.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-semibold text-sm border border-zinc-200 shadow-sm">
                            {barber.avatar}
                          </div>
                          {barber.status === 'Activo' && (
                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <span className="font-medium text-zinc-900">{barber.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-zinc-500">{barber.phone}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(barber.status)}
                        <span className={`text-xs font-medium ${
                          barber.status === 'Activo' ? 'text-emerald-600' :
                          barber.status === 'Descanso' ? 'text-amber-600' : 'text-blue-600'
                        }`}>
                          {barber.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 font-semibold text-zinc-700">
                        {barber.appointmentsToday}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="font-semibold text-zinc-800">{barber.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-zinc-800">
                      {barber.earned}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEditModal(barber)}
                          className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(barber)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                    No se encontraron barberos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-zinc-100">
              <h2 className="text-lg font-semibold text-zinc-800">
                {currentBarber ? 'Editar Barbero' : 'Nuevo Barbero'}
              </h2>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveBarber} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={currentBarber?.name || ''} 
                  required
                  className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Teléfono</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    defaultValue={currentBarber?.phone || ''} 
                    required
                    className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Estado</label>
                  <select 
                    name="status"
                    defaultValue={currentBarber?.status || 'Activo'}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Descanso">Descanso</option>
                    <option value="Vacaciones">Vacaciones</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
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
                  className="px-4 py-2.5 text-sm font-medium text-white bg-[#CFAE79] hover:bg-[#b89965] rounded-lg transition-colors shadow-sm"
                >
                  {currentBarber ? 'Guardar Cambios' : 'Agregar Barbero'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseDeleteModal}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">¿Eliminar Barbero?</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Estás a punto de eliminar a <span className="font-semibold text-zinc-800">{barberToDelete?.name}</span>. Perderás su historial de rendimiento.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={handleCloseDeleteModal}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteBarber}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponente KPI
function KpiCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-300">
      <div className="p-3 bg-zinc-50 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
        <h3 className="text-zinc-600 text-sm font-medium mt-0.5">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
