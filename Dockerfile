# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG EXPO_PUBLIC_SERVER_IP
ARG EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

ENV EXPO_PUBLIC_SERVER_IP=$EXPO_PUBLIC_SERVER_IP
ENV EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=$EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

RUN npx expo export --platform web

# ---- Serve Stage ----
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
