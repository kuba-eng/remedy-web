
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ClubspireAdapter } from '@/lib/booking/adapters/clubspire-adapter';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { service_id, staff_id, start_at, customer, notes } = body;

        // 1. Basic Validation
        if (!service_id || !start_at || !customer || !customer.email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const startTime = new Date(start_at);
        // Rough end time estimation (30 mins default if not fetched)
        // In real engine, we'd fetch service duration from DB/API
        const endTime = new Date(startTime.getTime() + 30 * 60000);

        // 2. Create PENDING Booking in Local DB
        // We use a transaction to ensure customer exists
        const booking = await prisma.$transaction(async (tx) => {
            // Find or Create Customer
            let cust = await tx.customer.findUnique({ where: { email: customer.email } });
            if (!cust) {
                cust = await tx.customer.create({
                    data: {
                        email: customer.email,
                        phone: customer.phone,
                        firstName: customer.first_name,
                        lastName: customer.last_name,
                    }
                });
            }

            // Create Booking
            return await tx.booking.create({
                data: {
                    referenceCode: `REM-${Date.now().toString(36).toUpperCase()}`,
                    serviceId: service_id,
                    serviceName: 'Service Name Placeholder', // Should fetch real name
                    staffId: staff_id,
                    startAt: startTime,
                    endAt: endTime,
                    durationMinutes: 30, // Default for now
                    customerId: cust.id,
                    status: 'PENDING',
                    notes: notes
                }
            });
        });

        // 3. Call External System (Clubspire)
        const adapter = new ClubspireAdapter();
        try {
            const externalRes = await adapter.createBooking({
                start: startTime,
                end: endTime,
                serviceId: service_id,
                staffId: staff_id,
                customer: {
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    email: customer.email,
                    phone: customer.phone,
                    note: notes
                }
            });

            // 4. Update to CONFIRMED
            const confirmedBooking = await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    status: 'CONFIRMED',
                    externalId: externalRes.id
                }
            });

            return NextResponse.json(confirmedBooking, { status: 201 });

        } catch (externalError) {
            console.error('[API] Clubspire Booking Failed:', externalError);
            // Mark as FAILED or keep PENDING for manual retry?
            // For MVP, mark as FAILED
            await prisma.booking.update({
                where: { id: booking.id },
                data: { status: 'FAILED' }
            });

            return NextResponse.json({
                error: 'Booking failed with external provider',
                reference: booking.referenceCode
            }, { status: 502 });
        }

    } catch (error) {
        console.error('[API] Create Booking Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
