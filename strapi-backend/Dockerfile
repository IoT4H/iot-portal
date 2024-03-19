# Creating multi-stage build for production
FROM node:18-alpine as base

FROM base as deps
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app/
# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN yarn config set network-timeout 600000 -g
ENV PATH /app/node_modules/.bin:$PATH


FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


ARG STRAPI_URL=localhost:1337
ENV STRAPI_URL=${STRAPI_URL}


RUN yarn build

# Creating final production image
FROM base as runtime
RUN apk add --no-cache vips-dev

WORKDIR /opt/app

COPY --from=build /app ./

ENV PATH /opt/node_modules/.bin:$PATH

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG STRAPI_URL=localhost:1337
ENV STRAPI_URL=${STRAPI_URL}

RUN chown -R node:node /opt/app
USER node
EXPOSE 1337
CMD ["yarn", "start "]
