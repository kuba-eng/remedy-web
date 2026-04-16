import { RemedyBookingWidget } from '@/components/booking-widget/RemedyBookingWidget';

export default function NewReservationPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-light">Nová Rezervace (Remedy 2.0)</h1>
                    <p className="text-gray-500">Testovací verze nového widgetu.</p>
                </div>

                <RemedyBookingWidget />
            </div>
        </div>
    );
}
