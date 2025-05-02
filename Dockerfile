# 構建階段
FROM node:18.18-alpine AS builder
WORKDIR /app

# 安裝依賴階段 - 利用緩存
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# 構建階段
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 運行階段
FROM node:18.18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 8080

# 複製必要檔案，確保包含 package.json 相關檔案
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules

# 只安裝生產環境依賴
RUN npm prune --production

EXPOSE 8080
CMD ["node", "server.js"]
