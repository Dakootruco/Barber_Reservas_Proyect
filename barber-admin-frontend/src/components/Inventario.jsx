import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Layers
} from 'lucide-react';

// Datos de prueba iniciales
const initialCategories = ['Pomadas', 'Cremas', 'Geles', 'Navajas', 'Cuidado Facial'];

const initialProducts = [
  { id: 1, name: 'Pomada Mate Suavecito', category: 'Pomadas', price: '$15.00', stock: 12, status: 'Disponible' },
  { id: 2, name: 'Crema para Afeitar Proraso', category: 'Cremas', price: '$22.00', stock: 5, status: 'Disponible' },
  { id: 3, name: 'Gel Fijación Extra', category: 'Geles', price: '$10.00', stock: 0, status: 'Agotado' },
  { id: 4, name: 'Navajas Dorco (Caja)', category: 'Navajas', price: '$8.00', stock: 3, status: 'Bajo Stock' },
  { id: 5, name: 'Aftershave Loción', category: 'Cuidado Facial', price: '$18.00', stock: 8, status: 'Disponible' },
];

export default function Inventario() {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('Todos');
  
  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Estado para la creación de nueva categoría dentro del modal
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Filtrado por pestaña y búsqueda
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategoryTab === 'Todos' || product.category === activeCategoryTab;
    return matchesSearch && matchesCategory;
  });

  // KPIs
  const totalProducts = products.length;
  const totalValue = products.reduce((acc, curr) => acc + (parseFloat(curr.price.replace('$', '')) * curr.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= 5 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  // Actualizar estado basado en stock (función auxiliar)
  const determineStatus = (stock) => {
    if (stock === 0) return 'Agotado';
    if (stock <= 5) return 'Bajo Stock';
    return 'Disponible';
  };

  // Funciones de manejo
  const handleOpenCreateModal = () => {
    setCurrentProduct(null);
    setIsAddingCategory(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setIsAddingCategory(false);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setIsAddingCategory(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== '' && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
    }
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const stockVal = parseInt(formData.get('stock'), 10) || 0;
    
    const newProductData = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: '$' + parseFloat(formData.get('price')).toFixed(2),
      stock: stockVal,
      status: determineStatus(stockVal),
    };

    if (currentProduct) {
      setProducts(products.map(p => p.id === currentProduct.id ? { ...p, ...newProductData } : p));
    } else {
      setProducts([{ id: Date.now(), ...newProductData }, ...products]);
    }
    handleCloseModal();
  };

  const handleDeleteProduct = () => {
    setProducts(products.filter(p => p.id !== productToDelete.id));
    handleCloseDeleteModal();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Inventario</h1>
          <p className="text-zinc-500 mt-1">Gestiona tus productos, cremas, geles y niveles de stock.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-[#CFAE79] hover:bg-[#b89965] text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <KpiCard 
          title="Total Productos" 
          value={totalProducts.toString()} 
          icon={<Package size={22} className="text-blue-500" />} 
        />
        <KpiCard 
          title="Valor del Inventario" 
          value={`$${totalValue.toFixed(2)}`} 
          icon={<DollarSign size={22} className="text-emerald-500" />} 
        />
        <KpiCard 
          title="Alertas de Stock" 
          value={(lowStockCount + outOfStockCount).toString()} 
          subtitle={`${outOfStockCount} Agotados, ${lowStockCount} Bajos`}
          icon={<AlertTriangle size={22} className="text-amber-500" />} 
        />
      </div>

      {/* Categorías (Pestañas) */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveCategoryTab('Todos')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategoryTab === 'Todos' 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            Todos
          </button>
          {categories.map(category => (
            <div
              key={category}
              className={`flex items-center gap-1 pl-4 pr-2 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                activeCategoryTab === category 
                  ? 'bg-[#CFAE79] text-white border-[#CFAE79] shadow-sm' 
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
              onClick={() => setActiveCategoryTab(category)}
            >
              <span>{category}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const confirmDelete = window.confirm(`¿Estás seguro de eliminar la categoría "${category}"? Los productos no se borrarán, pero perderán esta pestaña.`);
                  if (confirmDelete) {
                    setCategories(categories.filter(c => c !== category));
                    if (activeCategoryTab === category) setActiveCategoryTab('Todos');
                  }
                }}
                className={`ml-1 rounded-full p-0.5 transition-colors ${
                  activeCategoryTab === category ? 'hover:bg-white/20 text-white' : 'hover:bg-zinc-200 text-zinc-400 hover:text-red-500'
                }`}
                title="Eliminar categoría"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar & Search */}
      <div className="bg-white p-4 rounded-t-2xl shadow-sm border border-zinc-100 border-b-0 flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder={`Buscar en ${activeCategoryTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] block w-full pl-10 p-2.5 outline-none transition-all"
          />
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Producto</th>
                <th scope="col" className="px-6 py-4 font-medium">Categoría</th>
                <th scope="col" className="px-6 py-4 font-medium">Precio</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Stock</th>
                <th scope="col" className="px-6 py-4 font-medium">Estado</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                          <Package size={18} />
                        </div>
                        <span className="font-medium text-zinc-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Layers size={14} />
                        <span>{product.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-zinc-800">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`font-bold ${product.stock === 0 ? 'text-red-500' : 'text-zinc-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        product.status === 'Disponible' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        product.status === 'Bajo Stock' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(product)}
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
                  <td colSpan="6" className="px-6 py-12 text-center text-zinc-500">
                    No se encontraron productos en esta categoría o búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar Producto y Categoría */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-zinc-100">
              <h2 className="text-lg font-semibold text-zinc-800">
                {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre del Producto</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={currentProduct?.name || ''} 
                  required
                  placeholder="Ej. Cera Moldeadora"
                  className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                />
              </div>

              {/* Sección de Categoría con opción de añadir nueva */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-zinc-700">Categoría</label>
                  {!isAddingCategory && (
                    <button 
                      type="button"
                      onClick={() => setIsAddingCategory(true)}
                      className="text-xs text-[#CFAE79] hover:text-[#b89965] font-medium"
                    >
                      + Nueva Categoría
                    </button>
                  )}
                </div>
                
                {isAddingCategory ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Nombre de la nueva categoría..."
                      className="flex-1 bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                      autoFocus
                    />
                    <button 
                      type="button"
                      onClick={handleAddCategory}
                      className="px-3 bg-zinc-800 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
                    >
                      Añadir
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setIsAddingCategory(false); setNewCategoryName(''); }}
                      className="px-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <select 
                    name="category"
                    defaultValue={currentProduct?.category || categories[0]}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Precio de Venta ($)</label>
                  <input 
                    type="number" 
                    name="price" 
                    step="0.01"
                    defaultValue={currentProduct ? parseFloat(currentProduct.price.replace('$', '')) : ''} 
                    required
                    placeholder="15.00"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Stock (Cantidad)</label>
                  <input 
                    type="number" 
                    name="stock" 
                    defaultValue={currentProduct?.stock !== undefined ? currentProduct.stock : ''} 
                    required
                    placeholder="10"
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
                  {currentProduct ? 'Guardar Cambios' : 'Crear Producto'}
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
            <h2 className="text-xl font-bold text-zinc-900 mb-2">¿Eliminar Producto?</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Estás a punto de eliminar <span className="font-semibold text-zinc-800">{productToDelete?.name}</span> del inventario. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={handleCloseDeleteModal}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteProduct}
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
