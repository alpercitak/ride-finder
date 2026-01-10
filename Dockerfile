FROM node:25-alpine AS base

FROM base AS dependencies

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build
RUN npm prune --production

FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/index.js" ]