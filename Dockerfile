FROM oven/bun:1.3 AS deps
WORKDIR /app
COPY bunfig.toml ./
COPY apps/web/package.json ./apps/web/
RUN cd apps/web && bun install

FROM node:22-alpine AS builder
WORKDIR /app
ARG VITE_API_URL=http://localhost:8788
ENV VITE_API_URL=$VITE_API_URL
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .
RUN cd apps/web && npx vite build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/web/.output ./.output
COPY --from=builder /app/apps/web/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./package.json

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]