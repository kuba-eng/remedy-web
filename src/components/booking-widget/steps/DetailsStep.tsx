'use client';

import { useBooking } from '../context/BookingContext';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function DetailsStep() {
    const { state, dispatch } = useBooking();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                service_id: state.serviceId,
                staff_id: state.staffId === 'any' ? null : state.staffId,
                start_at: state.slot?.start,
                customer: {
                    first_name: state.customer.firstName,
                    last_name: state.customer.lastName,
                    email: state.customer.email,
                    phone: state.customer.phone
                },
                notes: state.customer.notes
            };

            const res = await fetch('/api/v1/bookings', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Rezervace se nezdařila.');
            }

            dispatch({ type: 'SET_STEP', payload: 'success' });
        } catch (err: any) {
            setError(err.message || 'Nastala chyba při odesílání.');
        } finally {
            setSubmitting(false);
        }
    };

    const updateCust = (field: string, val: string) => {
        dispatch({ type: 'UPDATE_CUSTOMER', payload: { [field]: val } });
    };

    if (!state.slot) return null;
    const startTime = new Date(state.slot.start).toLocaleString('cs-CZ');

    return (
        <div className="space-y-6 max-w-xl mx-auto">
            <button onClick={() => dispatch({ type: 'SET_STEP', payload: 'date' })} className="text-sm text-gray-400 hover:text-[#D9F99D] uppercase tracking-wider font-bold transition-colors">
                ← Zpět
            </button>

            <div className="bg-[#121212] p-6 border-l-4 border-[#D9F99D] rounded-r-lg shadow-md">
                <h4 className="text-xs uppercase tracking-widest text-[#D9F99D] mb-2 font-bold">Vybraný termín</h4>
                <div className="text-2xl font-bold text-white tracking-wide">{startTime}</div>
            </div>

            <h3 className="text-2xl font-bold text-[#D9F99D] font-display uppercase tracking-wider">Vaše údaje</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Jméno</label>
                        <input required type="text" className="w-full p-4 bg-[#1C1917] border border-white/10 rounded-lg text-white focus:border-[#D9F99D] outline-none transition-colors"
                            value={state.customer.firstName} onChange={e => updateCust('firstName', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Příjmení</label>
                        <input required type="text" className="w-full p-4 bg-[#1C1917] border border-white/10 rounded-lg text-white focus:border-[#D9F99D] outline-none transition-colors"
                            value={state.customer.lastName} onChange={e => updateCust('lastName', e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email</label>
                        <input required type="email" className="w-full p-4 bg-[#1C1917] border border-white/10 rounded-lg text-white focus:border-[#D9F99D] outline-none transition-colors"
                            value={state.customer.email} onChange={e => updateCust('email', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Telefon</label>
                        <input required type="tel" className="w-full p-4 bg-[#1C1917] border border-white/10 rounded-lg text-white focus:border-[#D9F99D] outline-none transition-colors"
                            value={state.customer.phone} onChange={e => updateCust('phone', e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Poznámka</label>
                    <textarea className="w-full p-4 bg-[#1C1917] border border-white/10 rounded-lg text-white h-24 focus:border-[#D9F99D] outline-none transition-colors"
                        value={state.customer.notes} onChange={e => updateCust('notes', e.target.value)}
                        placeholder="Máte nějaké zdravotní omezení nebo přání?" />
                </div>

                {error && <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 text-sm font-bold">{error}</div>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#D9F99D] hover:bg-white hover:text-black text-black font-bold uppercase tracking-widest py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {submitting && <Loader2 className="animate-spin" />}
                    {submitting ? 'ODESÍLÁM...' : 'DOKONČIT REZERVACI'}
                </button>
            </form>
        </div>
    );
}
