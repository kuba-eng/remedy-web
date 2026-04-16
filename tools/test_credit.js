// Native fetch in Node 18+

const BASE_URL = 'https://rezervace.remedy.cz';
const CLIENT_ID = 'remedy';
const CLIENT_SECRET = 'R0H0qkONoCnRKpCS';

async function testCredit() {
    console.log('Testing Credit/Deposit endpoints...');

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
            console.log('Login failed');
            return;
        }

        const data = await response.json();
        const token = data.access_token;
        console.log('Login Success.');

        // Test Endpoints
        const endpoints = [
            '/api/1.0/users/me/credit',
            '/api/1.0/users/me/credits',
            '/api/1.0/users/me/account',
            '/api/1.0/users/me/accounts',
            '/api/1.0/users/me/wallet',
            '/api/1.0/client/credit',
            '/api/credits',
            // Also try grabbing ID from profile first?
            // Users often have /api/1.0/users/{id}/credit
        ];

        // First get ID
        let userId = null;
        const profileRes = await fetch(`${BASE_URL}/api/1.0/users/me`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });
        if (profileRes.ok) {
            const json = await profileRes.json();
            const userData = Array.isArray(json.data) ? json.data[0] : (json.data || json);
            userId = userData.id || userData.customerId;
            console.log('User ID:', userId);
            if (userId) {
                endpoints.push(`/api/1.0/users/${userId}/credit`);
                endpoints.push(`/api/1.0/users/${userId}/accounts`);
            }
        }

        for (const ep of endpoints) {
            console.log(`\nTesting: ${ep}`);
            const res = await fetch(`${BASE_URL}${ep}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Status: ${res.status}`);
            if (res.ok) {
                console.log('SUCCESS! Body:', await res.text());
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testCredit();
