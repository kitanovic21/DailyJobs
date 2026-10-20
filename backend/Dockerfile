# ---------- zajednicka baza ----------
FROM node:24-slim AS base
WORKDIR /app
COPY package*.json ./

# ---------- razvoj (koristi ga docker-compose) ----------
FROM base AS dev
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ---------- build za produkciju ----------
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# ---------- produkcija (samo za deploy) ----------
FROM node:24-slim AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
USER node
CMD ["node", "dist/main.js"]
