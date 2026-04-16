"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Calendar, User, CheckCircle2, ChevronLeft, ExternalLink, Download, Lock, Users, Clock } from 'lucide-react';
import { getClubspireActivities, getClubspireSlots, getClubspireInstructors } from '@/actions/clubspire';
import { ClubspireActivity, ClubspireSlot, ClubspireInstructor } from '@/lib/clubspire-types';
import { UserProfile } from '@/actions/user';

type WizardStep = 'SERVICE' | 'DURATION' | 'THERAPIST' | 'DATE' | 'DETAILS' | 'CONFIRM';

interface ReservationWizardProps {
    user?: UserProfile | null;
}

export default function ReservationWizard({ user }: ReservationWizardProps) {
    const [step, setStep] = useState<WizardStep>('SERVICE');
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [selectedInstructorId, setSelectedInstructorId] = useState<string>('any'); // 'any' or specific ID
    const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Anchor for calendar view
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<ClubspireSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<ClubspireSlot | null>(null);

    // Loading States
    const [isLoadingActivities, setIsLoadingActivities] = useState(true);
    const [isLoadingInstructors, setIsLoadingInstructors] = useState(true);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // API Data
    const [apiActivities, setApiActivities] = useState<ClubspireActivity[]>([]);
    const [apiInstructors, setApiInstructors] = useState<ClubspireInstructor[]>([]);

    // User Form
    const [userForm, setUserForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        note: '',
        consents: { gdpr: false, terms: false }
    });

    // Load Data on Mount
    useEffect(() => {
        async function loadData() {
            try {
                const [activities, instructors] = await Promise.all([
                    getClubspireActivities(),
                    getClubspireInstructors()
                ]);
                setApiActivities(activities);
                setApiInstructors(instructors);
            } catch (e) {
                console.error("Failed to load initial data", e);
            } finally {
                setIsLoadingActivities(false);
                setIsLoadingInstructors(false);
            }
        }
        loadData();
    }, []);

    // Calendar Navigation Logic
    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        if (newDate < new Date()) {
            setCurrentDate(new Date());
        } else {
            setCurrentDate(newDate);
        }
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        if (newDate < new Date()) {
            setCurrentDate(new Date());
        } else {
            setCurrentDate(newDate);
        }
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const steps = [
        { id: 'SERVICE', label: 'Služba', icon: CheckCircle2 },
        { id: 'DURATION', label: 'Délka', icon: Clock },
        { id: 'THERAPIST', label: 'Terapeut', icon: Users },
        { id: 'DATE', label: 'Termín', icon: Calendar },
        { id: 'DETAILS', label: 'Údaje', icon: User },
        { id: 'CONFIRM', label: 'Hotovo', icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === step);

    // Handlers
    const handleServiceSelect = (id: string) => {
        setSelectedServiceId(id);
        // If activity has strict duration, maybe skip? For now always show duration choice
        setStep('DURATION');
    };

    const handleDurationSelect = (mins: number) => {
        setSelectedDuration(mins);
        setStep('THERAPIST');
    };

    const handleInstructorSelect = (id: string) => {
        setSelectedInstructorId(id);
        setStep('DATE');
    };

    const handleDateSelect = async (date: Date) => {
        setSelectedDate(date);
        setIsLoadingSlots(true);
        setAvailableSlots([]);

        try {
            // Pass activityId if needed by API to filter timeline
            const slots = await getClubspireSlots(date, selectedServiceId || undefined);

            // Filter by instructor
            let filtered = slots;
            if (selectedInstructorId !== 'any') {
                filtered = slots.filter(s => s.instructorId === selectedInstructorId);
            }

            setAvailableSlots(filtered);
        } catch (e) {
            console.error("Failed to load slots", e);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const handleSlotSelect = (slot: ClubspireSlot) => {
        setSelectedSlot(slot);
        setStep('DETAILS');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user && (!userForm.consents.gdpr || !userForm.consents.terms)) {
            alert('Pro dokončení rezervace musíte souhlasit s podmínkami.');
            return;
        }

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStep('CONFIRM');
        } catch (error) {
            console.error(error);
            alert('Chyba při vytváření rezervace');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to get names
    const getServiceName = () => apiActivities.find(a => a.id === selectedServiceId)?.name || 'Služba';
    const getInstructorName = () => {
        if (selectedInstructorId === 'any') return 'Kdokoliv';
        const inst = apiInstructors.find(i => i.id === selectedInstructorId);
        return inst ? `${inst.firstName} ${inst.lastName}` : 'Terapeut';
    };

    // Mock Duration Variants (since API doesn't return them structure yet)
    const getDurationVariants = () => [50, 80, 110];

    return (
        <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            {/* PROGRESS BAR */}
            <div className="border-b border-white/5 bg-black/20 p-4 md:p-6">
                <div className="flex items-center justify-between max-w-lg mx-auto relative mb-6">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-0"></div>
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-[#D9F99D] transition-all duration-500 -z-0"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((s, index) => {
                        const isActive = index <= currentStepIndex;
                        return (
                            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 bg-neutral-900 px-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive
                                        ? 'bg-[#D9F99D] border-[#D9F99D] text-black'
                                        : 'bg-neutral-800 border-neutral-700 text-neutral-500'
                                        }`}
                                >
                                    <s.icon className="w-4 h-4" />
                                </div>
                                <span className={`text-[10px] uppercase font-bold tracking-wider hidden md:block ${isActive ? 'text-[#D9F99D]' : 'text-neutral-600'}`}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* BREADCRUMBS */}
                {step !== 'SERVICE' && (
                    <div className="bg-white/5 rounded-lg p-3 flex flex-wrap items-center gap-2 text-sm text-stone-300 animate-in fade-in slide-in-from-top-2">
                        <span className="text-[#D9F99D] font-bold">Váš výběr:</span>
                        <span>{getServiceName()}</span>
                        {selectedDuration && (
                            <>
                                <ChevronRight className="w-3 h-3 text-stone-500" />
                                <span>{selectedDuration} min</span>
                            </>
                        )}
                        {selectedInstructorId && step !== 'DURATION' && (
                            <>
                                <ChevronRight className="w-3 h-3 text-stone-500" />
                                <span>{getInstructorName()}</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* CONTENT AREA */}
            <div className="p-6 md:p-10 min-h-[400px]">
                <AnimatePresence mode="wait">

                    {/* STEP 1: SERVICE */}
                    {step === 'SERVICE' && (
                        <motion.div key="step-service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 className="text-2xl font-bold text-white mb-6 font-display">Vyberte službu</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isLoadingActivities ? (
                                    [1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl"></div>)
                                ) : (
                                    apiActivities.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleServiceSelect(item.id)}
                                            className="group relative flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#D9F99D]/30 transition-all text-left"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-[#D9F99D]/10 flex items-center justify-center text-[#D9F99D] group-hover:bg-[#D9F99D] group-hover:text-black transition-colors">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-white group-hover:text-[#D9F99D] transition-colors">{item.name}</h3>
                                                <p className="text-stone-400 text-xs mt-1">{item.description}</p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: DURATION */}
                    {step === 'DURATION' && (
                        <motion.div key="step-duration" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <button onClick={() => setStep('SERVICE')} className="text-stone-500 hover:text-white flex items-center gap-2 text-sm mb-6"><ChevronLeft className="w-4 h-4" /> Zpět</button>
                            <h2 className="text-2xl font-bold text-white mb-6 font-display">Zvolte délku trvání</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {getDurationVariants().map(mins => (
                                    <button
                                        key={mins}
                                        onClick={() => handleDurationSelect(mins)}
                                        className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-[#D9F99D] hover:text-black hover:border-[#D9F99D] transition-all text-center group"
                                    >
                                        <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform">{mins}</div>
                                        <div className="text-xs uppercase tracking-wider opacity-60">minut</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: THERAPIST */}
                    {step === 'THERAPIST' && (
                        <motion.div key="step-therapist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <button onClick={() => setStep('DURATION')} className="text-stone-500 hover:text-white flex items-center gap-2 text-sm mb-6"><ChevronLeft className="w-4 h-4" /> Zpět</button>
                            <h2 className="text-2xl font-bold text-white mb-6 font-display">Vyberte terapeuta</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => handleInstructorSelect('any')}
                                    className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-[#D9F99D] hover:text-black hover:border-[#D9F99D] transition-all group text-center"
                                >
                                    <div className="w-20 h-20 rounded-full bg-neutral-800 mx-auto mb-4 flex items-center justify-center group-hover:bg-black/20">
                                        <Users className="w-8 h-8 text-stone-400 group-hover:text-black" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">První volný termín</h3>
                                    <p className="text-xs text-stone-500 group-hover:text-black/60">Nezáleží mi na terapeutovi</p>
                                </button>
                                {apiInstructors.map(inst => (
                                    <button
                                        key={inst.id}
                                        onClick={() => handleInstructorSelect(inst.id)}
                                        className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-[#D9F99D] hover:text-black hover:border-[#D9F99D] transition-all group text-center"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-neutral-800 mx-auto mb-4 overflow-hidden group-hover:ring-4 ring-black/10 flex items-center justify-center text-[#D9F99D] text-xl font-bold">
                                            {inst.firstName[0]}{inst.lastName[0]}
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">{inst.firstName} {inst.lastName}</h3>
                                        <p className="text-xs text-stone-500 group-hover:text-black/60 line-clamp-1">{inst.info || 'Terapeut'}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: DATE */}
                    {step === 'DATE' && (
                        <motion.div key="step-date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <button onClick={() => setStep('THERAPIST')} className="text-stone-500 hover:text-white flex items-center gap-2 text-sm mb-6"><ChevronLeft className="w-4 h-4" /> Zpět</button>
                            <div className="flex items-center justify-between mb-6">
                                <button onClick={handlePrevMonth} className="text-xs text-stone-500 hover:text-white">&larr; Měsíc</button>
                                <h2 className="text-2xl font-bold text-white font-display">
                                    {currentDate.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
                                </h2>
                                <button onClick={handleNextMonth} className="text-xs text-stone-500 hover:text-white">Měsíc &rarr;</button>
                            </div>
                            <div className="flex items-center justify-between mb-6 bg-neutral-800/30 p-2 rounded-full">
                                <button onClick={handlePrevWeek} className="p-2 rounded-full hover:bg-white/10 text-white"><ChevronLeft className="w-5 h-5" /></button>
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Týden</span>
                                <button onClick={handleNextWeek} className="p-2 rounded-full hover:bg-white/10 text-white"><ChevronRight className="w-5 h-5" /></button>
                            </div>

                            <div className="bg-neutral-950/50 p-6 rounded-2xl border border-white/5 shadow-inner mb-8">
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                                    {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                                        const date = new Date(currentDate);
                                        date.setDate(date.getDate() + offset);
                                        const isSelected = selectedDate?.getDate() === date.getDate() && selectedDate?.getMonth() === date.getMonth();
                                        const isToday = new Date().toDateString() === date.toDateString();
                                        return (
                                            <button
                                                key={offset}
                                                onClick={() => handleDateSelect(date)}
                                                className={`min-w-[85px] p-4 rounded-xl border text-center transition-all snap-start ${isSelected
                                                    ? 'bg-[#D9F99D] border-[#D9F99D] text-black shadow-[0_0_15px_rgba(217,249,157,0.2)] scale-105'
                                                    : isToday ? 'bg-white/10 border-white/20' : 'bg-neutral-800/50 border-white/5 text-stone-400 hover:bg-neutral-800'
                                                    }`}
                                            >
                                                <div className="text-xs font-bold mb-1 uppercase tracking-wider opacity-70">{date.toLocaleDateString('cs-CZ', { weekday: 'short' })}</div>
                                                <div className="text-2xl font-bold font-display">{date.getDate()}.{date.getMonth() + 1}.</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="min-h-[200px]">
                                {isLoadingSlots ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D9F99D] mb-4"></div>
                                        <p className="text-stone-500">Načítám termíny...</p>
                                    </div>
                                ) : selectedDate && availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-2">
                                        {availableSlots.map((slot, i) => (
                                            <button key={i} onClick={() => handleSlotSelect(slot)} className="p-4 rounded-xl bg-neutral-800 hover:bg-[#D9F99D] hover:text-black border border-white/5 transition-all text-center group">
                                                <span className="block font-bold text-lg mb-1">{new Date(slot.start).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="text-xs opacity-50 block group-hover:opacity-100">
                                                    {selectedInstructorId === 'any' ?
                                                        (apiInstructors.find(ins => ins.id === slot.instructorId)?.lastName || 'Terapeut')
                                                        : (slot.end ? `${new Date(slot.end).getMinutes() - new Date(slot.start).getMinutes()} min` : '')
                                                    }
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                ) : selectedDate ? (
                                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                                        <p className="text-stone-500">Žádné volné termíny tento den.</p>
                                        <button onClick={handleNextWeek} className="text-[#D9F99D] hover:underline mt-2 text-sm">Zkusit další týden</button>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-stone-600">&larr; Vyberte den v kalendáři</div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: DETAILS (Simplified) */}
                    {step === 'DETAILS' && (
                        <motion.div key="step-details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <button onClick={() => setStep('DATE')} className="text-stone-500 hover:text-white flex items-center gap-2 text-sm mb-6"><ChevronLeft className="w-4 h-4" /> Zpět</button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-2xl font-bold font-display text-white mb-2">Kontrolní údaje</h3>
                                    {user && (
                                        <div className="bg-[#D9F99D]/10 border border-[#D9F99D]/30 p-6 rounded-2xl mb-6">
                                            <p className="text-[#D9F99D] text-xs font-bold uppercase tracking-wider">Přihlášený uživatel</p>
                                            <p className="text-white font-bold text-lg">{user.firstName} {user.lastName}</p>
                                        </div>
                                    )}
                                    <div className="bg-neutral-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex justify-between border-b border-white/5 pb-4"><span className="text-stone-400">Služba</span><span className="font-bold text-white">{getServiceName()}</span></div>
                                        <div className="flex justify-between border-b border-white/5 pb-4"><span className="text-stone-400">Délka</span><span className="font-bold text-white">{selectedDuration} min</span></div>
                                        <div className="flex justify-between border-b border-white/5 pb-4"><span className="text-stone-400">Terapeut</span><span className="font-bold text-white">{getInstructorName()}</span></div>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {!user && <input required placeholder="Jméno" value={userForm.firstName} onChange={e => setUserForm({ ...userForm, firstName: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white" />}
                                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#D9F99D] text-black font-bold py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 mt-4">{isSubmitting ? 'Odesílám...' : 'Potvrdit rezervaci'}</button>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {/* CONFIRM STEP */}
                    {step === 'CONFIRM' && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                            <div className="bg-[#D9F99D] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12 text-black" /></div>
                            <h3 className="text-4xl font-bold font-display text-white mb-4">Rezervace odeslána!</h3>
                            <div className="flex gap-4 justify-center mt-8">
                                <button onClick={() => window.location.reload()} className="px-6 py-3 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 font-bold">Další rezervace</button>
                                <button onClick={() => window.location.href = '/profil'} className="px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 font-bold">Přejít do profilu</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
