FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY prisma ./prisma/

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]
