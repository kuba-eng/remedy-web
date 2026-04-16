import { NextRequest, NextResponse } from 'next/server';
import { ClubspireAdapter } from '@/lib/booking/adapters/clubspire-adapter';

// Cache for 1 hour
export const revalidate = 3600;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const serviceId = searchParams.get('service_id');

        const adapter = new ClubspireAdapter();
        const staff = await adapter.getStaff(serviceId || undefined);

        return NextResponse.json(staff);
    } catch (error) {
        console.error('[API] Staff Error:', error);
        return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
    }
}
