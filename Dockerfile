FROM node:18.18-alpine
WORKDIR /app

# 安裝依賴
COPY package*.json ./
COPY . .
RUN npm install

# 構建應用
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 設置環境變數
ENV NODE_ENV production
ENV PORT 8080

EXPOSE 8080
CMD ["npm", "start"]
