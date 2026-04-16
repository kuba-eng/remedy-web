import { NextRequest, NextResponse } from 'next/server';
import { ClubspireAdapter } from '@/lib/booking/adapters/clubspire-adapter';

export const dynamic = 'force-dynamic'; // Always fetch live availability

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get('date');
        const serviceId = searchParams.get('service_id');
        const staffId = searchParams.get('staff_id');

        if (!dateStr) {
            return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 });
        }

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
        }

        const adapter = new ClubspireAdapter();
        // serviceId is optional but helpful for filtering
        // staffId is optional (if 'any', adapter handles it)

        const slots = await adapter.getSlots(date, serviceId || undefined, staffId || undefined);

        return NextResponse.json(slots);
    } catch (error) {
        console.error('[API] Availability Error:', error);
        return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
    }
}
