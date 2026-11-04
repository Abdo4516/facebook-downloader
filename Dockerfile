FROM node:20-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install Python 3, ffmpeg, and SSL certificates
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 ffmpeg ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]