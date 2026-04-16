// Native fetch in Node 18+

const BASE_URL = 'https://rezervace.remedy.cz';
const CLIENT_ID = 'remedy';
const CLIENT_SECRET = 'R0H0qkONoCnRKpCS';

async function testUserEndpoints() {
    console.log('Testing User Endpoints...');

    // Credentials provided by user
    const username = 'kuba';
    const password = 'Workout8';

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('username', username);
    params.append('password', password);

    try {
        const response = await fetch(`${BASE_URL}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!response.ok) {
            console.log('Login failed:', response.status, await response.text());
            return;
        }

        const data = await response.json();
        const token = data.access_token;
        console.log('Login Success! Token obtained.');

        // 1. Discovery for Bookings / Reservations
        // Try to find where reservations are
        const bookingEndpoints = [
            '/api/1.0/users/me/reservations',
            '/api/1.0/users/me/bookings',
            '/api/1.0/reservations/me',
            '/api/1.0/my/reservations',
            '/api/1.0/users/current/reservations',
            '/api/1.0/reservations' // might fetch for current user
        ];

        let bookingEndpointFound = false;

        console.log('\n--- TESTING BOOKING ENDPOINTS ---');
        for (const ep of bookingEndpoints) {
            console.log(`Checking: ${ep}`);
            const res = await fetch(`${BASE_URL}${ep}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Status: ${res.status}`);
            if (res.ok) {
                console.log('SUCCESS! Reservations found at', ep);
                const text = await res.text();
                console.log(text.substring(0, 500) + '...');
                bookingEndpointFound = true;
                break;
            }
        }

        // 2. Test Profile Update (Simulation)
        // We won't actually change data to something random, but we can try to GET first and then PUT same data or check if PUT endpoint exists
        console.log('\n--- TESTING UPDATE PROFILE ---');
        // We know /api/1.0/users/me works for GET. Let's see if it accepts PUT.
        // We need to fetch current info first to avoid destructive changes if we were to really call it.
        // But for safe checking, we can just try OPTIONS or send invalid data to see 400 instead of 404/405.

        // Let's try to fetch me first
        const meRes = await fetch(`${BASE_URL}/api/1.0/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (meRes.ok) {
            console.log('Fetched current profile successfully.');
            const meData = await meRes.json();
            const user = Array.isArray(meData.data) ? meData.data[0] : meData.data;
            const userId = user.id || user.customerId;
            console.log('User ID:', userId);

            // Now test /users/{id}/reservations since "me" failed
            if (userId) {
                const userEndpoints = [
                    `/api/1.0/users/${userId}/reservations`,
                    `/api/1.0/reservations?userId=${userId}`,
                    `/api/1.0/reservations?${encodeURIComponent('filter[userId]')}=${userId}`,
                    `/api/1.0/reservations?${encodeURIComponent('filter[customerId]')}=${userId}`,
                    `/api/1.0/accounts/my/reservations`,
                    `/api/1.0/users/reservations`,
                    `/api/1.0/reservations` // List all?
                ];

                console.log('\n--- TESTING USER ID SPECIFIC ENDPOINTS ---');
                for (const ep of userEndpoints) {
                    console.log(`Checking: ${ep}`);
                    const res = await fetch(`${BASE_URL}${ep}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(`Status: ${res.status}`);
                    if (res.ok) {
                        console.log('SUCCESS! Reservations found at', ep);
                        const text = await res.text();
                        console.log(text.substring(0, 500) + '...');
                    } else if (res.status === 400 || res.status === 500) {
                        console.log('ERROR BODY:', await res.text());
                    }
                }
            }

            // Try PUT with same data (safe-ish update)
            const updateUrl = `${BASE_URL}/api/1.0/users/${user.id || 'me'}`;
            console.log(`Test PUT to ${updateUrl}`);

            // We won't execute the PUT here to avoid risk, but identifying the ID is good.
            // If we really want to test, we can try to update 'note' if available.
        } else {
            console.log('Failed to fetch profile for update test.');
        }


    } catch (error) {
        console.error('Error:', error);
    }
}

testUserEndpoints();
