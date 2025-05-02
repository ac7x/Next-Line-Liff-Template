# === Build stage ===
FROM node:18.18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# === Production stage ===
FROM node:18.18-alpine AS runner
WORKDIR /app

# 只帶 node_modules + .next + package.json (不用把全部 source 帶進 production)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
CMD ["npm", "start"]
