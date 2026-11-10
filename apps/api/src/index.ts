import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import * as dotenv from 'dotenv';
import { db, events, invites } from '@code/db';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

dotenv.config();

const app = Fastify({ logger: true });
app.register(cors, { 
  origin: 'https://bsbt-d92r-y79f.gw-1a.dockhost.net', 
  credentials: true 
});
app.register(cookie); // Подключаем cookie

// Генератор коротких токенов (8 символов)
const generateToken = () => crypto.randomBytes(4).toString('hex');

app.get('/health', async () => ({ status: 'ok', message: 'API is running' }));

// 1. Создание события (без авторизации)
app.post('/events', async (request, reply) => {
  const { title, dateTime, location, description, templateId, showGuests } = request.body as any;

  if (!title || !dateTime) {
    return reply.status(400).send({ error: 'title и dateTime обязательны' });
  }

  const adminToken = crypto.randomUUID();
  const publicToken = generateToken();

  const [newEvent] = await db.insert(events).values({
    id: crypto.randomUUID(),
    adminToken,
    publicToken,
    title,
    dateTime: new Date(dateTime),
    location,
    description,
    templateId: templateId || 'classic',
    showGuests: showGuests ?? true,
  }).returning();

  return { event: newEvent, adminToken, publicToken };
});

// 2. Генерация инвайтов (только для админа)
app.post('/events/:eventId/invites', async (request, reply) => {
  const { eventId } = request.params as { eventId: string };
  const { count } = request.body as { count: number };
  const adminToken = request.headers['x-admin-token'] as string;

  if (!count || count < 1) return reply.status(400).send({ error: 'Укажите count' });

  const event = await db.query.events.findFirst({ where: eq(events.id, eventId) });
  if (!event || event.adminToken !== adminToken) {
    return reply.status(403).send({ error: 'Доступ запрещен' });
  }

  const newInvites = Array.from({ length: count }).map(() => ({
    id: crypto.randomUUID(),
    eventId,
    inviteToken: generateToken(),
  }));

  await db.insert(invites).values(newInvites);

  return { invites: newInvites.map(i => ({ id: i.id, inviteToken: i.inviteToken })) };
});

// 2.5. Просмотр события организатором (для панели управления)
app.get('/events/:eventId', async (request, reply) => {
  const { eventId } = request.params as { eventId: string };
  const adminToken = request.headers['x-admin-token'] as string;

  // Проверка прав
  const event = await db.query.events.findFirst({ where: eq(events.id, eventId) });
  if (!event || event.adminToken !== adminToken) {
    return reply.status(403).send({ error: 'Доступ запрещен' });
  }

  // Получаем все инвайты для этого события
  const eventInvites = await db.query.invites.findMany({ 
    where: eq(invites.eventId, event.id),
    orderBy: (invites, { asc }) => [asc(invites.createdAt)]
  });

  return { 
    event, 
    invites: eventInvites.map(i => ({ 
      id: i.id, 
      inviteToken: i.inviteToken, 
      status: i.status, 
      updatedAt: i.updatedAt 
    })) 
  };
});



// 3. Публичный просмотр события гостем (по inviteToken)
app.get('/i/:inviteToken', async (request, reply) => {
  const { inviteToken } = request.params as { inviteToken: string };

  const invite = await db.query.invites.findFirst({ where: eq(invites.inviteToken, inviteToken) });
  if (!invite) return reply.status(404).send({ error: 'Приглашение не найдено' });

  const event = await db.query.events.findFirst({ where: eq(events.id, invite.eventId) });
  if (!event) return reply.status(404).send({ error: 'Событие не найдено' });

  // Получаем обезличенный список гостей (если разрешено)
  let guests: any[] = [];
  if (event.showGuests) {
    const allInvites = await db.query.invites.findMany({ where: eq(invites.eventId, event.id) });
    guests = allInvites.filter(i => i.status !== null).map(i => ({ status: i.status }));
  }

  return {
    event: { title: event.title, dateTime: event.dateTime, location: event.location, description: event.description, templateId: event.templateId, showGuests: event.showGuests },
    currentGuestStatus: invite.status,
    guests
  };
});

// 4. RSVP (Гость подтверждает участие)
app.post('/i/:inviteToken/rsvp', async (request, reply) => {
  const { inviteToken } = request.params as { inviteToken: string };
  const { status } = request.body as { status: 'going' | 'maybe' | 'not_going' };
  const cookieToken = request.cookies.guest_magic_token;

  if (!['going', 'maybe', 'not_going'].includes(status)) return reply.status(400).send({ error: 'Неверный статус' });

  const invite = await db.query.invites.findFirst({ where: eq(invites.inviteToken, inviteToken) });
  if (!invite) return reply.status(404).send({ error: 'Приглашение не найдено' });

  // Если у гостя уже есть magic_token в cookie для этого инвайта — обновляем
  if (cookieToken && invite.magicToken === cookieToken) {
    await db.update(invites).set({ status, updatedAt: new Date() }).where(eq(invites.id, invite.id));
    return { ok: true, status, magicToken: cookieToken };
  }

  // Иначе генерируем новый magic_token
  const magicToken = crypto.randomUUID();
  await db.update(invites).set({ status, magicToken, updatedAt: new Date() }).where(eq(invites.id, invite.id));

  // Ставим cookie (живет 1 год)
  reply.setCookie('guest_magic_token', magicToken, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 31536000 });

  return { ok: true, status, magicToken };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server listening on http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();