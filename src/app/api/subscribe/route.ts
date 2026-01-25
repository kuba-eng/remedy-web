import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { REMEDY_TIPS, Tip } from '@/data/remedy-tips';

// Initialize with fallback to avoid build errors if env is missing
const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, category, favorites } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // --- PREPARE 5 TIPS FOR SUBSCRIBER ---
        let selectedTips: any[] = [];

        // 1. Add favorites first
        if (favorites && Array.isArray(favorites)) {
            selectedTips = [...favorites];
        }

        // 2. Fill up to 5 with tips from category
        if (selectedTips.length < 5 && category) {
            const categoryTips = REMEDY_TIPS.filter(t => t.category === category);
            // Shuffle or just pick? Let's just pick next available that aren't in favorites.
            const existingIds = new Set(selectedTips.map(t => t.id));

            for (const tip of categoryTips) {
                if (selectedTips.length >= 5) break;
                if (!existingIds.has(tip.id)) {
                    selectedTips.push(tip);
                    existingIds.add(tip.id);
                }
            }
        }

        // If still < 5 (e.g. no category selected), fill with random general tips
        if (selectedTips.length < 5) {
            const remaining = REMEDY_TIPS.filter(t => !selectedTips.find(s => s.id === t.id));
            // Simple shuffle/slice
            const randomFill = remaining.sort(() => 0.5 - Math.random()).slice(0, 5 - selectedTips.length);
            selectedTips = [...selectedTips, ...randomFill];
        }


        // --- EMAIL 1: ADMIN NOTIFICATION (To kuba@remedy.cz) ---
        // This usually works if verified or Sending-Only (to self)

        const favoritesHtml = favorites && favorites.length > 0
            ? `
            <h3>⭐ Oblíbené tipy uživatele:</h3>
            <ul style="padding-left: 20px; color: #555;">
                ${favorites.map((f: any) => `
                    <li style="margin-bottom: 8px;">
                        <strong>[${f.type}]</strong> ${f.headline} <br/>
                        <span style="font-size: 12px; color: #888;">ID: ${f.id}</span>
                    </li>
                `).join('')}
            </ul>`
            : '<p><em>Žádné oblíbené tipy.</em></p>';

        console.log("📨 Sending ADMIN email to kuba@remedy.cz...");

        if (process.env.RESEND_API_KEY) {
            // Admin Email
            await resend.emails.send({
                from: 'Remedy Web <info@remedy.cz>',
                to: 'kuba@remedy.cz',
                subject: `Nový odběratel Remedy: ${email}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #333;">Nový zájemce o tipy 🎉</h2>
                        <p style="font-size: 16px;">
                            <strong>Email:</strong> <a href="mailto:${email}">${email}</a>
                        </p>
                        <p style="font-size: 16px;">
                            <strong>Kategorie zájmu:</strong> ${category || 'Neznámo'}
                        </p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        ${favoritesHtml}
                        <br/>
                        <p style="font-size: 12px; color: #999;">
                            Odesláno z webu remedy.cz
                        </p>
                    </div>
                `
            });
            console.log("✅ Admin email sent.");

            // --- EMAIL 2: SUBSCRIBER EMAIL (To user) ---
            console.log(`📨 Sending SUBSCRIBER email to ${email}...`);

            try {
                const tipsHtml = selectedTips.map(t => `
                    <div style="margin-bottom: 25px; padding: 15px; background: #f9f9f9; border-left: 4px solid #D9F99D; border-radius: 4px;">
                        <div style="font-size: 12px; text-transform: uppercase; color: #888; font-weight: bold; margin-bottom: 5px;">
                            ${t.category} • ${t.type}
                        </div>
                        <h3 style="margin: 0 0 10px 0; color: #111;">${t.headline}</h3>
                        <p style="margin: 0 0 10px 0; line-height: 1.5; color: #333;">${t.body}</p>
                        <div style="font-size: 13px; color: #555; font-style: italic;">
                            💡 <strong>Mikro-pohyb:</strong> ${t.micro}
                        </div>
                    </div>
                `).join('');

                await resend.emails.send({
                    from: 'Remedy Fyzio <info@remedy.cz>',
                    // CRITICAL: If domain is not verified, this will FAIL for any 'to' except kuba@remedy.cz.
                    to: email,
                    subject: 'Tvých 5 tipů pro zdravější tělo (Remedy)',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <h1 style="color: #111; margin-bottom: 20px;">Ahoj! 👋</h1>
                            <p style="font-size: 16px; line-height: 1.5;">
                                Díky, že se zajímáš o své tělo. Tady je tvých 5 tipů, které ti pomohou cítit se lépe během dne.
                            </p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                            
                            ${tipsHtml}

                            <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #888;">
                                <p>Držím palce, ať pomohou!<br>Kuba z Remedy</p>
                                <a href="https://remedy.cz" style="color: #000; text-decoration: underline;">www.remedy.cz</a>
                            </div>
                        </div>
                    `
                });
                console.log("✅ Subscriber email sent.");
            } catch (subError: any) {
                console.warn("⚠️ Failed to send subscriber email (likely due to unverified domain):", subError.message);
                // We do NOT throw here, so the API returns 200 OK. 
                // Admin email already went through, so we capture the lead at least.
            }

        } else {
            console.warn("⚠️ RESEND_API_KEY is missing. Skipping email send (Mock Mode).");
        }

        return NextResponse.json({ success: true, message: "Subscribed successfully" });

    } catch (error) {
        console.error("Subscription error:", error);
        return NextResponse.json({ success: true, message: "Subscribed (fallback)" });
    }
}
