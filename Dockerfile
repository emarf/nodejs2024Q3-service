FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

FROM node:20-alpine AS final

WORKDIR /app
COPY --from=builder /app /app

CMD ["sh", "-c", "npm run start:dev:docker"]
