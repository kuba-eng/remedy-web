
const clientId = 'remedy';
const clientSecret = 'R0H0qkONoCnRKpCS';
const baseUrl = 'https://rezervace.remedy.cz';

async function probeAuth() {
    console.log('--- Probing User Authentication ---');

    // 1. Try PASSWORD grant type (Login)
    console.log('\n1. Testing grant_type=password...');
    const loginParams = new URLSearchParams();
    loginParams.append('grant_type', 'password');
    loginParams.append('client_id', clientId);
    loginParams.append('client_secret', clientSecret);
    // We don't have a real user/pass yet, so we expect "Invalid credentials" (400/401)
    // NOT "Unsupported grant type" (400 with specific message)
    loginParams.append('username', 'test@test.cz');
    loginParams.append('password', 'test');

    try {
        const res = await fetch(`${baseUrl}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: loginParams
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${text.substring(0, 300)}`);
    } catch (e) {
        console.log('Error:', e.message);
    }

    // 2. Try to find Registration Endpoint
    // First getting app token
    console.log('\n2. Getting App Token for further probes...');
    let appToken = '';
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        const res = await fetch(`${baseUrl}/oauth/token`, { method: 'POST', body: params });
        const data = await res.json();
        appToken = data.access_token;
        console.log('App Token obtained.');
    } catch (e) {
        console.error('Failed to get app token');
        return;
    }

    // Probe common user creation endpoints
    const probes = [
        { method: 'POST', path: '/api/1.0/user' },
        { method: 'POST', path: '/api/user' },
        { method: 'POST', path: '/api/1.0/client' },
        { method: 'GET', path: '/api/1.0/user/me' }, // Check if 'me' exists for authenticated user
    ];

    console.log('\n3. Probing User Endpoints...');
    for (const p of probes) {
        try {
            const res = await fetch(`${baseUrl}${p.path}`, {
                method: p.method,
                headers: {
                    'Authorization': `Bearer ${appToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: p.method === 'POST' ? JSON.stringify({}) : undefined
            });
            console.log(`${p.method} ${p.path} -> ${res.status}`);
            if (res.status !== 404) {
                // If not 404, it might exist (even if 400 Bad Request or 403 Forbidden)
                console.log('POSSIBLE HIT:', await res.text().then(t => t.substring(0, 100)));
            }
        } catch (e) {
            console.log(`Error ${p.path}:`, e.message);
        }
    }
}

probeAuth();
