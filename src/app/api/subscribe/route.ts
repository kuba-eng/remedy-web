import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize with fallback to avoid build errors if env is missing
const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, category, favorites } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

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

        console.log("📨 Sending email via Resend to info@remedy.cz...");

        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Remedy Web <onboarding@resend.dev>', // Default testing domain, user can change later if they verified domain
                to: 'info@remedy.cz',
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
            console.log("✅ Email sent successfully.");
        } else {
            console.warn("⚠️ RESEND_API_KEY is missing. Skipping email send (Mock Mode).");
        }

        return NextResponse.json({ success: true, message: "Subscribed successfully" });

    } catch (error) {
        console.error("Subscription error:", error);
        // Don't fail the request if email fails, just log it. Client side success is more important for UX.
        // But maybe return 500 if it's critical? For this use case, 200 is safer to keep user happy.
        return NextResponse.json({ success: true, message: "Subscribed (fallback)" });
    }
}
