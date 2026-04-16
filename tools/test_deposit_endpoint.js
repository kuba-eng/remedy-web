// Native fetch in Node 18+

const BASE_URL = 'https://rezervace.remedy.cz';
const CLIENT_ID = 'remedy';
const CLIENT_SECRET = 'R0H0qkONoCnRKpCS';

async function testDepositEndpoint() { // Renamed from testDepositPayment to avoid conflict
    console.log('Testing Deposit Endpoint...');

    // Credentials
    const username = 'kuba';
    const password = 'Workout8';

    // 1. Get Token
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('username', username);
    params.append('password', password);

    let token = '';

    try {
        const loginRes = await fetch(`${BASE_URL}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!loginRes.ok) {
            console.error('Login Failed.');
            return;
        }

        const loginData = await loginRes.json();
        token = loginData.access_token;
        console.log('Token obtained.');
    } catch (e) {
        console.error('Login Error:', e);
        return;
    }

    // 2. Test Deposit Balance
    try {
        console.log('Fetching deposit balance...');
        const start = Date.now();
        const res = await fetch(`${BASE_URL}/api/1.0/accounts/my/deposit`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        });
        const duration = Date.now() - start;
        console.log(`Fetch took ${duration}ms`);
        console.log(`Status: ${res.status}`);

        const text = await res.text();
        console.log('Response:', text);

    } catch (e) {
        console.error('Balance Error:', e);
    }
}

testDepositEndpoint();
