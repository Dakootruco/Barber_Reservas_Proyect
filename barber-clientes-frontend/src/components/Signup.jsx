import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.nombre || !formData.email || !formData.password) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/cliente/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al registrarse");
            }

            alert("¡Usuario registrado con éxito! Ahora puedes iniciar sesión.");
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1500&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-black/75"></div>

            <div className="relative z-10 w-full max-w-md p-8 sm:p-10 backdrop-blur-md bg-[#1a1e2d]/80 border border-white/10 rounded-3xl shadow-2xl mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold leading-tight text-[#CFAE79] tracking-widest drop-shadow-lg">
                        Dakoo
                        Barbershop
                    </h1>
                    <p className="text-gray-300 text-sm mt-2 tracking-wide font-light">Crea tu cuenta</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">{error}</div>}

                <form onSubmit={handleSignup} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-300 ml-1">Usuario</label>
                        <input
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#CFAE79] focus:ring-1 focus:ring-[#CFAE79] transition-all placeholder:text-gray-500"
                            type="text"
                            placeholder="Ej: tu nombre"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-300 ml-1">Correo Electrónico</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#CFAE79] focus:ring-1 focus:ring-[#CFAE79] transition-all placeholder:text-gray-500"
                            type="email"
                            placeholder="Ej: usuario@correo.com"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-300 ml-1">Telefono</label>
                        <input
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#CFAE79] focus:ring-1 focus:ring-[#CFAE79] transition-all placeholder:text-gray-500"
                            type="number"
                            placeholder="Ej: 809-000-0000"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-300 ml-1">Contraseña</label>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#CFAE79] focus:ring-1 focus:ring-[#CFAE79] transition-all placeholder:text-gray-500"
                            type="password"
                            placeholder="••••••••"
                        />
                    </div>

                    <button disabled={loading} className="w-full bg-[#CFAE79] text-black font-bold text-lg py-3.5 rounded-xl mt-2 hover:bg-[#b89b6b] hover:shadow-[0_0_15px_rgba(207,174,121,0.4)] transition-all duration-300 disabled:opacity-50">
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="text-[#CFAE79] font-bold hover:text-white transition-colors">
                        Inicia Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}