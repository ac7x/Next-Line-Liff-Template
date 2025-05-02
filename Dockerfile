# === Build stage ===
FROM node:18.18-alpine AS builder
WORKDIR /app

# 1️⃣ 先 COPY package.json + lock (確保 cache 命中率高)
COPY package.json package-lock.json ./
RUN npm ci

# 2️⃣ public 通常不常改，提早 COPY
COPY public ./public

# 3️⃣ 再 COPY 剩下 source code
COPY . .  
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# === Production stage ===
FROM node:18.18-alpine AS runner
WORKDIR /app

# 只帶必要文件
COPY --from=builder /app/package.json ./  
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
CMD ["npm", "start"]
