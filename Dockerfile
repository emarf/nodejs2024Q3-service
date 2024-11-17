FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

FROM node:20-alpine AS final

WORKDIR /app
COPY --from=builder /app /app

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]
