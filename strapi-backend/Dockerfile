# Creating multi-stage build for production
FROM node:18-alpine3.17 as base

FROM base as deps
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

WORKDIR /app

COPY package*.json ./
RUN npm ci

WORKDIR /app/src/plugins/thingsboard-plugin
COPY package*.json ./
RUN npm ci

ENV PATH /app/node_modules/.bin:$PATH

FROM base as build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG STRAPI_URL=localhost:1337
ENV STRAPI_URL=${STRAPI_URL}

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

WORKDIR /app/src/plugins/thingsboard-plugin
COPY --from=deps /app/src/plugins/thingsboard-plugin/node_modules ./node_modules

COPY src/plugins/thingsboard-plugin ./
RUN npm run build

WORKDIR /app
COPY . .
RUN npm run build

FROM base as runtime
RUN apk add --no-cache vips-dev

WORKDIR /opt/app

ENV PATH /opt/node_modules/.bin:$PATH

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG STRAPI_URL=localhost:1337
ENV STRAPI_URL=${STRAPI_URL}

COPY --from=build /app ./

USER node

EXPOSE 1337
CMD npm run start
