# === Build stage ===
FROM node:18.18-alpine AS builder
WORKDIR /app

# Define build argument
ARG NEXT_PUBLIC_LIFF_ID

# 1️⃣ 先 COPY package.json + lock (確保 cache 命中率高)
COPY package.json package-lock.json ./ 
RUN npm ci

# 2️⃣ public 通常不常改，提早 COPY
COPY public ./public

# 3️⃣ 再 COPY 剩下 source code
COPY . . 
ENV NEXT_TELEMETRY_DISABLED=1
# Set environment variable from build argument before build command
ENV NEXT_PUBLIC_LIFF_ID=$NEXT_PUBLIC_LIFF_ID
RUN npm run build

# === Production stage ===
FROM node:18.18-alpine AS runner
WORKDIR /app

# 只帶必要文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Note: NEXT_PUBLIC_LIFF_ID is also needed at runtime for client-side code
# Remove the COPY command for .env.production
# COPY --from=builder /app/.env.production ./
# Configure NEXT_PUBLIC_LIFF_ID in Cloud Run service environment variables

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
CMD ["npm", "start"]
