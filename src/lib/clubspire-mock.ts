import { ClubspireActivity, ClubspireInstructor, ClubspireSlot } from './clubspire-types';

// MOCK DATA GENERATOR

const MOCK_INSTRUCTORS: ClubspireInstructor[] = [
    { id: '1', firstName: 'Jan', lastName: 'Novák', info: 'Zkušený fyzioterapeut' },
    { id: '2', firstName: 'Petra', lastName: 'Svobodová', info: 'Masérka se zaměřením na sportovní masáže' }
];

export const clubspireMock = {
    // Simulate fetching available slots for a given date range and activity
    getAvailableSlots: async (date: Date, activityId: string): Promise<ClubspireSlot[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const slots: ClubspireSlot[] = [];
        const startHour = 8;
        const endHour = 18;

        // Generate random slots for the given day
        const dayStr = date.toISOString().split('T')[0];

        for (let h = startHour; h < endHour; h++) {
            // Randomly decide if this hour is available (70% chance)
            if (Math.random() > 0.3) {
                const instructor = MOCK_INSTRUCTORS[Math.floor(Math.random() * MOCK_INSTRUCTORS.length)];
                const start = `${dayStr}T${h.toString().padStart(2, '0')}:00:00`;
                const end = `${dayStr}T${(h + 1).toString().padStart(2, '0')}:00:00`;

                slots.push({
                    start,
                    end,
                    instructorId: instructor.id,
                    activityId
                });
            }
        }
        return slots;
    },

    getInstructors: async (): Promise<ClubspireInstructor[]> => {
        return MOCK_INSTRUCTORS;
    },

    createReservation: async (data: any): Promise<{ success: boolean; reservationId?: string }> => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true, reservationId: 'MOCK-RES-' + Date.now() };
    }
};
