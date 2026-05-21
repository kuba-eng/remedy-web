
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { REMEDY_TIPS } from '@/data/remedy-tips';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tip = REMEDY_TIPS.find((t) => t.id === id);

    if (!tip) {
        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a0a', // Dark background
                        padding: '40px 80px',
                        fontFamily: 'sans-serif',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#D9F99D', marginRight: 20 }} />
                            <div style={{ fontSize: 36, letterSpacing: '8px', color: '#D9F99D', textTransform: 'uppercase', fontWeight: 900 }}>REMEDY</div>
                        </div>
                        <div style={{ fontSize: 90, fontWeight: 900, color: 'white', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 40 }}>
                            FYZIOTERAPIE<br/>A MANUÁLNÍ TERAPIE
                        </div>
                        <div style={{ fontSize: 32, color: '#a3a3a3', fontWeight: 300, letterSpacing: '1px' }}>
                            Prémiová péče o vaše tělo ve Žďáru nad Sázavou
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a', // Dark background
                    padding: '40px 80px',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: '1000px',
                    }}
                >
                    {/* Logo / Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#D9F99D', marginRight: 15 }} />
                        <div style={{ fontSize: 24, letterSpacing: '4px', color: '#D9F99D', textTransform: 'uppercase', fontWeight: 900 }}>REMEDY FYZIO</div>
                    </div>

                    {/* Category Label */}
                    <div
                        style={{
                            fontSize: 24,
                            color: '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            fontWeight: 700,
                            marginBottom: 20,
                            background: '#1a1a1a',
                            padding: '10px 20px',
                            borderRadius: '50px',
                            border: '1px solid #333',
                            display: 'flex',
                        }}
                    >
                        {tip.category.replace('_', ' ')}
                    </div>

                    {/* Headline */}
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 900,
                            color: 'white',
                            lineHeight: 1.1,
                            marginBottom: 30,
                        }}
                    >
                        {tip.headline}
                    </div>

                    {/* Micro Tip Preview */}
                    <div
                        style={{
                            fontSize: 32,
                            color: '#bbb',
                            lineHeight: 1.4,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ marginRight: 15 }}>💡</span> {tip.micro}
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 50,
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 20,
                        color: '#444',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                    }}
                >
                    www.remedy.cz
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
