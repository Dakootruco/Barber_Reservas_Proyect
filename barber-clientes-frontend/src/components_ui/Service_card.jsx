import { useNavigate } from 'react-router-dom';

function Service_card({ id, image, name, price, duration }) {
    const navigate = useNavigate();

    // Default image if missing in DB
    const finalImage = image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop';

    const handleCardClick = () => {
        // We can pass the selected service id via state if needed in the next screen
        navigate('/select', { state: { serviceId: id, serviceName: name, servicePrice: price, serviceDuration: duration } });
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white mt-7 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden max-w-sm w-full border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800 cursor-pointer"
        >
            {/* Foto arriba */}
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={finalImage}
                    alt={`Imagen de ${name}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Contenido (Nombre, Precio, Duración) */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                    {name}
                </h3>

                <div className="flex items-center justify-between mt-4">
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {price}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 font-medium bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {duration}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Service_card;