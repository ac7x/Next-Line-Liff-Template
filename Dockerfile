# 依賴緩存階段
FROM node:18.18-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

# 使用 mount 功能掛載 npm cache，提高後續構建速度
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# 構建階段
FROM node:18.18-alpine AS builder
WORKDIR /app

# 從依賴階段複製 node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# 複製源代碼
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1

# 使用 mount 緩存進行構建
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

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

# 智能複製：僅複製必需文件
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# 智能安裝：僅安裝生產依賴
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production && \
    npm cache clean --force

# 切換到非 root 用戶
USER nextjs

# 健康檢查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

EXPOSE 8080

CMD ["node", "server.js"]
