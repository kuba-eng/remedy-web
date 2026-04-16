
import { NextResponse } from 'next/server';
import { callClubspireApi } from '@/actions/clubspire';

export async function GET() {
    try {
        console.log("DEBUG: Radim Hunt...");

        // 1. Probe Products 
        // Common paths: /products, /api/1.0/products, /api/1.0/activities/{id}/products
        const productsProbe = await callClubspireApi('/api/1.0/products');
        // Try activity-based products?
        const masazeId = '980cda8b0a00002021814331c392684e';
        const actProducts = await callClubspireApi(`/api/1.0/activities/${masazeId}/products`);

        // 2. Scan timeline for non-Kuba objects
        const today = new Date();
        const suspiciousObjects: any[] = [];

        // Scan 7 days
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];

            // Raw call to check names
            const json = await callClubspireApi(`/api/1.0/timeline/day?date=${dateStr}`);

            if (json.data && Array.isArray(json.data)) {
                json.data.forEach((block: any) => {
                    if (block.tabs) {
                        block.tabs.forEach((tab: any) => {
                            if (tab.objects) {
                                tab.objects.forEach((obj: any) => {
                                    const name = obj.name.toLowerCase();
                                    if (!name.includes('kuba') && !name.includes('jakub')) {
                                        // Found something not Kuba!
                                        suspiciousObjects.push({ date: dateStr, name: obj.name, id: obj.id });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }

        return NextResponse.json({
            status: 'ok',
            products_probe: productsProbe,
            act_products_probe: actProducts,
            non_kuba_objects: suspiciousObjects
        });
    } catch (error: any) {
        return NextResponse.json({ status: 'error', msg: error.message });
    }
}
