# Creating multi-stage build for production
FROM node:18-alpine as base

FROM base as deps
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app/
# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci

WORKDIR /app/src/plugins/thingsboard-plugin
# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci

ENV PATH /app/node_modules/.bin:$PATH


FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

WORKDIR /app/src/plugins/thingsboard-plugin
COPY --from=deps /app/src/plugins/thingsboard-plugin/node_modules ./node_modules

COPY src/plugins/thingsboard-plugin ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

WORKDIR /app
COPY . .
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

# Creating final production image
FROM base as runtime
RUN apk add --no-cache vips-dev

WORKDIR /opt/app
ENV TZ=Europe/Berlin
COPY --from=build /app ./

ENV PATH /opt/node_modules/.bin:$PATH

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 1337
CMD npm run start
