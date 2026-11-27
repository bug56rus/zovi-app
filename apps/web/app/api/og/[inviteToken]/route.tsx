import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ inviteToken: string }> }
) {
  try {
    const { inviteToken } = await params;
    const cleanToken = inviteToken.split(/[^a-zA-Z0-9]/)[0];

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // 1. Получаем данные события
    const res = await fetch(`${apiUrl}/i/${cleanToken}`, { cache: 'no-store' });
    if (!res.ok) return new Response('Event not found', { status: 404 });

    const data = await res.json();
    const { event } = data;

    const title = event.title || 'Приглашение';
    const location = event.location || '';
    const formattedDate = new Date(event.dateTime).toLocaleString('ru-RU', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
    });

    // 2. Читаем шрифт локально (с проверкой)
    let fontData;
    const fontPath = path.join(process.cwd(), 'apps/web/public/fonts/Montserrat-Bold.ttf');
    
    if (fs.existsSync(fontPath)) {
      fontData = fs.readFileSync(fontPath);
    } else {
      // Если файла нет в контейнере, скачиваем напрямую с GitHub (надежный источник)
      const fontRes = await fetch('https://github.com/google/fonts/raw/main/ofl/montserrat/static/Montserrat-Bold.ttf');
      if (!fontRes.ok) throw new Error('Font not found');
      fontData = await fontRes.arrayBuffer();
    }

    // 3. Генерируем картинку
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a',
            fontFamily: 'Montserrat', padding: '80px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, textAlign: 'center' }}>
            <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, color: 'white', marginBottom: '24px', lineHeight: 1.2 }}>
              {title}
            </div>
            <div style={{ display: 'flex', fontSize: 40, color: '#e5e5e5', marginBottom: '12px' }}>
              {formattedDate}
            </div>
            {location && (
              <div style={{ display: 'flex', fontSize: 36, color: '#a3a3a3' }}>
                {location}
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200, height: 630,
        fonts: [{ name: 'Montserrat', data: fontData, style: 'normal', weight: 700 }],
      }
    );
  } catch (e: any) {
    console.error("OG Error:", e);
    return new Response(`Failed to generate the image: ${e.message}`, { status: 500 });
  }
}