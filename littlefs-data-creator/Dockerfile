FROM node:22.0.0-bookworm
WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3001
ENTRYPOINT ["node", "index.js"]
