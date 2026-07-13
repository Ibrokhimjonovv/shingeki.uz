#!/bin/bash

echo "🔄 $(date): Sitemap yangilash boshlandi..."

cd /home/m/shingeki.uz

# GitHub'dan oxirgi o'zgarishlarni olish
echo "📥 GitHub'dan yangilanishlar olinmoqda..."
git pull origin main

# Eski konteynerni to'xtatish
echo "⏹️ Eski konteyner to'xtatilmoqda..."
docker stop shingeki-sitemap 2>/dev/null
docker rm shingeki-sitemap 2>/dev/null

# Yangi image build qilish
echo "🔨 Yangi image build qilinmoqda..."
docker build -t shingeki-sitemap .

# Yangi konteynerni ishga tushirish
echo "▶️ Yangi konteyner ishga tushirilmoqda..."
docker run -d \
  --name shingeki-sitemap \
  -p 1111:1111 \
  -e API_URL=https://bk.afd-platform.uz/afd-platform/backend/urls/tnall-animes/?no_pagination=true \
  -e PORT=1111 \
  --restart unless-stopped \
  shingeki-sitemap

# Tekshirish
echo "⏳ 5 soniya kutilmoqda..."
sleep 5

echo "✅ Tekshirilmoqda..."
docker ps | grep shingeki

echo "✅ $(date): Sitemap yangilash yakunlandi!"
