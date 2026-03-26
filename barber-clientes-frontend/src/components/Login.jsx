export default function Login() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Login</h1>
      <form className="mt-4 flex flex-col max-w-sm gap-4">
        <input className="border p-2 rounded" type="email" placeholder="Correo" />
        <input className="border p-2 rounded" type="password" placeholder="Contraseña" />
        <button className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition">
          Entrar
        </button>
      </form>
    </div>
  );
}
