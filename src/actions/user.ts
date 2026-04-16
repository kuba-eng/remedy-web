'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


import { getClubspireDeposit, createClubspireDepositPayment } from './clubspire';

const BASE_URL = 'https://rezervace.remedy.cz';

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate?: string;
    street?: string;
    city?: string;
    zip?: string;
    note?: string;
    credit: number; // Deposit balance
}

async function getUserToken(): Promise<string> {
    const cookieStore = await cookies();
    const token = cookieStore.get('remedy_session')?.value;

    if (!token) {
        throw new Error('Not authenticated');
    }
    return token;
}

export async function getUserProfile(): Promise<UserProfile | null> {
    try {
        const token = await getUserToken();
        console.log('[User] Fetching profile...');

        if (token === 'demo-token') {
            return {
                id: 'demo-user-123',
                firstName: 'Jan',
                lastName: 'Novák',
                email: 'jan.novak@example.com',
                phone: '+420 123 456 789',
                birthDate: '1990-01-01',
                street: 'Dlouhá 123',
                city: 'Praha',
                zip: '110 00',
                note: 'Bez alergií',
                credit: 1500
            };
        }

        // Try standard endpoint
        const response = await fetch(`${BASE_URL}/api/1.0/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error('[User] Fetch profile failed:', response.status, await response.text());
            if (response.status === 401) {
                // Token expired or invalid
                return null;
            }
            throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const json = await response.json();

        // API returns { data: [ { ... } ] } - Array of users?
        const rawData = Array.isArray(json.data) ? json.data[0] : (json.data || json);

        if (!rawData) {
            console.error('[User] No data in profile response');
            return null;
        }


        // Fetch real deposit balance
        const deposit = await getClubspireDeposit(token);

        // Map API fields (name, surname, zipCode from test log)
        return {
            id: rawData.customerId || rawData.id,
            firstName: rawData.name || rawData.firstName,
            lastName: rawData.surname || rawData.lastName,
            email: rawData.email,
            phone: rawData.phone,
            birthDate: rawData.birthDate,
            street: rawData.streetName, // or combining street + houseNumber
            city: rawData.city,
            zip: rawData.zipCode,
            note: rawData.note,
            credit: deposit ? deposit.amount : 0
        };

    } catch (error) {
        console.error('[User] Get Profile Error:', error);
        return null;
    }
}

export async function initiateDeposit(amount: number): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        console.log('[User] initiateDeposit called with amount:', amount);
        // Ensure user is authenticated (throws if not)
        const token = await getUserToken();
        console.log('[User] Token retrieved (length):', token.length);

        if (amount <= 0) {
            return { success: false, error: 'Částka musí být kladná.' };
        }

        console.log('[User] Creation payment via Clubspire...');
        const result = await createClubspireDepositPayment(token, amount);
        console.log('[User] Clubspire Result:', result);

        if (result && result.url) {
            return { success: true, url: result.url };
        }

        console.error('[User] Payment creation returned no URL');
        return { success: false, error: 'Nepodařilo se vytvořit platbu. Zkuste to prosím později.' };
    } catch (error) {
        console.error('[User] Initiate Deposit Error:', error);
        return { success: false, error: 'Nastala chyba při komunikaci se serverem.' };
    }
}

export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'credit'>>;

export async function updateUserProfile(data: UserProfileUpdate): Promise<{ success: boolean; error?: string }> {
    try {
        const token = await getUserToken();
        const profile = await getUserProfile();

        if (!profile) {
            return { success: false, error: 'Uživatel nenalezen.' };
        }

        // Map UI fields back to API fields
        const apiData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email, // Often read-only but let's try
            phone: data.phone,
            birthDate: data.birthDate,
            streetName: data.street,
            city: data.city,
            zipCode: data.zip,
            note: data.note
        };

        const response = await fetch(`${BASE_URL}/api/1.0/users/${profile.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(apiData),
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error('[User] Update Profile Failed:', await response.text());
            return { success: false, error: 'Nepodařilo se uložit změny.' };
        }

        return { success: true };
    } catch (error) {
        console.error('[User] Update Profile Error:', error);
        return { success: false, error: 'Nastala chyba při ukládání.' };
    }
}

export interface UserBooking {
    id: string;
    activityName: string;
    start: string;
    end: string;
    status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
    instructorName?: string;
    price?: number;
}

export async function getUserBookings(): Promise<UserBooking[]> {
    try {
        const token = await getUserToken();

        // Attempt to fetch from likely endpoint (known to 500 currently)
        const response = await fetch(`${BASE_URL}/api/1.0/reservations/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            cache: 'no-store'
        });

        if (response.ok) {
            const json = await response.json();
            const data = json.data || json;
            if (Array.isArray(data)) {
                // Map real data if it ever works
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return data.map((b: any) => ({
                    id: b.id,
                    activityName: b.activity?.name || 'Rezervace',
                    start: b.start || b.from,
                    end: b.end || b.to,
                    status: 'CONFIRMED', // Default
                    instructorName: b.instructor?.name,
                    price: b.price
                }));
            }
        }

        console.warn('[User] Fetch bookings failed/endpoint broken, returning mocks.');

        // Return Mock Data for UI Dev
        return [
            {
                id: 'mock-1',
                activityName: 'Fyzioterapie - Vstupní vyšetření',
                start: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                end: new Date(Date.now() + 86400000 + 3600000).toISOString(),
                status: 'CONFIRMED',
                instructorName: 'Mgr. Jan Novák',
                price: 1500
            },
            {
                id: 'mock-2',
                activityName: 'Masáž sportovní',
                start: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                end: new Date(Date.now() - 86400000 + 3600000).toISOString(),
                status: 'CONFIRMED',
                instructorName: 'Petra Svobodová',
                price: 800
            }
        ];

    } catch (error) {
        console.error('[User] Get Bookings Error:', error);
        return [];
    }
}

export async function cancelReservation(reservationId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const token = await getUserToken();
        const response = await fetch(`${BASE_URL}/api/1.0/reservations/${reservationId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error('[User] Cancel Reservation Failed:', await response.text());
            return { success: false, error: 'Nepodařilo se zrušit rezervaci.' };
        }

        return { success: true };
    } catch (error) {
        console.error('[User] Cancel Reservation Error:', error);
        return { success: false, error: 'Chyba serveru.' };
    }
}
