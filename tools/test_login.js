// Native fetch in Node 18+

const BASE_URL = 'https://rezervace.remedy.cz';
const CLIENT_ID = 'remedy';
const CLIENT_SECRET = 'R0H0qkONoCnRKpCS';

async function testLogin() {
    console.log('Testing login with credentials...');

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

        // Test Profile Endpoints
        const endpoints = [
            '/api/1.0/users/me',
            '/api/1.0/user/me',
            '/api/1.0/me',
            '/api/1.0/users/profile',
            '/api/1.0/clients/me'
        ];

        for (const ep of endpoints) {
            console.log(`\nTesting endpoint: ${ep}`);
            const res = await fetch(`${BASE_URL}${ep}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Status: ${res.status}`);
            if (res.ok) {
                console.log('SUCCESS! Body found at', ep);
                console.log(await res.text());
                break; // Found it
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testLogin();
