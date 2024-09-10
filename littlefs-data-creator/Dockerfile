FROM node:22.0.0-bookworm
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3001
ENTRYPOINT ["node", "index.js"]
