import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Package,
  AlertTriangle,
  DollarSign,
  Layers,
  Loader2,
  AlertCircle
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

function mapProductoToUi(producto) {
  const status = producto.stock === 0 ? 'Agotado' : producto.stock <= 5 ? 'Bajo Stock' : 'Disponible';
  return {
    id: producto.id,
    name: producto.nombre,
    category: producto.categoria,
    price: producto.precio,
    priceDisplay: `$${producto.precio.toFixed(2)}`,
    stock: producto.stock,
    status,
  };
}

const statusColors = {
  'Disponible': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Bajo Stock': 'bg-amber-50 text-amber-600 border-amber-100',
  'Agotado': 'bg-red-50 text-red-600 border-red-100',
};

export default function Inventario() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/productos`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setProducts(data.map(mapProductoToUi));
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setError('No se pudieron cargar los productos. ¿Está el backend corriendo?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // KPIs
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.status === 'Bajo Stock' || p.status === 'Agotado').length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  const handleOpenCreateModal = () => { setCurrentProduct(null); setIsModalOpen(true); };
  const handleOpenEditModal = (product) => { setCurrentProduct(product); setIsModalOpen(true); };
  const handleOpenDeleteModal = (product) => { setProductToDelete(product); setIsDeleteModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setCurrentProduct(null); };
  const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setProductToDelete(null); };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      nombre: formData.get('name'),
      categoria: formData.get('category'),
      precio: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
    };

    try {
      let response;
      if (currentProduct) {
        response = await fetch(`${API_BASE}/admin/productos/${currentProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${API_BASE}/admin/productos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) throw new Error('Error al guardar');
      await fetchProducts();
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Error al guardar el producto.');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/productos/${productToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar');
      await fetchProducts();
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Error al eliminar el producto.');
      handleCloseDeleteModal();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <Loader2 size={36} className="text-[#CFAE79] animate-spin" />
        <p className="text-zinc-500 text-sm">Cargando inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
        <AlertCircle size={36} className="text-red-400" />
        <p className="text-zinc-700 font-medium">{error}</p>
        <button onClick={fetchProducts} className="px-4 py-2 text-sm font-medium text-white bg-[#CFAE79] hover:bg-[#b89965] rounded-lg transition-colors">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Inventario</h1>
          <p className="text-zinc-500 mt-1">Gestiona los productos y stock de tu barbería.</p>
        </div>
        <button onClick={handleOpenCreateModal} className="bg-[#CFAE79] hover:bg-[#b89965] text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors shadow-sm flex items-center gap-2">
          <Plus size={18} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <KpiCard title="Total Productos" value={totalProducts.toString()} icon={<Package size={22} className="text-blue-500" />} />
        <KpiCard title="Stock Bajo / Agotado" value={lowStock.toString()} icon={<AlertTriangle size={22} className="text-amber-500" />} />
        <KpiCard title="Valor del Inventario" value={`$${totalValue.toFixed(2)}`} icon={<DollarSign size={22} className="text-emerald-500" />} />
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-t-2xl shadow-sm border border-zinc-100 border-b-0">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-zinc-400" /></div>
          <input type="text" placeholder="Buscar por nombre o categoría..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] block w-full pl-10 p-2.5 outline-none transition-all" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4 font-medium">Producto</th>
                <th className="px-6 py-4 font-medium">Categoría</th>
                <th className="px-6 py-4 font-medium">Precio</th>
                <th className="px-6 py-4 font-medium text-center">Stock</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.length > 0 ? filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-medium">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-zinc-800">{product.priceDisplay}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 font-semibold text-zinc-700">{product.stock}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[product.status] || ''}`}>{product.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEditModal(product)} className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Editar"><Edit2 size={16} /></button>
                      <button onClick={() => handleOpenDeleteModal(product)} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-zinc-500">{products.length === 0 ? 'No hay productos en la base de datos.' : 'Sin resultados.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-zinc-100">
              <h2 className="text-lg font-semibold text-zinc-800">{currentProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre</label>
                <input type="text" name="name" defaultValue={currentProduct?.name || ''} required placeholder="Ej. Pomada Mate" className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Categoría</label>
                <select name="category" defaultValue={currentProduct?.category || 'Pomadas'} className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none">
                  <option value="Pomadas">Pomadas</option>
                  <option value="Cremas">Cremas</option>
                  <option value="Geles">Geles</option>
                  <option value="Navajas">Navajas</option>
                  <option value="Cuidado Facial">Cuidado Facial</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Precio ($)</label>
                  <input type="number" name="price" step="0.01" min="0" defaultValue={currentProduct?.price || ''} required placeholder="15.00" className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Stock</label>
                  <input type="number" name="stock" min="0" defaultValue={currentProduct?.stock ?? 0} required placeholder="12" className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2.5 text-sm font-medium text-white bg-[#CFAE79] hover:bg-[#b89965] rounded-lg transition-colors shadow-sm">{currentProduct ? 'Guardar Cambios' : 'Crear Producto'}</button>
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
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} /></div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">¿Eliminar Producto?</h2>
            <p className="text-sm text-zinc-500 mb-6">Estás a punto de eliminar <span className="font-semibold text-zinc-800">{productToDelete?.name}</span>.</p>
            <div className="flex gap-3 w-full">
              <button onClick={handleCloseDeleteModal} className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleDeleteProduct} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm">Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ title, value, icon }) {
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
