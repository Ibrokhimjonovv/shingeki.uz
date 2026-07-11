// vite.config.js
import { defineConfig } from 'vite';
import Sitemap from 'vite-plugin-sitemap';

// API dan dinamik yo'nalishlarni olish funksiyasi
async function getDynamicRoutes() {
    try {
        const res = await fetch('https://bk.afd-platform.uz/afd-platform/backend/urls/all-movies/all/');
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();

        // Ma'lumotlarni tahlil qilish
        let movies = [];
        if (Array.isArray(data)) {
            movies = data;
        } else if (data.results) {
            movies = data.results;
        } else if (data.data) {
            movies = data.data;
        } else {
            movies = Object.values(data);
        }

        console.log(`📊 ${movies.length} ta anime topildi`);

        // Dinamik yo'nalishlar yaratish
        return movies.map(film => {
            const id = film.mcrntindx || film.id;
            return `/anime/${id}`;
        });
    } catch (error) {
        console.error('❌ Dinamik yo\'nalishlarni yuklashda xato:', error);
        return [];
    }
}

// MUHIM: defineConfig ni async qilib o'zgartirish
export default defineConfig(async () => {
    const dynamicRoutes = await getDynamicRoutes();

    return {
        server: {
            port: 5173,
            open: false
        },
        plugins: [
            Sitemap({
                hostname: 'https://shingeki.uz',
                // Statik yo'nalishlar
                routes: [
                    '/',
                    '/all-animes',
                    '/favorites',
                    '/search',
                ],
                // Dinamik yo'nalishlar (API dan olingan)
                dynamicRoutes: dynamicRoutes,
                // Chiqarib tashlash kerak bo'lgan yo'nalishlar
                exclude: ['/404', '/admin'],
                // Qo'shimcha sozlamalar
                changefreq: 'weekly',
                priority: 0.8,
                // Sitemap indeksi (agar ko'p sitemap bo'lsa)
                // sitemapIndex: true,
                // Sitemap fayli nomi
                filename: 'sitemap.xml',
                // XML header
                xmlHeader: '<?xml version="1.0" encoding="UTF-8"?>',
                // URLset xmlns
                urlset: {
                    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
                    'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
                },
            }),
        ],
        build: {
            outDir: 'dist',
            // ...
        }
    };
});