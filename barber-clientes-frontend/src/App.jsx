import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Service from './components/Agendar.jsx'
import Perfil from './components/Perfil.jsx'
import Schedule from './components/Schedule.jsx'
import Navbar from './components_ui/navbar.jsx'
import Select from './components/Select.jsx'

function App() {
  return (
    <div className="bg-linear-to-b from-[#1a1e2d] via-[#151620] to-[#0a0b10] min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Agendar" element={<Service />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/select" element={<Select />} />
        </Routes>
        <Navbar />
      </BrowserRouter>
    </div>
  )
}

export default App
