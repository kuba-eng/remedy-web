import { NextResponse } from 'next/server';
import { ClubspireAdapter } from '@/lib/booking/adapters/clubspire-adapter';

// Cache for 1 hour to avoid hitting legacy API too often
export const revalidate = 3600;

export async function GET() {
    try {
        const adapter = new ClubspireAdapter();
        const services = await adapter.getServices();

        return NextResponse.json(services);
    } catch (error) {
        console.error('[API] Services Error:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}
