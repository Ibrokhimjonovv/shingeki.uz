# Dockerfile - Vite static sayt uchun
FROM node:20-alpine AS builder

WORKDIR /app

# Package fayllarini nusxalash
COPY package*.json ./

# BARCHA dependensiyalarni o'rnatish (devDependencies ham)
RUN npm ci

# Source kodlarni nusxalash
COPY . .

# Build qilish (Vite)
RUN npm run build

# ============ PRODUCTION STAGE ============
FROM nginx:alpine AS production

# Nginx konfiguratsiyasi
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build natijasini nusxalash
COPY --from=builder /app/dist /usr/share/nginx/html

# Sitemap va robots.txt ni nusxalash (agar mavjud bo'lsa)
RUN --mount=type=bind,from=builder,source=/app/public,target=/public \
    if [ -f /public/sitemap.xml ]; then cp /public/sitemap.xml /usr/share/nginx/html/; fi || true && \
    if [ -f /public/robots.txt ]; then cp /public/robots.txt /usr/share/nginx/html/; fi || true

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
