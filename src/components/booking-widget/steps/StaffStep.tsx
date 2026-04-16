'use client';

import { useBooking } from '../context/BookingContext';
import { useEffect, useState } from 'react';
import { User, Users } from 'lucide-react';

interface Staff {
    id: string;
    name: string;
    bio?: string;
    avatar?: string;
}

export function StaffStep() {
    const { state, dispatch } = useBooking();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStaff() {
            try {
                const res = await fetch(`/api/v1/staff?service_id=${state.serviceId}`);
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                setStaff(data);
            } catch (err) {
                // Fallback
            } finally {
                setLoading(false);
            }
        }
        if (state.serviceId) fetchStaff();
    }, [state.serviceId]);

    if (loading) return <div className="text-gray-400 animate-pulse font-bold tracking-widest">NAČÍTÁM TERAPEUTY...</div>;

    return (
        <div className="space-y-6">
            <button onClick={() => dispatch({ type: 'SET_STEP', payload: 'service' })} className="text-sm text-gray-400 hover:text-[#D9F99D] uppercase tracking-wider font-bold transition-colors">
                ← Zpět
            </button>
            <h3 className="text-2xl font-bold text-[#D9F99D] font-display uppercase tracking-wider">Vyberte terapeuta</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* ANY THERAPIST OPTION */}
                <button
                    onClick={() => dispatch({ type: 'SELECT_STAFF', payload: 'any' })}
                    className="flex flex-col items-center justify-center p-6 rounded-lg border border-white/10 bg-[#121212] hover:border-[#D9F99D] hover:bg-[#D9F99D]/10 hover:shadow-lg transition-all gap-4 group"
                >
                    <div className="w-16 h-16 rounded-full border border-white/20 bg-[#1C1917] flex items-center justify-center text-white group-hover:text-[#D9F99D] group-hover:border-[#D9F99D]">
                        <Users size={28} />
                    </div>
                    <span className="font-bold text-white group-hover:text-[#D9F99D] uppercase tracking-wider">Kdokoliv</span>
                </button>

                {/* SPECIFIC THERAPISTS */}
                {staff.map((person) => (
                    <button
                        key={person.id}
                        onClick={() => dispatch({ type: 'SELECT_STAFF', payload: person.id })}
                        className="flex flex-col items-center justify-center p-6 rounded-lg border border-white/10 bg-[#121212] hover:border-[#D9F99D] hover:bg-[#D9F99D]/10 hover:shadow-lg transition-all gap-4 group"
                    >
                        {/* Avatar Placeholder */}
                        <div className="w-16 h-16 rounded-full bg-[#1C1917] overflow-hidden border border-white/20 group-hover:border-[#D9F99D] grayscale group-hover:grayscale-0 transition-all">
                            {person.avatar ? (
                                <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 group-hover:text-[#D9F99D]">
                                    <User size={28} />
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <span className="font-bold block text-white group-hover:text-[#D9F99D] uppercase tracking-wide">{person.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
