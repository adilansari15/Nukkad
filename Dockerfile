# Monolith: Vite frontend + Express API. Build from repo root.

# --- Stage 1: build the SPA ---
FROM node:22-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY Frontend/package.json Frontend/package-lock.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY Frontend/ ./

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN npm run build


# --- Stage 2: build the API ---
FROM node:22-bookworm-slim AS backend-build

WORKDIR /app

COPY Backend/package.json Backend/package-lock.json ./
RUN npm install --no-audit --no-fund

COPY Backend/ ./

RUN npm run build


# --- Stage 3: production runtime ---
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY Backend/package.json Backend/package-lock.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --from=backend-build /app/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001

USER node

CMD ["node", "dist/index.js"]