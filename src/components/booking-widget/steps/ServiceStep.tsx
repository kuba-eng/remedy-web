'use client';

import { useBooking } from '../context/BookingContext';
import { useEffect, useState } from 'react';

interface Service {
    id: string;
    name: string;
    description: string;
}

export function ServiceStep() {
    const { dispatch } = useBooking();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await fetch('/api/v1/services');
                if (!res.ok) throw new Error('Failed to load services');
                const data = await res.json();
                setServices(data);
            } catch (err) {
                setError('Nepodařilo se načíst služby.');
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 animate-pulse font-bold tracking-widest">NAČÍTÁM SLUŽBY...</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#D9F99D] font-display uppercase tracking-wider">Vyberte službu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                    <button
                        key={service.id}
                        onClick={() => dispatch({ type: 'SELECT_SERVICE', payload: service.id })}
                        className="text-left p-6 rounded-lg border border-white/10 bg-[#121212] hover:border-[#D9F99D]/50 hover:bg-[#D9F99D]/5 transition-all duration-300 group shadow-lg"
                    >
                        <h4 className="font-bold text-lg text-white group-hover:text-[#D9F99D] font-display uppercase tracking-wide">{service.name}</h4>
                        {service.description && (
                            <div
                                className="text-sm text-gray-400 mt-2 line-clamp-3 leading-relaxed group-hover:text-gray-200"
                                dangerouslySetInnerHTML={{ __html: service.description }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
