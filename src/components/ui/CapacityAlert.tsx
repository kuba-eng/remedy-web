"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export function CapacityAlert() {
    // No more delayed appearance or complex state management needed for simple display
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] max-w-[90vw] w-full md:w-[400px] cursor-pointer"
            onClick={() => setIsVisible(false)}
        >
            <div className="relative group">
                {/* Glassmorphism Card */}
                <div className="relative overflow-hidden rounded-[24px] bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#D9F99D]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-8">

                    {/* Inner Glow Effect */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D9F99D]/20 rounded-full blur-[60px]" />

                    {/* Close Hint */}
                    <div className="absolute top-4 right-4 text-white/20 group-hover:text-[#D9F99D] transition-colors">
                        <X className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col gap-3">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-2 h-2 rounded-full bg-[#D9F99D] shadow-[0_0_10px_#D9F99D]" />
                            <h3 className="text-[#D9F99D] font-bold text-sm tracking-widest uppercase">
                                Capacity Alert
                            </h3>
                        </div>

                        <h4 className="text-white font-bold text-lg leading-tight">
                            Kuba vs. Zákony časoprostoru: <span className="text-[#D9F99D]">0:1</span>
                        </h4>

                        <p className="text-neutral-300 text-sm leading-relaxed font-light">
                            Omlouváme se všem sympatizantům Remedy, ale Kuba momentálně dosáhl maximální hustoty práce na metr čtvereční.
                            Abychom předešli samovznícení jeho workflow, vyhlásili jsme dočasný <span className="text-white font-medium">stop stav</span> pro nové objednávky.
                        </p>

                        <p className="text-neutral-400 text-xs italic mt-2 border-l-2 border-[#D9F99D]/30 pl-3">
                            &quot;Jakmile se mu podaří ohnout čas, bude tu pro vás zas. Díky za pochopení (a trpělivost)!&quot;
                        </p>
                    </div>

                    {/* Click to close indicator */}
                    <div className="absolute bottom-3 right-0 left-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] uppercase tracking-widest text-[#D9F99D]/60 font-medium">
                            Kliknutím zavřete
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
