# Используем Node.js 20 (легкую версию)
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json для установки зависимостей (монорепозиторий)
COPY package.json package-lock.json ./
COPY packages/db/package.json ./packages/db/
COPY apps/api/package.json ./apps/api/

# Устанавливаем все зависимости
RUN npm ci

# Копируем весь исходный код
COPY . .

# Открываем порт (Dockhost сам прокинет его)
EXPOSE 3000

# Команда запуска API
CMD ["npm", "run", "dev", "--workspace=apps/api"]
