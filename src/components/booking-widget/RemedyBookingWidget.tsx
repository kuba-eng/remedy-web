'use client';

import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { ServiceStep } from './steps/ServiceStep';
import { StaffStep } from './steps/StaffStep';
import { DateStep } from './steps/DateStep';
import { DetailsStep } from './steps/DetailsStep';
import clsx from 'clsx';
import { CheckCircle } from 'lucide-react';

function WidgetContent({ className }: { className?: string }) {
    const { state, dispatch } = useBooking();

    return (
        <div className={clsx("remedy-widget w-full max-w-4xl mx-auto bg-[#1C1917] border border-white/10 rounded-lg shadow-2xl overflow-hidden min-h-[600px] flex flex-col font-sans", className)}>
            {/* Header */}
            <div className="bg-[#121212] p-6 border-b border-white/10 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold tracking-wider uppercase font-display text-[#D9F99D]">Rezervace</h2>
                <div className="text-xs font-bold tracking-widest uppercase text-[#1C1917] bg-[#D9F99D] px-2 py-1 rounded-sm">
                    {state.step}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-8 bg-[#1C1917] text-white">
                {state.step === 'service' && <ServiceStep />}
                {state.step === 'staff' && <StaffStep />}
                {state.step === 'date' && <DateStep />}
                {state.step === 'details' && <DetailsStep />}
                {state.step === 'success' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-24 h-24 border-2 border-[#D9F99D] rounded-full flex items-center justify-center text-[#D9F99D] shadow-[0_0_15px_rgba(217,249,157,0.2)]">
                            <CheckCircle size={48} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-2 font-display uppercase">Rezervace odeslána</h3>
                            <p className="text-gray-300 max-w-md mx-auto">
                                Děkujeme. Potvrzení vám přijde do emailu.
                            </p>
                        </div>
                        <button
                            onClick={() => dispatch({ type: 'RESET' })}
                            className="mt-8 text-[#D9F99D] font-bold hover:text-white hover:underline tracking-widest uppercase text-sm transition-colors"
                        >
                            Vytvořit další rezervaci
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export function RemedyBookingWidget({ className }: { className?: string }) {
    return (
        <BookingProvider>
            <WidgetContent className={className} />
        </BookingProvider>
    );
}
