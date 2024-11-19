FROM node:current-bookworm-slim
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN chmod 777 -R ./mklittlefs

EXPOSE 3001
ENTRYPOINT ["node", "index.js"]
