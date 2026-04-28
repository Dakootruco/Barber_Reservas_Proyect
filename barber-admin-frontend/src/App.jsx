import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './components/Dashboard';
import Clientes from './components/Clientes';
import Barbers from './components/Barbers';
import Citas from './components/Citas';
import Servicios from './components/Servicios';
import Inventario from './components/Inventario';
import Finanzas from './components/Finanzas';
import ReportesAnaliticas from './components/Reportes_Analiticas';
import Configuracion from './components/Configuracion';
import './App.css';

// Placeholder Component for unbuilt pages
const Placeholder = ({ title }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col justify-center items-center text-center">
    <h1 className="text-3xl font-bold text-zinc-800 mb-4">{title}</h1>
    <p className="text-gray-500 max-w-md">
      Esta es la vista de <span className="font-semibold">{title}</span>. Aquí irá el contenido correspondiente una vez que se implemente la vista.
    </p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="citas" element={<Citas />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="barberos" element={<Barbers />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="finanzas" element={<Finanzas />} />
          <Route path="reportes" element={<ReportesAnaliticas />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
