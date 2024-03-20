# Creating multi-stage build for production
FROM node:18-alpine as base

FROM base as deps
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

WORKDIR /app

COPY package*.json ./
RUN npm ci

WORKDIR /app/src/plugins/thingsboard-plugin
COPY package*.json ./
RUN npm ci


FROM base as build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

WORKDIR /app/src/plugins/thingsboard-plugin
COPY --from=deps /app/src/plugins/thingsboard-plugin/node_modules ./node_modules

COPY src/plugins/thingsboard-plugin ./
RUN npm run build


WORKDIR /app
COPY . .
RUN npm run build


EXPOSE 1337
CMD npm run start
