import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Scissors,
  Clock,
  DollarSign,
  Tag,
  Loader2,
  AlertCircle
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

// Transforma un servicio de la BD al formato que usa el componente
function mapServicioToUi(servicio) {
  return {
    id: servicio.id,
    name: servicio.nombre,
    description: servicio.descripcion || '',
    duration: servicio.duracion,       // número en minutos
    price: servicio.precio,            // número
    priceDisplay: `$${servicio.precio.toFixed(2)}`,
    durationDisplay: `${servicio.duracion} min`,
  };
}

export default function Servicios() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null); // null = Crear, object = Editar
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // --- FETCH: Obtener servicios desde la BD ---
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/servicios`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setServices(data.map(mapServicioToUi));
    } catch (err) {
      console.error('Error al obtener servicios:', err);
      setError('No se pudieron cargar los servicios. ¿Está el backend corriendo?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filtrado
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // KPIs
  const totalServices = services.length;
  const avgPrice = totalServices > 0
    ? services.reduce((acc, curr) => acc + curr.price, 0) / totalServices
    : 0;

  // Funciones de manejo de modales
  const handleOpenCreateModal = () => {
    setCurrentService(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  // --- POST / PUT: Crear o editar servicio en la BD ---
  const handleSaveService = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      nombre: formData.get('name'),
      descripcion: formData.get('description') || null,
      precio: parseFloat(formData.get('price')),
      duracion: parseInt(formData.get('duration')),
    };

    try {
      let response;
      if (currentService) {
        // Editar
        response = await fetch(`${API_BASE}/admin/servicios/${currentService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Crear
        response = await fetch(`${API_BASE}/admin/servicios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error('Error al guardar');

      await fetchServices();
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar servicio:', err);
      alert('Error al guardar el servicio. Intenta de nuevo.');
    }
  };

  // --- DELETE: Eliminar servicio de la BD ---
  const handleDeleteService = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/servicios/${serviceToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar');
      }

      await fetchServices();
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Error al eliminar servicio:', err);
      alert(err.message || 'Error al eliminar el servicio. Puede tener reservas asociadas.');
      handleCloseDeleteModal();
    }
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <Loader2 size={36} className="text-[#CFAE79] animate-spin" />
        <p className="text-zinc-500 text-sm">Cargando servicios desde la base de datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <AlertCircle size={36} className="text-red-400" />
        <p className="text-zinc-700 font-medium">{error}</p>
        <button
          onClick={fetchServices}
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
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Servicios</h1>
          <p className="text-zinc-500 mt-1">Configura el menú de servicios y precios de tu barbería.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#CFAE79] hover:bg-[#b89965] text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <KpiCard
          title="Total de Servicios"
          value={totalServices.toString()}
          icon={<Scissors size={22} className="text-blue-500" />}
        />
        <KpiCard
          title="Precio Promedio"
          value={`$${avgPrice.toFixed(2)}`}
          icon={<DollarSign size={22} className="text-emerald-500" />}
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
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] block w-full pl-10 p-2.5 outline-none transition-all"
          />
        </div>
      </div>

      {/* Tabla de Servicios */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Nombre del Servicio</th>
                <th scope="col" className="px-6 py-4 font-medium">Descripción</th>
                <th scope="col" className="px-6 py-4 font-medium">Duración</th>
                <th scope="col" className="px-6 py-4 font-medium">Precio</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-zinc-900">{service.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-zinc-500 text-sm">{service.description || '—'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Clock size={14} />
                        {service.durationDisplay}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-zinc-800">
                      {service.priceDisplay}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditModal(service)}
                          className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(service)}
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
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                    {services.length === 0 ? 'No hay servicios registrados en la base de datos.' : 'No se encontraron servicios que coincidan con la búsqueda.'}
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
                {currentService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveService} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre del Servicio</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={currentService?.name || ''}
                  required
                  placeholder="Ej. Corte Clásico"
                  className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Descripción</label>
                <input
                  type="text"
                  name="description"
                  defaultValue={currentService?.description || ''}
                  placeholder="Ej. Corte clásico con tijera y máquina"
                  className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    name="duration"
                    defaultValue={currentService?.duration || ''}
                    required
                    placeholder="45"
                    min="1"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Precio ($)</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    defaultValue={currentService?.price || ''}
                    required
                    placeholder="25.00"
                    min="0"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                  />
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
                  {currentService ? 'Guardar Cambios' : 'Crear Servicio'}
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
            <h2 className="text-xl font-bold text-zinc-900 mb-2">¿Eliminar Servicio?</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Estás a punto de eliminar <span className="font-semibold text-zinc-800">{serviceToDelete?.name}</span> del menú. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={handleCloseDeleteModal}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteService}
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
function KpiCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-300">
      <div className="p-3 bg-zinc-50 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
        <h3 className="text-zinc-600 text-sm font-medium mt-0.5">{title}</h3>
      </div>
    </div>
  );
}
