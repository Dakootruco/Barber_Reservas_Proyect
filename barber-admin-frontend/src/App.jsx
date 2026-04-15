import './App.css'

function App() {
  return (
    <>
      <section>
        <div className="mr-250 bg-zinc-800 h-screen">
          <div className="flex items-center justify-center text-white">
            <h1 className="text-2xl font-bold text-[#CFAE79] drop-shadow-lg">
              DakooBarberShop
              <p className="text-sm text-gray-400">Admin</p>
            </h1>
          </div>
          <nav>
            <ul className="text-white">
              <li className="mt-10 p-2 hover:bg-zinc-600 transition-colors">
                <a href="#" className=" ml-2 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 13a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M13.45 11.55l2.05 -2.05" />
                    <path d="M6.4 20a9 9 0 1 1 11.2 0l-11.2 0" />
                  </svg>
                  Dashboard
                </a>
              </li>
              <li className="mt-5 p-2 hover:bg-zinc-600">
                <a href="#" className="ml-2 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                  </svg>
                  Clientes
                </a>
              </li>
              <li className="mt-5 p-2 hover:bg-zinc-600">
                <a href="#" className='ml-2 flex items-center gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M8 3v2" />
                    <path d="M12 3v2" />
                    <path d="M16 3v2" />
                    <path d="M9 12v6a3 3 0 0 0 6 0v-6h-6" />
                    <path d="M8 5h8l-1 4h-6l-1 -4" />
                    <path d="M12 17v1" />
                  </svg>
                  Barberos
                </a>
              </li>
              <li className="mt-5 p-2 hover:bg-zinc-600">
                <a href="#" className='ml-2 flex items-center gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12" />
                    <path d="M16 3v4" />
                    <path d="M8 3v4" />
                    <path d="M4 11h16" />
                    <path d="M11 15h1" />
                    <path d="M12 15v3" />
                  </svg>
                  Citas
                </a>
              </li>
              <li className="mt-5 p-2 hover:bg-zinc-600">
                <a href="#" className='ml-2 flex items-center gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                    <path d="M7 12h14" />
                    <path d="M18 15l3 -3l-3 -3" />
                  </svg>
                  Servicios
                </a>
              </li>
              <li className="mt-5 p-2 hover:bg-zinc-600">
                <a href="#" className='ml-2 flex items-center gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
                    <path d="M12 12l8 -4.5" />
                    <path d="M12 12l0 9" />
                    <path d="M12 12l-8 -4.5" />
                    <path d="M16 5.25l-8 4.5" />
                  </svg>
                  Inventario
                </a>
              </li>
              <li className="mt-5 p-2 hover:bg-zinc-600">
                <a href="#" className='ml-2 flex items-center gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                    <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
                    <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
                    <path d="M12 17v1m0 -8v1" /></svg>
                  Finanzas
                </a>
              </li>
              <li className="mt-5 p-2 hover:bg-zinc-600">
                <a href="#" className='ml-2 flex items-center gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                    <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
                    <path d="M9 17v-5" />
                    <path d="M12 17v-1" />
                    <path d="M15 17v-3" /></svg>
                  Reportes/Analiticas
                </a>
              </li>
              <li className="mt-5 p-2 hover:bg-zinc-600">
                <a href="#" className='ml-2 flex items-center gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
                    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
                  Configuración
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </section>

    </>

  )
}

export default App
