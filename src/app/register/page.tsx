'use client';

import { useFormState } from 'react-dom';
import { registerUser } from '@/actions/auth';
import { Section } from '@/components/ui/Section';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

function SubmitButton() {
    //   const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            className="w-full bg-[#D9F99D] text-black hover:bg-white font-bold text-lg py-4 rounded-sm transition-all shadow-md hover:shadow-lg uppercase tracking-widest"
        >
            Dokončit registraci
        </button>
    );
}

const initialState = {
    success: false,
    message: '',
};

export default function RegisterPage() {
    const [state, formAction] = useFormState(registerUser, initialState);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#D9F99D] font-sans">
            <Section className="py-20">
                <div className={cn(
                    "max-w-5xl mx-auto space-y-12 transition-all duration-700 ease-out",
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>

                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-bold font-display text-white uppercase tracking-wider">Registrace <span className="text-[#D9F99D]">nového zákazníka</span></h1>
                        <p className="text-gray-400 text-lg uppercase tracking-widest">Zadejte své údaje pro vytvoření účtu v systému REMEDY</p>
                    </div>

                    <form action={formAction} className="bg-[#121212] border border-white/10 p-8 md:p-12 shadow-2xl space-y-12 rounded-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9F99D]/5 rounded-bl-[100px] pointer-events-none"></div>

                        {state.message && (
                            <div className={`p-4 text-center font-bold uppercase tracking-wider border rounded-md ${state.success ? 'bg-[#D9F99D]/10 text-[#D9F99D] border-[#D9F99D]' : 'bg-red-500/10 text-red-500 border-red-500'}`}>
                                {state.message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10">

                            {/* LEVÝ SLOUPEC - OSOBNÍ ÚDAJE */}
                            <div className="space-y-8">
                                <div className="border-l-4 border-[#D9F99D] pl-4">
                                    <h2 className="text-2xl font-bold font-display text-white uppercase tracking-wide">Základní údaje</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Jméno*</label>
                                            <input name="firstName" required className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all placeholder-gray-600 normal-case" placeholder="Jan" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Příjmení*</label>
                                            <input name="lastName" required className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all placeholder-gray-600 normal-case" placeholder="Novák" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Ulice a číslo</label>
                                        <input name="street" className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all" />
                                    </div>

                                    <div className="grid grid-cols-5 gap-4">
                                        <div className="col-span-3 space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Město</label>
                                            <input name="city" className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all" />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">PSČ</label>
                                            <input name="zip" className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Stát</label>
                                        <select name="country" defaultValue="CZ" className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all appearance-none uppercase tracking-wide">
                                            <option value="CZ">Česká republika</option>
                                            <option value="SK">Slovensko</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* PRAVÝ SLOUPEC - KONTAKT A LOGIN */}
                            <div className="space-y-12">
                                {/* KONTAKT */}
                                <div className="space-y-8">
                                    <div className="border-l-4 border-[#D9F99D] pl-4">
                                        <h2 className="text-2xl font-bold font-display text-white uppercase tracking-wide">Kontakt</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Předvolba</label>
                                                <select name="phonePrefix" defaultValue="+420" className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all appearance-none text-center">
                                                    <option value="+420">+420</option>
                                                    <option value="+421">+421</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Telefon*</label>
                                                <input name="phone" type="tel" required className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all" placeholder="777 123 456" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Email*</label>
                                            <input name="email" type="email" required className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all normal-case" placeholder="vas@email.cz" />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Datum narození</label>
                                                <input name="birthDate" type="date" className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all invert-calendar-icon" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Pohlaví</label>
                                                <div className="flex flex-col gap-2 pt-2 pl-2">
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <input type="radio" name="gender" value="M" className="accent-[#D9F99D] w-4 h-4 bg-[#1C1917] border-white/20" />
                                                        <span className="text-sm text-gray-400 group-hover:text-white uppercase tracking-wide">Muž</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <input type="radio" name="gender" value="F" className="accent-[#D9F99D] w-4 h-4 bg-[#1C1917] border-white/20" />
                                                        <span className="text-sm text-gray-400 group-hover:text-white uppercase tracking-wide">Žena</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* HESLO */}
                                <div className="space-y-8">
                                    <div className="border-l-4 border-[#D9F99D] pl-4">
                                        <h2 className="text-2xl font-bold font-display text-white uppercase tracking-wide">Heslo k účtu</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Uživatelské jméno (Login)*</label>
                                            <input name="login" type="text" required className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all normal-case" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[#D9F99D]">Heslo*</label>
                                            <input name="password" type="password" required className="w-full bg-[#1C1917] border border-white/10 rounded-sm p-4 text-white focus:border-[#D9F99D] outline-none transition-all normal-case" />
                                            <div className="h-1 w-full bg-white/10 mt-2 overflow-hidden rounded-full">
                                                <div className="h-full bg-red-500 w-1/4 rounded-full"></div>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Bezpečnost hesla: Slabé</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <Link href="/login" className="text-gray-400 hover:text-[#D9F99D] font-bold uppercase tracking-widest text-sm transition-colors flex items-center gap-2 hover:underline">
                                ← Zpět na přihlášení
                            </Link>
                            <div className="w-full md:w-auto md:min-w-[300px]">
                                <SubmitButton />
                            </div>
                        </div>
                    </form>
                </div>
            </Section>
        </div>
    );
}
