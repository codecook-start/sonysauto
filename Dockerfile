FROM oven/bun AS builder

WORKDIR /build

COPY package.json bun.lockb* ./

RUN bun install --force

COPY . .

RUN bun run build

FROM oven/bun AS runner

WORKDIR /app

COPY --from=builder /build/.next ./.next
COPY --from=builder /build/next.config.mjs* ./
COPY --from=builder /build/public ./public
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./
COPY --from=builder /build/bun.lockb* ./

EXPOSE 3000

CMD ["bun", "start"]