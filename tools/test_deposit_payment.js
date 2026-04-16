// Native fetch in Node 18+

const BASE_URL = 'https://rezervace.remedy.cz';
const CLIENT_ID = 'remedy';
const CLIENT_SECRET = 'R0H0qkONoCnRKpCS';

async function testDepositPayment() {
    console.log('Testing Deposit Payment...');

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
            console.error('Login Failed:', await loginRes.text());
            return;
        }

        const loginData = await loginRes.json();
        token = loginData.access_token;
        console.log('Token obtained.');
    } catch (e) {
        console.error('Login Error:', e);
        return;
    }

    // 2. Create Payment
    try {
        console.log('Creating payment for 100 CZK...');
        const res = await fetch(`${BASE_URL}/api/1.0/deposit/new/pay`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                amount: 100, // Small amount for test
                lang: 'cs'
            })
        });

        console.log(`Payment Status: ${res.status}`);
        const text = await res.text();
        console.log('Payment Response Body:', text);

        if (res.ok) {
            try {
                const json = JSON.parse(text);
                console.log('Parsed JSON:', JSON.stringify(json, null, 2));
            } catch (e) {
                console.log('Could not parse JSON');
            }
        }
    } catch (e) {
        console.error('Payment Error:', e);
    }
}

testDepositPayment();
