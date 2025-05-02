# 依賴階段
FROM node:18.18-alpine AS deps
WORKDIR /app

# 複製必要檔案
COPY package*.json ./
COPY prisma ./prisma/

# 安裝依賴
RUN npm ci

# 構建階段
FROM node:18.18-alpine AS builder
WORKDIR /app

# 複製依賴和設定檔
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# 複製源代碼
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1

# 執行建構
RUN npm run build

# 生產環境階段
FROM node:18.18-alpine AS runner
WORKDIR /app

# 安全性增強：創建非 root 用戶
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 設置環境變量
ENV NODE_ENV production
ENV PORT 8080
ENV NEXT_TELEMETRY_DISABLED 1

# 智能複製：僅複製必要檔案
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# 由於您使用了 Prisma，需要確保生產環境可以運行
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# 切換到非 root 用戶
USER nextjs

EXPOSE 8080

# Next.js standalone 模式會自動生成 server.js
CMD ["node", "server.js"]
