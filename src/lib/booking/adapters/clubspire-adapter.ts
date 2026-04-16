import { getClubspireSlots, getClubspireInstructors, getClubspireActivities } from '@/actions/clubspire';

export interface BookingAdapter {
    getServices(): Promise<any[]>;
    getStaff(serviceId?: string): Promise<any[]>;
    getSlots(date: Date, serviceId?: string, staffId?: string): Promise<any[]>;
}

export class ClubspireAdapter implements BookingAdapter {
    async getServices() {
        // Map Clubspire Activities to "Services"
        const activities = await getClubspireActivities();
        return activities.map(a => ({
            id: a.id,
            name: a.name,
            description: a.description,
            // Clubspire doesn't give price/duration in list, need detail fetch?
            // For MVP we can assume defaults or fetch details if needed.
        }));
    }

    async getStaff(serviceId?: string) {
        // Clubspire Instructors
        const instructors = await getClubspireInstructors();
        // Filter by service if API supports it or manually
        return instructors.map(i => ({
            id: i.id,
            name: `${i.firstName} ${i.lastName}`,
            bio: i.info,
            avatar: i.photoHref
        }));
    }

    async getSlots(date: Date, serviceId?: string, staffId?: string) {
        // Use the parsed logic we debugged
        const slots = await getClubspireSlots(date, serviceId);

        // Client-side filter for staff if API returned mixed result
        if (staffId && staffId !== 'any') {
            return slots.filter(s => s.instructorId === staffId);
        }
        return slots;
    }

    async createBooking(booking: {
        start: Date;
        end: Date; // Clubspire usually calculates end from service/slot
        serviceId: string;
        staffId?: string; // Optional if auto-assigned
        customer: { firstName: string; lastName: string; email: string; phone: string; note?: string };
    }): Promise<{ id: string; status: string; reference?: string }> {
        // 1. We need to create a USER in Clubspire or use guest checkout?
        // Clubspire API usually requires a USER ID for reservation.
        // For MVP, if we don't have login, we might need a "Service Account" or create a user on fly.
        // Let's assume we use the Token of the logged-in user (passed via context?)
        // OR we create a "Shadow User".

        // CRITICAL: We don't have the user's token here if it's a server action from Widget.
        // The previous implementation used `getUserToken()` which relies on cookies.
        // If the widget is embedded, we might not have cookies.
        // We'll assume the Adapter runs where `cookies()` are accessible (Next.js server).

        // For now, let's just throw or stub, as the real implementation depends on Auth Strategy (Parity Matrix Item 1).
        // We will Stub it to return success for now to unblock Frontend dev.
        console.log('[ClubspireAdapter] Creating Reservation Stub:', booking);

        return {
            id: 'stub-' + Math.random().toString(36),
            status: 'CONFIRMED',
            reference: 'REM-' + Date.now()
        };
    }
}
