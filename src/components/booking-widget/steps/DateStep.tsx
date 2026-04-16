'use client';

import { useBooking } from '../context/BookingContext';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slot {
    start: string;
    end: string;
    available: boolean;
}

export function DateStep() {
    const { state, dispatch } = useBooking();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);

    // Helper to format YYYY-MM-DD
    const toISODate = (d: Date) => d.toISOString().split('T')[0];

    useEffect(() => {
        async function fetchSlots() {
            setLoading(true);
            try {
                const dateStr = toISODate(selectedDate);
                const url = `/api/v1/availability/slots?date=${dateStr}&service_id=${state.serviceId}&staff_id=${state.staffId || 'any'}`;
                const res = await fetch(url);
                const data = await res.json();
                setSlots(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchSlots();
    }, [selectedDate, state.serviceId, state.staffId]);

    const handleNextDay = () => {
        const next = new Date(selectedDate);
        next.setDate(next.getDate() + 1);
        setSelectedDate(next);
    };

    const handlePrevDay = () => {
        const prev = new Date(selectedDate);
        prev.setDate(prev.getDate() - 1);
        if (prev >= new Date(new Date().setHours(0, 0, 0, 0))) {
            setSelectedDate(prev);
        }
    };

    return (
        <div className="space-y-6">
            <button onClick={() => dispatch({ type: 'SET_STEP', payload: 'staff' })} className="text-sm text-gray-400 hover:text-[#D9F99D] uppercase tracking-wider font-bold transition-colors">
                ← Zpět
            </button>

            <h3 className="text-2xl font-bold text-[#D9F99D] font-display uppercase tracking-wider">Vyberte termín</h3>

            {/* Date Navigation */}
            <div className="flex items-center justify-between bg-[#121212] p-4 border-y border-white/10">
                <button onClick={handlePrevDay} className="p-2 hover:bg-[#D9F99D] hover:text-black text-white rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-lg font-bold text-white uppercase tracking-wider">
                    {selectedDate.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <button onClick={handleNextDay} className="p-2 hover:bg-[#D9F99D] hover:text-black text-white rounded-full transition-colors">
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Slots Grid */}
            <div className="min-h-[200px]">
                {loading ? (
                    <div className="flex justify-center items-center h-40 text-[#D9F99D] animate-pulse font-bold tracking-widest">NAČÍTÁM...</div>
                ) : slots.length === 0 ? (
                    <div className="text-center p-10 border border-dashed border-white/20 text-gray-500">
                        Žádné volné termíny.
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {slots.map((slot, idx) => {
                            const start = new Date(slot.start);
                            const timeStr = start.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
                            return (
                                <button
                                    key={idx}
                                    onClick={() => dispatch({ type: 'SELECT_SLOT', payload: { date: selectedDate, slot } })}
                                    className="bg-[#1C1917] border border-white/10 text-white hover:border-[#D9F99D] hover:bg-[#D9F99D] hover:text-black px-4 py-3 rounded-md transition-all flex items-center justify-center gap-2 group font-bold tracking-wider shadow-sm"
                                >
                                    <span className="font-bold">{timeStr}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
