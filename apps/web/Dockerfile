# Этап 1: Сборка
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/db/package.json ./packages/db/
COPY apps/web/package.json ./apps/web/
RUN npm ci
COPY . .

# Принимаем переменную из Dockhost при сборке
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build --workspace=apps/web

# Этап 2: Запуск
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3001
ENV PORT=3001
CMD ["node", "apps/web/server.js"]