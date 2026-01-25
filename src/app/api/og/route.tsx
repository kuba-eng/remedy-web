
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
                        backgroundColor: '#0a0a0a',
                        color: 'white',
                    }}
                >
                    <div style={{ fontSize: 60, fontWeight: 'bold', color: '#D9F99D' }}>REMEDY</div>
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
                {/* Glow Effects */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-200px',
                        right: '-200px',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: '#D9F99D',
                        filter: 'blur(150px)',
                        opacity: 0.2,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-200px',
                        left: '-200px',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: '#D9F99D',
                        filter: 'blur(150px)',
                        opacity: 0.1,
                    }}
                />

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
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#D9F99D', marginRight: 15, boxShadow: '0 0 20px #D9F99D' }} />
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
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
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
                        width: '100%',
                        textAlign: 'center',
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
