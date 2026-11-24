import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ inviteToken: string }> }
) {
  try {
    const { inviteToken } = await params;
    const cleanToken = inviteToken.split(/[^a-zA-Z0-9]/)[0];

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Запрашиваем данные события
    const res = await fetch(`${apiUrl}/i/${cleanToken}`, { cache: 'no-store' });
    if (!res.ok) return new Response('Event not found', { status: 404 });

    const data = await res.json();
    const { event } = data;

    const formattedDate = new Date(event.dateTime).toLocaleString('ru-RU', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
    });

    const title = event.title || 'Приглашение';
    const location = event.location || '';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bsbt-d92r-y79f.gw-1a.dockhost.net';

    // 👇 ЧИТАЕМ ШРИФТ ЛОКАЛЬНО (ЭТО РАБОТАЕТ МГНОВЕННО)
    const fontPath = path.join(process.cwd(), 'apps/web/public/fonts/Montserrat-Bold.ttf');
    const fontData = fs.readFileSync(fontPath);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a',
            backgroundImage: event.coverImage ? `url(${baseUrl}${event.coverImage})` : 'none',
            backgroundSize: 'cover', backgroundPosition: 'center',
            fontFamily: 'Montserrat', padding: '80px',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, textAlign: 'center' }}>
            <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, color: 'white', marginBottom: '24px', lineHeight: 1.2, textAlign: 'center' }}>
              {title}
            </div>
            <div style={{ display: 'flex', fontSize: 40, color: '#e5e5e5', marginBottom: '12px' }}>
              {formattedDate}
            </div>
            {location && (
              <div style={{ display: 'flex', fontSize: 36, color: '#a3a3a3' }}>
                📍 {location}
              </div>
            )}
          </div>

          <div style={{ position: 'absolute', bottom: '40px', right: '60px', display: 'flex', fontSize: 32, color: 'rgba(255,255,255,0.5)', fontWeight: 700, zIndex: 10 }}>
            Зови
          </div>
        </div>
      ),
      {
        width: 1200, height: 630,
        fonts: [{ name: 'Montserrat', data: fontData, style: 'normal', weight: 700 }],
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}