'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { initiateDeposit } from '@/actions/user';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const [amount, setAmount] = useState<string>('500');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const numericAmount = parseInt(amount, 10);

        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Zadejte prosím platnou částku.');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Calling initiateDeposit with amount:', numericAmount);
            const result = await initiateDeposit(numericAmount);
            console.log('initiateDeposit Result:', result);

            if (result.success && result.url) {
                console.log('Redirecting to:', result.url);
                // Redirect to payment gateway
                window.location.href = result.url;
            } else {
                console.error('Deposit Error:', result.error);
                setError(result.error || 'Něco se pokazilo. Zkuste to prosím později.');
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Deposit Exception:', err);
            setError('Chyba připojení.');
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleOverlayClick}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-[#1C1917] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold text-white">
                                Dobít <span className="text-[#D9F99D]">kredit</span>
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-stone-500 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            {/* Payment Method Selection (Mock) */}
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4 cursor-default">
                                <div className="w-5 h-5 rounded-full border-[6px] border-[#D9F99D] bg-transparent shrink-0"></div>
                                <div className="flex-1">
                                    <div className="font-bold text-white text-sm">Platba online</div>
                                    <div className="text-xs text-stone-500">Okamžitá platba kartou</div>
                                </div>
                                <CreditCard className="w-6 h-6 text-stone-500" />
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-400 block">
                                    Částka k dobití (Kč)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white text-lg font-bold placeholder-stone-700 focus:outline-none focus:border-[#D9F99D]/50 focus:ring-1 focus:ring-[#D9F99D]/50 transition-all"
                                        placeholder="0"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold">
                                        Kč
                                    </div>
                                </div>

                                {/* Quick Presets */}
                                <div className="flex gap-2">
                                    {[500, 1000, 2000].map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => setAmount(val.toString())}
                                            className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-medium text-stone-300 transition-colors"
                                        >
                                            {val} Kč
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Providers Mock */}
                            <div className="flex gap-3 justify-center opacity-40 grayscale">
                                {/* Using placeholder divs for card logos logic or text */}
                                <span className="text-[10px] font-bold text-white border border-white/50 px-1 rounded">VISA</span>
                                <span className="text-[10px] font-bold text-white border border-white/50 px-1 rounded">MC</span>
                                <span className="text-[10px] font-bold text-white border border-white/50 px-1 rounded">GPay</span>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Terms */}
                            <p className="text-[10px] text-center text-stone-600">
                                Kliknutím na tlačítko souhlasíte s obchodními podmínkami.
                            </p>

                            {/* Action Buttons */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#D9F99D] text-black font-bold py-4 rounded-xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,249,157,0.2)]"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        Potvrdit a zaplatit <CheckCircle2 className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
