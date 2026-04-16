const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

// Load API Key
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/RESEND_API_KEY=(.+)/);
if (!match) { console.error('No API Key'); process.exit(1); }
const API_KEY = match[1].trim();

const resend = new Resend(API_KEY);

(async () => {
    try {
        console.log("🔍 Checking domains for remedy.cz...");
        const list = await resend.domains.list();

        const existing = list.data ? list.data.data.find(d => d.name === 'remedy.cz') : null;

        if (existing) {
            console.log(`✅ Domain remedy.cz found (ID: ${existing.id})`);
            console.log(`Status: ${existing.status}`);

            // Get details (DNS records)
            const details = await resend.domains.get(existing.id);
            if (details.data) {
                printDnsRecords(details.data.records);
            }
        } else {
            console.log("⚠️ Domain not found. Creating remedy.cz...");
            const created = await resend.domains.create({ name: 'remedy.cz' });

            if (created.data) {
                console.log("✅ Domain created successfully!");
                // Get records for the new domain
                const details = await resend.domains.get(created.data.id);
                if (details.data) {
                    printDnsRecords(details.data.records);
                }
            } else {
                console.error("❌ Failed to create domain:", created.error);
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
})();

function printDnsRecords(records) {
    if (!records) return;
    console.log("\n📝 --- DNS RECORDS TO ADD (Action Required) ---");
    console.log("Přidej tyto záznamy do DNS u svého registrátora (Wedos, Forpsi...):\n");

    records.forEach(r => {
        console.log(`Type: ${r.record || r.type}`); // SDK sometimes differs in naming
        console.log(`Name: ${r.name}`);
        console.log(`Value: ${r.value}`);
        console.log(`Priority: ${r.priority || 'N/A'}`);
        console.log("---------------------------------------------------");
    });
    console.log("\n⏳ Po přidání může ověření trvat až 24h (obvykle minuty).");
}
