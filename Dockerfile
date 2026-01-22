FROM oven/bun:1.3.6-slim AS base
WORKDIR /app

FROM base AS dependencies

RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS build
COPY --from=dependencies /temp/dev/node_modules node_modules
COPY . .
RUN bun run build

FROM base AS deploy
COPY --from=dependencies /temp/prod/node_modules node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json .

USER bun
EXPOSE 3000

ENTRYPOINT [ "bun", "run", "dist/index.js" ]