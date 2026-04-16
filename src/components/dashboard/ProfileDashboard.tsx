"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, CreditCard, Calendar, Settings, LogOut,
    Wallet, TrendingUp, Clock, CheckCircle2, ChevronRight, Plus
} from 'lucide-react';
import { logout } from '@/actions/auth';
import { type UserProfile, updateUserProfile, getUserBookings, type UserBooking, cancelReservation } from '@/actions/user';
import DepositModal from './DepositModal';

type Tab = 'OVERVIEW' | 'WALLET' | 'BOOKINGS' | 'SETTINGS';

interface ProfileDashboardProps {
    user: UserProfile;
}

export default function ProfileDashboard({ user }: ProfileDashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    const navigation = [
        { id: 'OVERVIEW', label: 'Přehled', icon: User },
        { id: 'WALLET', label: 'Vklad a Peněženka', icon: Wallet },
        { id: 'BOOKINGS', label: 'Moje Rezervace', icon: Calendar },
        { id: 'SETTINGS', label: 'Nastavení', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* SIDEBAR NAVIGATION */}
                    <div className="md:col-span-1 space-y-6">
                        {/* User Profile Card */}
                        <div className="bg-[#121212] border border-white/10 rounded-lg p-6 text-center shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#D9F99D] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                            <div className="w-20 h-20 bg-[#1C1917] rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-[#D9F99D] shadow-[0_0_15px_rgba(217,249,157,0.2)]">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-xl font-bold font-display uppercase tracking-wide text-[#D9F99D]">{user.firstName} {user.lastName}</h2>
                            <p className="text-gray-400 text-sm mb-4 uppercase tracking-widest">Klient REMEDY</p>
                            <div className="inline-flex items-center gap-2 bg-[#CCFF00]/10 text-[#CCFF00] px-3 py-1 rounded-none border border-[#CCFF00]/20 text-xs font-bold uppercase tracking-wider">
                                <CheckCircle2 className="w-3 h-3" /> Aktivní člen
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-2">
                            {navigation.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as Tab)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg transition-all duration-300 group relative overflow-hidden border ${activeTab === item.id
                                        ? 'bg-[#CCff00] text-black border-[#CCff00] shadow-md font-bold' // keeping active robust
                                        : 'bg-[#121212] text-gray-400 border-transparent hover:border-[#D9F99D] hover:bg-[#D9F99D]/10 hover:text-[#D9F99D]'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-black' : 'text-gray-500 group-hover:text-[#D9F99D]'}`} />
                                    <span className="font-bold uppercase tracking-wider">{item.label}</span>
                                    {activeTab === item.id && (
                                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                    )}
                                </button>
                            ))}

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-lg text-red-500 border border-transparent hover:border-red-500 hover:bg-red-500/10 transition-colors mt-8 uppercase tracking-wider"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-bold">Odhlásit se</span>
                            </button>
                        </nav>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="md:col-span-3">
                        <AnimatePresence mode="wait">
                            {activeTab === 'OVERVIEW' && (
                                <DashboardOverview key="overview" setActiveTab={setActiveTab} user={user} onDeposit={() => setIsDepositModalOpen(true)} />
                            )}
                            {activeTab === 'WALLET' && (
                                <DashboardWallet key="wallet" user={user} onDeposit={() => setIsDepositModalOpen(true)} />
                            )}
                            {activeTab === 'BOOKINGS' && (
                                <DashboardBookings key="bookings" />
                            )}
                            {activeTab === 'SETTINGS' && (
                                <DashboardSettings key="settings" user={user} />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
            />
        </div>
    );
}

// --- SUB-COMPONENTS ---

function DashboardOverview({ setActiveTab, user, onDeposit }: { setActiveTab: (t: Tab) => void, user: UserProfile, onDeposit: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <h2 className="text-3xl font-bold font-display text-white uppercase tracking-wider">Vítejte, <span className="text-[#CCFF00]">{user.firstName}</span></h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Balance Card */}
                <div className="bg-black border border-white/20 rounded-none p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="p-3 bg-white/10 rounded-none text-[#CCFF00]">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Vklad</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-4xl font-bold text-white mb-1">{user.credit} <span className="text-lg text-gray-500 font-normal">Kč</span></h3>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Aktuální zůstatek</p>
                    </div>
                </div>
                <button onClick={onDeposit} className="mt-6 w-full py-3 bg-[#D9F99D] hover:bg-white hover:text-black text-black rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg">
                    <Plus className="w-4 h-4" /> Vložit
                </button>
            </div>

            {/* Next Booking Card */}
            <div className="bg-[#D9F99D] rounded-lg p-6 relative overflow-hidden text-[#1C1917] md:col-span-2 group shadow-xl">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/30 to-transparent"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg opacity-80 uppercase tracking-wide mb-1">Příští návštěva</h3>
                            <p className="text-3xl font-bold font-display uppercase">Zatím žádná</p>
                        </div>
                        <div className="bg-black/10 p-3 rounded-none backdrop-blur-sm">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <button onClick={() => window.location.href = '/rezervace'} className="px-4 py-2 bg-black text-white hover:text-[#CCFF00] rounded-none text-xs font-bold hover:scale-105 transition-transform uppercase tracking-wider">
                            Rezervovat termín
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function DashboardWallet({ user, onDeposit }: { user: UserProfile, onDeposit: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <h2 className="text-3xl font-bold font-display text-white uppercase tracking-wider">Vklad a Peněženka</h2>
            <div className="bg-[#121212] border border-white/10 rounded-lg p-8 text-center space-y-4 shadow-lg">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-[#D9F99D] border border-[#D9F99D]/30">
                    <CreditCard className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-bold text-white">{user.credit} Kč</h3>
                <p className="text-gray-500 uppercase tracking-widest text-sm">Aktuální zůstatek vkladu</p>

                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-4">
                    <button onClick={onDeposit} className="bg-[#D9F99D] text-black font-bold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg">
                        <Plus className="w-5 h-5" /> Vložit prostředky
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function DashboardBookings() {
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = () => {
        setLoading(true);
        getUserBookings().then(data => {
            setBookings(data);
            setLoading(false);
        });
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Opravdu chcete zrušit tuto rezervaci?')) return;
        const result = await cancelReservation(id);
        if (result.success) loadBookings();
        else alert(result.error || 'Chyba při rušení.');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <h2 className="text-3xl font-bold font-display text-white uppercase tracking-wider">Moje rezervace</h2>

            {loading ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CCFF00] mx-auto mb-4"></div>
                    <p className="text-gray-500 uppercase tracking-widest">Načítám rezervace...</p>
                </div>
            ) : bookings.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-black border border-white/20 rounded-none p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-[#CCFF00] transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="bg-[#CCFF00]/10 p-3 rounded-none text-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black transition-colors">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-[#CCFF00] transition-colors uppercase tracking-wide">{booking.activityName}</h3>
                                    <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(booking.start).toLocaleDateString('cs-CZ')} {new Date(booking.start).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {booking.instructorName && (
                                        <p className="text-gray-500 text-xs mt-2 uppercase tracking-wide">Lektor: {booking.instructorName}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:text-right flex flex-col items-start md:items-end">
                                <span className={`px-3 py-1 rounded-none text-xs font-bold uppercase tracking-wider mb-2 ${booking.status === 'CONFIRMED' ? 'bg-[#CCFF00]/10 text-[#CCFF00]' :
                                    booking.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {booking.status === 'CONFIRMED' ? 'Potvrzeno' : booking.status === 'CANCELLED' ? 'Zrušeno' : 'Čeká na schválení'}
                                </span>
                                {booking.status !== 'CANCELLED' && new Date(booking.start) > new Date() && (
                                    <button
                                        onClick={() => handleCancel(booking.id)}
                                        className="text-xs text-gray-500 hover:text-red-500 underline transition-colors uppercase tracking-wider"
                                    >
                                        Zrušit rezervaci
                                    </button>
                                )}
                                {booking.price && <span className="text-white font-bold">{booking.price} Kč</span>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[#121212] border border-dashed border-white/10 rounded-lg p-10 text-center hover:border-[#D9F99D] transition-colors group">
                    <p className="text-gray-500 mb-4">Zatím nemáte žádné rezervace.</p>
                    <a href="/rezervace" className="text-[#D9F99D] font-bold uppercase tracking-widest hover:text-white transition-colors group-hover:underline">Vytvořit novou rezervaci</a>
                </div>
            )}
        </motion.div>
    );
}

function DashboardSettings({ user }: { user: UserProfile }) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            phone: formData.get('phone') as string,
            birthDate: formData.get('birthDate') as string,
            street: formData.get('street') as string,
            city: formData.get('city') as string,
            zip: formData.get('zip') as string,
            note: formData.get('note') as string,
        };

        const result = await updateUserProfile(data);
        if (result.success) setMessage({ type: 'success', text: 'Změny byly úspěšně uloženy.' });
        else setMessage({ type: 'error', text: result.error || 'Nastala chyba.' });
        setIsLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <h2 className="text-3xl font-bold font-display text-white uppercase tracking-wider">Nastavení profilu</h2>
            <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/10 rounded-lg p-8 space-y-6 shadow-lg">

                {message && (
                    <div className={`p-4 rounded-none text-xs font-bold uppercase tracking-wide border ${message.type === 'success' ? 'bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]' : 'bg-red-500/10 text-red-500 border-red-500'}`}>
                        {message.text}
                    </div>
                )}

                {/* Osobní údaje */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest border-b border-white/10 pb-2">Osobní údaje</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Jméno</label>
                            <input name="firstName" type="text" defaultValue={user.firstName} className="w-full bg-[#1C1917] border border-white/10 rounded-lg p-3 text-white focus:border-[#D9F99D] outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Příjmení</label>
                            <input name="lastName" type="text" defaultValue={user.lastName} className="w-full bg-[#1C1917] border border-white/10 rounded-lg p-3 text-white focus:border-[#D9F99D] outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Email</label>
                            <input type="email" defaultValue={user.email} disabled className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Telefon</label>
                            <input name="phone" type="tel" defaultValue={user.phone} className="w-full bg-[#1C1917] border border-white/10 rounded-lg p-3 text-white focus:border-[#D9F99D] outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Datum narození</label>
                            <input name="birthDate" type="date" defaultValue={user.birthDate} className="w-full bg-[#1C1917] border border-white/10 rounded-lg p-3 text-white focus:border-[#D9F99D] outline-none transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                    <button type="submit" disabled={isLoading} className="bg-[#D9F99D] text-black font-bold px-8 py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2 uppercase tracking-wider shadow-lg">
                        {isLoading ? 'Ukládám...' : 'Uložit změny'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
