const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

// 1. Manually load env
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const match = envContent.match(/RESEND_API_KEY=(.+)/);
if (!match) {
    console.error('❌ Could not find RESEND_API_KEY in .env.local');
    process.exit(1);
}

const API_KEY = match[1].trim();
console.log(`Using API Key: ${API_KEY.slice(0, 5)}...`);

const resend = new Resend(API_KEY);

(async () => {
    try {
        console.log('📨 Sending test email...');
        const data = await resend.emails.send({
            from: 'Remedy Web Test <info@remedy.cz>',
            to: 'kuba@remedy.cz',
            subject: 'Testovací email z Remedy Web',
            html: '<strong>Funguje to!</strong> Toto je testovací zpráva pro ověření API klíče.'
        });

        if (data.error) {
            console.error('❌ Send failed:', data.error);
        } else {
            console.log('✅ Email sent successfully!', data);
        }
    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
})();
