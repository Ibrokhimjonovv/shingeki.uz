# Dockerfile - Vite static sayt uchun
FROM node:20-alpine AS builder

WORKDIR /app

# Package fayllarini nusxalash
COPY package*.json ./
RUN npm ci --only=production

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
COPY --from=builder /app/public/sitemap.xml /usr/share/nginx/html/sitemap.xml 2>/dev/null || true
COPY --from=builder /app/public/robots.txt /usr/share/nginx/html/robots.txt 2>/dev/null || true

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]