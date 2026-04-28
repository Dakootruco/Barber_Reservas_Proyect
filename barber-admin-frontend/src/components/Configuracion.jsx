import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  Bell, 
  Shield, 
  Image as ImageIcon,
  Save
} from 'lucide-react';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8 relative max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Configuración</h1>
        <p className="text-zinc-500 mt-1">Administra las preferencias y detalles de tu barbería.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-2">
        
        {/* Sidebar de Configuración */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-2 flex flex-row md:flex-col gap-1 overflow-x-auto">
            <TabButton 
              active={activeTab === 'general'} 
              onClick={() => setActiveTab('general')} 
              icon={<Store size={18} />} 
              label="Negocio" 
            />
            <TabButton 
              active={activeTab === 'apariencia'} 
              onClick={() => setActiveTab('apariencia')} 
              icon={<ImageIcon size={18} />} 
              label="Apariencia" 
            />
            <TabButton 
              active={activeTab === 'notificaciones'} 
              onClick={() => setActiveTab('notificaciones')} 
              icon={<Bell size={18} />} 
              label="Notificaciones" 
            />
            <TabButton 
              active={activeTab === 'seguridad'} 
              onClick={() => setActiveTab('seguridad')} 
              icon={<Shield size={18} />} 
              label="Seguridad" 
            />
          </div>
        </div>

        {/* Área de Contenido */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 sm:p-8">
          
          {activeTab === 'general' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-100">
                <div className="p-2.5 bg-[#CFAE79]/10 text-[#CFAE79] rounded-xl"><Store size={20} /></div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-800">Detalles del Negocio</h2>
                  <p className="text-sm text-zinc-500">Información pública de tu barbería</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Nombre de la Barbería</label>
                    <input 
                      type="text" 
                      defaultValue="DakooBarberShop"
                      className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-3 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Teléfono de Contacto</label>
                    <input 
                      type="text" 
                      defaultValue="+1 (555) 123-4567"
                      className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-3 outline-none transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Dirección Física</label>
                    <input 
                      type="text" 
                      defaultValue="123 Barber Street, Suite 100"
                      className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-3 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Moneda Principal</label>
                    <select className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-lg focus:ring-[#CFAE79] focus:border-[#CFAE79] p-3 outline-none transition-colors">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>MXN ($)</option>
                      <option>COP ($)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button className="bg-[#CFAE79] hover:bg-[#b89965] text-white font-medium rounded-lg text-sm px-6 py-2.5 transition-colors shadow-sm flex items-center gap-2">
                    <Save size={16} />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab !== 'general' && (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-400 mb-4">
                <Settings size={28} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-800">Sección en Construcción</h3>
              <p className="text-sm text-zinc-500 max-w-sm mt-2">
                Esta área está lista para que agregues las configuraciones futuras cuando lo necesites.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
        active 
          ? 'bg-zinc-900 text-white shadow-md' 
          : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
