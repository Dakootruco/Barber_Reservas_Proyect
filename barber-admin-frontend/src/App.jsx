import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
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
          <Route index element={<Placeholder title="Dashboard" />} />
          <Route path="clientes" element={<Placeholder title="Clientes" />} />
          <Route path="barberos" element={<Placeholder title="Barberos" />} />
          <Route path="citas" element={<Placeholder title="Citas" />} />
          <Route path="servicios" element={<Placeholder title="Servicios" />} />
          <Route path="inventario" element={<Placeholder title="Inventario" />} />
          <Route path="finanzas" element={<Placeholder title="Finanzas" />} />
          <Route path="reportes" element={<Placeholder title="Reportes / Analíticas" />} />
          <Route path="configuracion" element={<Placeholder title="Configuración" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
