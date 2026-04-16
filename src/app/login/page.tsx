'use client';

import { useFormState } from 'react-dom';
import { loginUser } from '@/actions/auth';
import { Section } from '@/components/ui/Section';
import Link from 'next/link';
import { User, Lock, Calendar, Users, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

function SubmitButton() {
    return (
        <button
            type="submit"
            className="w-full bg-[#D9F99D] hover:bg-white text-black font-bold py-4 rounded-sm uppercase tracking-widest text-lg transition-all shadow-md hover:scale-[1.02]"
        >
            PŘIHLÁSIT SE
        </button>
    );
}

const initialState = {
    success: false,
    message: '',
};

export default function LoginPage() {
    const [state, formAction] = useFormState(loginUser, initialState);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans pt-24 text-white">
            <Section className="py-10">
                <div className={cn(
                    "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-0 border border-white/10 shadow-2xl rounded-lg overflow-hidden transition-all duration-700 ease-out",
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>

                    {/* LEVÝ SLOUPEC - DENNÍ ROZVRH */}
                    <div className="bg-[#121212] border-r border-white/10 min-h-[500px] flex flex-col relative overflow-hidden group">
                        <div className="bg-[#D9F99D] p-8 text-black relative z-10">
                            <h2 className="text-3xl font-bold font-display uppercase leading-none tracking-widest">Denní<br />Rozvrh</h2>
                            <div className="absolute top-4 right-4 opacity-20">
                                <Calendar size={64} />
                            </div>
                        </div>
                        <div className="p-8 space-y-6 flex-1 relative z-10">
                            <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform cursor-pointer">
                                <div className="bg-white/10 text-[#D9F99D] w-10 h-10 flex items-center justify-center font-bold text-xl border border-white/10 rounded-full">1</div>
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover/item:text-[#D9F99D] uppercase tracking-wide transition-colors">Cvičebna 1</h3>
                                    <p className="text-sm text-gray-500 uppercase tracking-widest">Kuba</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform cursor-pointer">
                                <div className="bg-white/10 text-[#D9F99D] w-10 h-10 flex items-center justify-center font-bold text-xl border border-white/10 rounded-full">2</div>
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover/item:text-[#D9F99D] uppercase tracking-wide transition-colors">Cvičebna 2</h3>
                                    <p className="text-sm text-gray-500 uppercase tracking-widest">Radim</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform cursor-pointer">
                                <div className="bg-white/10 text-[#D9F99D] w-10 h-10 flex items-center justify-center border border-white/10 rounded-full">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover/item:text-[#D9F99D] uppercase tracking-wide transition-colors">Masérna</h3>
                                    <p className="text-sm text-gray-500 uppercase tracking-widest">Volno</p>
                                </div>
                            </div>
                        </div>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
                    </div>

                    {/* PROSTŘEDNÍ SLOUPEC - LEKTOŘI */}
                    <div className="bg-[#0a0a0a] border-r border-white/10 min-h-[500px] flex flex-col items-center justify-center p-12 text-center space-y-12 relative overflow-hidden">
                        <div className="relative z-10 space-y-2">
                            <Users size={48} className="text-[#D9F99D] mx-auto mb-6 opacity-80" />
                            <h2 className="text-2xl font-bold font-display uppercase tracking-widest text-white">Lektoři a trenéři</h2>
                            <div className="w-12 h-1 bg-[#D9F99D] mx-auto"></div>
                        </div>

                        <div className="space-y-6 relative z-10 w-full">
                            <div className="p-4 border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#D9F99D]/50 transition-all cursor-pointer group rounded-lg">
                                <p className="text-lg font-bold text-gray-300 group-hover:text-white uppercase tracking-wider">Jakub Prášil</p>
                            </div>
                            <div className="p-4 border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#D9F99D]/50 transition-all cursor-pointer group rounded-lg">
                                <p className="text-lg font-bold text-gray-300 group-hover:text-white uppercase tracking-wider">Radim Žídek</p>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D9F99D]/20 to-transparent"></div>
                    </div>

                    {/* PRAVÝ SLOUPEC - LOGIN FORMULÁŘ */}
                    <div className="bg-[#1C1917] min-h-[500px] flex flex-col relative">
                        <div className="bg-[#121212] p-8 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[#D9F99D] font-display uppercase tracking-widest">Přihlášení</h2>
                            <Lock size={20} className="text-gray-500" />
                        </div>

                        <form action={formAction} className="p-8 space-y-8 flex-1 flex flex-col justify-center">
                            <div className="space-y-6">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#D9F99D] transition-colors">
                                        <User size={20} />
                                    </div>
                                    <input
                                        name="login"
                                        type="text"
                                        placeholder="LOGIN"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-[#121212] border border-white/10 text-white focus:border-[#D9F99D] focus:bg-[#0a0a0a] outline-none transition-all placeholder-gray-600 tracking-wider font-bold text-sm rounded-sm normal-case"
                                    />
                                    <div className="absolute inset-y-0 right-0 w-1 bg-[#D9F99D] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#D9F99D] transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="HESLO"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-[#121212] border border-white/10 text-white focus:border-[#D9F99D] focus:bg-[#0a0a0a] outline-none transition-all placeholder-gray-600 tracking-wider font-bold text-sm rounded-sm normal-case"
                                    />
                                    <div className="absolute inset-y-0 right-0 w-1 bg-[#D9F99D] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-gray-400 text-xs uppercase tracking-widest font-bold">
                                <div className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input type="checkbox" id="remember" className="peer appearance-none w-4 h-4 border border-white/20 bg-[#121212] checked:bg-[#D9F99D] checked:border-[#D9F99D] rounded-sm transition-all" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none text-black">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    </div>
                                    <label htmlFor="remember" className="cursor-pointer group-hover:text-white transition-colors">Pamatuj si mě</label>
                                </div>
                                <a href="#" className="hover:text-[#D9F99D] transition-colors">Zapomenuté heslo?</a>
                            </div>

                            <SubmitButton />

                            <div className="pt-6 border-t border-white/10 text-center space-y-4">
                                <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-bold">Přihlásit přes sociální sítě</p>
                                <div className="flex gap-4 justify-center">
                                    <button type="button" className="bg-[#121212] border border-white/10 hover:border-[#3b5998] hover:text-[#3b5998] w-12 h-12 flex items-center justify-center font-bold text-gray-500 transition-all text-xl rounded-sm">f</button>
                                    <button type="button" className="bg-[#121212] border border-white/10 hover:border-[#db4437] hover:text-[#db4437] w-12 h-12 flex items-center justify-center font-bold text-gray-500 transition-all text-xl rounded-sm">G</button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link href="/register" className="group block w-full border border-white/20 text-gray-400 text-center py-4 font-bold uppercase tracking-widest hover:border-[#D9F99D] hover:text-[#D9F99D] transition-all text-sm flex items-center justify-center gap-2 rounded-sm">
                                    <span>Nová Registrace</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {state.message && (
                                <div className={`p-3 text-center text-xs font-bold uppercase tracking-wider border rounded-sm ${state.success ? 'text-[#D9F99D] border-[#D9F99D]/20 bg-[#D9F99D]/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
                                    {state.message}
                                </div>
                            )}
                        </form>
                    </div>

                </div>
            </Section>
        </div>
    );
}
