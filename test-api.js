
const clientId = 'remedy';
const clientSecret = 'R0H0qkONoCnRKpCS';
// Removed /api prefix from baseUrl as per new authentication method
const baseUrl = 'https://rezervace.remedy.cz';

async function testApi() {
    console.log('Testing Clubspire API...');
    console.log(`Base URL: ${baseUrl}`);

    try {
        console.log('Attempting authentication (Correct Endpoint from Screenshot)...');
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);

        // CORRECT ENDPOINT from screenshot: /oauth/token (no /v2)
        const tokenUrl = `${baseUrl}/oauth/token`;
        console.log(`POST ${tokenUrl}`);

        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (!tokenResponse.ok) {
            const text = await tokenResponse.text();
            throw new Error(`Auth failed: ${tokenResponse.status} ${text}`);
        }

        const tokenData = await tokenResponse.json();
        console.log('Authentication successful!');
        console.log('Access Token obtained:', tokenData.access_token ? 'YES' : 'NO');

        const accessToken = tokenData.access_token;
        if (!accessToken) throw new Error('No access token in response');

        const endpointsToProbe = [
            // Verified from Documentation (https://clubspireapi.docs.apiary.io/)
            '/api/1.0/company-branch',
            '/api/1.0/activities',
            '/api/1.0/instructors',
            '/api/1.0/timeline/day?date=' + new Date().toISOString().split('T')[0],
            '/api/user/me'
        ];

        console.log('--- Probing API Endpoints ---');

        for (const endpoint of endpointsToProbe) {
            const url = `${baseUrl}${endpoint}`;
            console.log(`Trying: ${url}`);
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                console.log(`Status: ${response.status}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('SUCCESS! Full Data:', JSON.stringify(data, null, 2));
                } else {
                    const text = await response.text();
                    console.log(`Failed with ${response.status}: ${text.substring(0, 200)}`);
                }
            } catch (e) {
                console.log(`Error fetching ${url}: ${e.message}`);
            }
            console.log('---');
        }

    } catch (error) {
        console.error('API Test Failed:', error);
    }
}

testApi();
