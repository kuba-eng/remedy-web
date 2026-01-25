import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, category } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // --- SIMULATION OF EMAIL SENDING ---
        // In a real application, you would add Resend, Mailgun, or SendGrid logic here.
        // For now, we log it to the server console so the admin sees it.

        console.log("---------------------------------------------------");
        console.log("🔥 NEW REMEDY SUBSCRIBER 🔥");
        console.log("Email:", email);
        console.log("Interest Category:", category || 'General');
        console.log("Timestamp:", new Date().toISOString());
        console.log("---------------------------------------------------");

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({ success: true, message: "Subscribed successfully" });

    } catch (error) {
        console.error("Subscription error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
