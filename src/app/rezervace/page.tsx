import { Metadata } from 'next';
import ReservationWizard from '@/components/reservation/ReservationWizard';

export const metadata: Metadata = {
    title: 'Rezervace | REMEDY',
    description: 'Rezervujte si termín fyzioterapie nebo masáže online.',
};

import { getUserProfile } from '@/actions/user';

export default async function ReservationPage() {
    const user = await getUserProfile();

    return (
        <main className="min-h-screen pt-24 pb-12 bg-[#1C1917] text-white">
            <div className="max-w-4xl mx-auto px-6">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                        Rezervace <span className="text-[#D9F99D]">termínu</span>
                    </h1>
                    <p className="text-stone-400 max-w-lg mx-auto">
                        Vyberte si službu a čas, který vám vyhovuje.
                        <br />
                        Jednoduše, online, bez čekání.
                    </p>
                </header>

                <ReservationWizard user={user} />
            </div>
        </main>
    );
}
