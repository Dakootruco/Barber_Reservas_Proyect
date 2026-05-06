import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Users,
  UserPlus,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  Calendar
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

// Transforma un cliente de la BD al formato que usa el componente
function mapClienteToUi(cliente) {
  return {
    id: cliente.id,
    name: cliente.nombre,
    phone: cliente.telefono || 'Sin teléfono',
    email: cliente.email,
    avatar: (cliente.nombre || 'NN').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    registeredAt: new Date(cliente.createdAt).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric'
    }),
  };
}

export default function Clientes() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null); // null = Crear, object = Editar
  const [clientToDelete, setClientToDelete] = useState(null);

  // --- FETCH: Obtener clientes desde la BD ---
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/cliente`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setClients(data.map(mapClienteToUi));
    } catch (err) {
      console.error('Error al obtener clientes:', err);
      setError('No se pudieron cargar los clientes. ¿Está el backend corriendo?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filtrado de clientes
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  // Funciones de manejo de modales
  const handleOpenCreateModal = () => {
    setCurrentClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client) => {
    setCurrentClient(client);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentClient(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setClientToDelete(null);
  };

  // --- POST / PUT: Crear o editar cliente en la BD ---
  const handleSaveClient = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      let response;
      if (currentClient) {
        // Editar — PUT /api/cliente/:id
        response = await fetch(`${API_BASE}/cliente/${currentClient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.get('name'),
            email: formData.get('email'),
            telefono: formData.get('phone'),
          }),
        });
      } else {
        // Crear — POST /api/cliente/register
        const password = formData.get('password');
        response = await fetch(`${API_BASE}/cliente/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.get('name'),
            email: formData.get('email'),
            telefono: formData.get('phone'),
            password: password,
          }),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al guardar');
      }

      await fetchClients();
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      alert(err.message || 'Error al guardar el cliente.');
    }
  };

  // --- DELETE: Eliminar cliente de la BD ---
  const handleDeleteClient = async () => {
    try {
      const response = await fetch(`${API_BASE}/cliente/${clientToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar');
      }

      await fetchClients();
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
      alert(err.message || 'Error al eliminar el cliente. Puede tener reservas asociadas.');
      handleCloseDeleteModal();
    }
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <Loader2 size={36} className="text-[#CFAE79] animate-spin" />
        <p className="text-zinc-500 text-sm">Cargando clientes desde la base de datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <AlertCircle size={36} className="text-red-400" />
        <p className="text-zinc-700 font-medium">{error}</p>
        <button
          onClick={fetchClients}
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
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Clientes</h1>
          <p className="text-zinc-500 mt-1">Gestiona la base de datos de tus clientes.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#CFAE79] hover:bg-[#b89965] text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <KpiCard
          title="Total de Clientes"
          value={clients.length.toString()}
          icon={<Users size={22} className="text-blue-500" />}
        />
        <KpiCard
          title="Registrados Este Mes"
          value={clients.filter(c => {
            const now = new Date();
            const registered = new Date(c.registeredAt);
            return registered.getMonth() === now.getMonth() && registered.getFullYear() === now.getFullYear();
          }).length.toString()}
          icon={<UserPlus size={22} className="text-emerald-500" />}
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
            placeholder="Buscar por nombre, correo o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] block w-full pl-10 p-2.5 outline-none transition-all"
          />
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Cliente</th>
                <th scope="col" className="px-6 py-4 font-medium">Contacto</th>
                <th scope="col" className="px-6 py-4 font-medium">Registrado</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-semibold text-sm border border-zinc-200">
                          {client.avatar}
                        </div>
                        <span className="font-medium text-zinc-900">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-zinc-500">
                          <Phone size={12} />
                          <span className="text-xs">{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-500">
                          <Mail size={12} />
                          <span className="text-xs">{client.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Calendar size={12} />
                        <span className="text-xs">{client.registeredAt}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditModal(client)}
                          className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(client)}
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
                  <td colSpan="4" className="px-6 py-12 text-center text-zinc-500">
                    {clients.length === 0 ? 'No hay clientes registrados en la base de datos.' : 'No se encontraron clientes que coincidan con la búsqueda.'}
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
                {currentClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveClient} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={currentClient?.name || ''}
                  required
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={currentClient?.email || ''}
                  required
                  placeholder="cliente@email.com"
                  className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={currentClient?.phone === 'Sin teléfono' ? '' : (currentClient?.phone || '')}
                  placeholder="+1 234-567-8900"
                  className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                />
              </div>
              {/* Solo mostrar campo de contraseña al crear */}
              {!currentClient && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Contraseña para el cliente"
                    minLength={6}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                  />
                  <p className="text-xs text-zinc-400 mt-1">Mínimo 6 caracteres. El cliente la usará para iniciar sesión.</p>
                </div>
              )}
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
                  {currentClient ? 'Guardar Cambios' : 'Crear Cliente'}
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
            <h2 className="text-xl font-bold text-zinc-900 mb-2">¿Eliminar Cliente?</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Estás a punto de eliminar a <span className="font-semibold text-zinc-800">{clientToDelete?.name}</span>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={handleCloseDeleteModal}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteClient}
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
        <h3 className="text-zinc-500 text-sm font-medium mt-0.5">{title}</h3>
      </div>
    </div>
  );
}
