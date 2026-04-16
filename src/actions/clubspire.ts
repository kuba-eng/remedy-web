'use server';

import { ClubspireResponse, ClubspireActivity, ClubspireInstructor, ClubspireSlot } from "@/lib/clubspire-types";

// Configuration
const BASE_URL = 'https://rezervace.remedy.cz';
// In production, these should be in process.env
const CLIENT_ID = 'remedy';
const CLIENT_SECRET = 'R0H0qkONoCnRKpCS';

// Simple in-memory cache for the token (for this serverless instance life)
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
    const now = Date.now();
    if (cachedToken && tokenExpiry > now) {
        console.log('[Clubspire] Using cached token');
        return cachedToken;
    }

    console.log('[Clubspire] Fetching new access token...');
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    try {
        const response = await fetch(`${BASE_URL}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
            cache: 'no-store'
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('[Clubspire] Auth Failed:', response.status, text);
            throw new Error(`Auth failed: ${response.status} ${text}`);
        }

        const data = await response.json();
        cachedToken = data.access_token;
        // set expiry to 90% of actual expiry to be safe
        tokenExpiry = now + (data.expires_in * 1000 * 0.9);
        console.log('[Clubspire] Token obtained successfully');

        return cachedToken as string;
    } catch (error) {
        console.error('[Clubspire] Auth Error Exception:', error);
        throw error;
    }
}


export async function getClubspireActivities(): Promise<ClubspireActivity[]> {
    try {
        const token = await getAccessToken();
        const url = `${BASE_URL}/api/1.0/activities`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            console.error('[Clubspire] Activities API Error:', await response.text());
            return [];
        }

        const json: ClubspireResponse<ClubspireActivity[]> = await response.json();
        return json.data || [];
    } catch (error) {
        console.error('[Clubspire] Activities Exception:', error);
        return [];
    }
}

export async function getClubspireInstructors(): Promise<ClubspireInstructor[]> {
    try {
        const token = await getAccessToken();
        const url = `${BASE_URL}/api/1.0/instructors`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            console.error(`[Clubspire] Instructors API Error (${url}):`, response.status, await response.text());
            return [];
        }

        const json: ClubspireResponse<ClubspireInstructor[]> = await response.json();
        return json.data || [];
    } catch (error) {
        console.error('[Clubspire] Instructors Exception:', error);
        return [];
    }
}

export async function getClubspireSlots(date: Date, activityId?: string): Promise<ClubspireSlot[]> {
    try {
        const token = await getAccessToken();
        const dateStr = date.toISOString().split('T')[0];

        let url = `${BASE_URL}/api/1.0/timeline/day?date=${dateStr}`;
        if (activityId) {
            url += `&activityId=${activityId}`;
        }

        console.log(`[Clubspire] Fetching slots from: ${url}`);

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error('[Clubspire] Timeline API Error:', response.status, await response.text());
            return [];
        }

        const json: ClubspireResponse<any> = await response.json();

        // PARSE COMPLEX TIMELINE
        // Structure: data[] -> { tabs[] -> { objects[] -> { hours[] -> { hourDetails[] } } } }
        const parsedSlots: ClubspireSlot[] = [];

        if (json.data && Array.isArray(json.data)) {
            json.data.forEach((timeBlock: any) => {
                if (timeBlock.tabs && Array.isArray(timeBlock.tabs)) {
                    timeBlock.tabs.forEach((tab: any) => {
                        if (tab.objects && Array.isArray(tab.objects)) {
                            tab.objects.forEach((obj: any) => {
                                // Try to determine instructor from object name or tab name
                                // This is heuristic since we don't have direct mapping yet
                                // But the UI filters by what we pass.
                                // We will capture the object ID as instructorId for now? 
                                // Or we try to map "Kuba" -> ID.
                                // IMPORTANT: Wizard uses instructor ID to matching.
                                // If I return "98197f..." (Object ID) as instructorId, it won't match "980c10..." (Jakub ID).
                                // I need to map Object -> Instructor.
                                // For now, I will return ALL slots and let the client filter?
                                // No, client filters based on selected instructor ID.
                                // I will attach the object name as a property if possible, or try to fuzzy match.

                                const instructorNameHint = (obj.name + " " + tab.name).toLowerCase();
                                let matchedInstructorId = '1'; // Default
                                if (instructorNameHint.includes('kuba') || instructorNameHint.includes('jakub')) {
                                    matchedInstructorId = '980c10620a0000200d1763cc33124be9'; // Jakub Prasil ID
                                } else if (instructorNameHint.includes('radim')) {
                                    matchedInstructorId = 'f29ad5a20a0000260161f3fa378844a6'; // Radim Zidek ID
                                } else if (instructorNameHint.includes('petra')) {
                                    matchedInstructorId = '2'; // Petra mock ID? Or real if found
                                }

                                if (obj.hours && Array.isArray(obj.hours)) {
                                    obj.hours.forEach((h: any) => {
                                        if (h.hourDetails && Array.isArray(h.hourDetails)) {
                                            h.hourDetails.forEach((detail: any) => {
                                                if (detail.reservationEnabled && detail.states && detail.states.includes('FREE')) {
                                                    parsedSlots.push({
                                                        start: detail.startTime, // 2026-01-30T15:30:00.000+0100
                                                        end: detail.endTime,
                                                        instructorId: matchedInstructorId,
                                                        activityId: activityId || '1' // Keep requested activity context
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }

        console.log(`[Clubspire] Parsed ${parsedSlots.length} slots from timeline.`);
        return parsedSlots;

    } catch (error) {
        console.error('[Clubspire] Slots Exception:', error);
        return [];
    }
}

export async function getClubspireDeposit(token: string): Promise<{ amount: number; currency: string } | null> {
    try {
        const response = await fetch(`${BASE_URL}/api/1.0/accounts/my/deposit`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error('[Clubspire] Get Deposit Failed:', await response.text());
            return null;
        }

        const json = await response.json();
        const data = json.data || json;

        if (!data) return null;

        return {
            amount: data.amount || 0,
            currency: data.currency || 'CZK'
        };
    } catch (error) {
        console.error('[Clubspire] Get Deposit Error:', error);
        return null;
    }
}

export async function createClubspireDepositPayment(token: string, amount: number): Promise<{ url: string } | null> {
    try {
        const response = await fetch(`${BASE_URL}/api/1.0/deposit/new/pay`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                lang: 'cs'
            }),
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error('[Clubspire] Create Payment Failed:', await response.text());
            return null;
        }

        const json = await response.json();
        console.log('[Clubspire] RAW Response:', JSON.stringify(json));

        // Response is { data: [ { url: '...' } ] }
        const data = json.data || json;

        // Check if data is array and has url, or object with url
        if (Array.isArray(data) && data[0] && data[0].url) {
            console.log('[Clubspire] Found URL in array:', data[0].url);
            return { url: data[0].url };
        }

        // Fallback for previous structure if any
        if (data && data.paymentEntity && data.paymentEntity.url) {
            return { url: data.paymentEntity.url };
        } else if (data && data.url) {
            return { url: data.url };
        }

        console.error('[Clubspire] Payment URL not found in response:', JSON.stringify(json));
        return null;
    } catch (error) {
        console.error('[Clubspire] Create Payment Error:', error);
        return null;
    }
}

export async function callClubspireApi(endpoint: string): Promise<any> {
    try {
        const token = await getAccessToken();
        const url = `${BASE_URL}${endpoint}`;
        console.log(`[Clubspire] Generic Call: ${url}`);

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return { error: response.status, text: await response.text() };
        }

        return await response.json();
    } catch (error) {
        return { exception: error };
    }
}

export async function getVerifiedSlotsText(person: string): Promise<string | null> {
    try {
        const token = await getAccessToken();
        const isKuba = person.toLowerCase() === "kuba";
        const targetTabIdx = isKuba ? 2 : 1; 

        type Block = { start: number, end: number };
        let currentDate = new Date();

        // Prohledáme až 12 "týdnů" (dávek o 7 pracovních dnech) do budoucnosti, dokud nenajdeme první volný den
        for (let batch = 0; batch < 12; batch++) {
            // Vygenerujeme dalších 7 pracovních dní
            const dates: Date[] = [];
            while (dates.length < 7) {
                const day = currentDate.getDay(); // 0 = neděle, 6 = sobota
                if (day !== 0 && day !== 6) {
                    const d = new Date(currentDate);
                    d.setHours(12, 0, 0, 0); // Bezpečný polední timestamp
                    dates.push(d);
                }
                // Posun o 1 den
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Hromadné paralelní stažení této dávky
            const dayResults: string[] = [];
            const fetchPromises = dates.map(async (d) => {
                const dateStr = d.toISOString().split('T')[0];
                const url = `${BASE_URL}/api/1.0/timeline/day?date=${dateStr}`;
                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    cache: 'no-store' // Extrémně důležité pro čerstvá data
                });
                if (!response.ok) return null;
                const json = await response.json();
                return { d, data: json.data };
            });

            // Čekáme na vyhodnocení celé dávky najednou
            const results = await Promise.all(fetchPromises);

            // Musíme projít výsledky v chronologickém pořadí, jak jsme je nasadili do `dates`!
            for (const res of results) {
                if (!res || !res.data || !Array.isArray(res.data)) continue;

                let dailyBlocks: Block[] = [];
                res.data.forEach((timeBlock: any) => {
                    if (timeBlock.tabs && Array.isArray(timeBlock.tabs)) {
                        let matchedTab = timeBlock.tabs.find((t: any) => t.tabIdx === targetTabIdx);
                        if (!matchedTab) {
                            const hint = isKuba ? "masérn" : "cvičebn";
                            matchedTab = timeBlock.tabs.find((t: any) => t.name && t.name.toLowerCase().includes(hint));
                        }
                        if (!matchedTab || !matchedTab.objects) return;

                        matchedTab.objects.forEach((obj: any) => {
                            if (obj.hours && Array.isArray(obj.hours)) {
                                obj.hours.forEach((h: any) => {
                                    if (h.hourDetails && Array.isArray(h.hourDetails)) {
                                        h.hourDetails.forEach((detail: any) => {
                                            const states = detail.states || [];
                                            const isFree = states.includes('FREE');
                                            const hasBlocker = states.some((s: string) => 
                                                ['FULL', 'BLOCKED', 'DISABLED', 'SEMI_FULL', 'MIXED'].includes(s.toUpperCase())
                                            );

                                            if (detail.reservationEnabled && isFree && !hasBlocker) {
                                                const startStr = detail.reservationStartTime || detail.startTime;
                                                const endStr = detail.endTime;
                                                if (startStr && endStr) {
                                                    dailyBlocks.push({
                                                        start: new Date(startStr).getTime(),
                                                        end: new Date(endStr).getTime()
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

                if (dailyBlocks.length === 0) continue;

                dailyBlocks.sort((a, b) => a.start - b.start);
                const merged: Block[] = [];
                for (const b of dailyBlocks) {
                    if (merged.length === 0) {
                        merged.push(b);
                    } else {
                        const last = merged[merged.length - 1];
                        if (b.start <= last.end) {
                            last.end = Math.max(last.end, b.end); // Sloučení bloků
                        } else {
                            merged.push(b);
                        }
                    }
                }

                // Filtr na sloty dlouhé minimálně 50 minut
                const validBlocks = merged.filter(b => (b.end - b.start) >= 50 * 60 * 1000);

                if (validBlocks.length > 0) {
                    const dayName = res.d.toLocaleDateString('cs-CZ', { weekday: 'long' });
                    const dateNum = res.d.getDate();
                    const monthNum = res.d.getMonth() + 1;
                    const yearNum = res.d.getFullYear();
                    const prefix = `${dayName} ${dateNum}. ${monthNum}. ${yearNum}`;

                    validBlocks.forEach(b => {
                        const strStart = new Date(b.start).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
                        const strEnd = new Date(b.end).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
                        dayResults.push(`- ${prefix}, ${strStart} až ${strEnd}`);
                    });
                }
            }

            // Jakmile na konci dávky máme termíny (třeba i ten z dalekého června),
            // vrátíme je a skener ukončí stahování do nekonečna.
            if (dayResults.length > 0) {
                return dayResults.join('\n');
            }
        }

        return null;
    } catch (e) {
        console.error('[Clubspire] getVerifiedSlotsText API Error:', e);
        return null;
    }
}
