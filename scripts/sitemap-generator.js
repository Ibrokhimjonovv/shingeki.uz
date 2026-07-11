// // scripts/sitemap-generator.js
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const baseUrl = 'https://shingeki.uz';

// // API dan ma'lumot olish
// async function fetchData(endpoint) {
//     try {
//         const res = await fetch(`https://bk.afd-platform.uz/afd-platform/backend/urls/${endpoint}`);
//         if (!res.ok) throw new Error(`Status: ${res.status}`);
//         return await res.json();
//     } catch (error) {
//         console.error(`fetchData xato (${endpoint}):`, error);
//         return null;
//     }
// }

// function formatSitemapDate(date) {
//     if (!date) return new Date().toISOString().split('T')[0];
//     const d = new Date(date);
//     return d.toISOString().split('T')[0];
// }

// function generateSitemap(pages) {
//     return `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
//         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
// ${pages.map(({ url, lastModified, changeFrequency, priority }) => `
//     <url>
//         <loc>${url}</loc>
//         <lastmod>${lastModified}</lastmod>
//         <changefreq>${changeFrequency}</changefreq>
//         <priority>${priority}</priority>
//     </url>`).join('')}
// </urlset>`;
// }

// async function generateSitemapFile() {
//     try {
//         console.log('🔄 Sitemap yaratilmoqda...');

//         // Statik sahifalar
//         const staticPages = [
//             {
//                 url: baseUrl,
//                 lastModified: new Date().toISOString().split('T')[0],
//                 changeFrequency: 'daily',
//                 priority: 1.0
//             },
//             {
//                 url: `${baseUrl}/all-animes`,
//                 lastModified: new Date().toISOString().split('T')[0],
//                 changeFrequency: 'daily',
//                 priority: 0.9
//             },
//             {
//                 url: `${baseUrl}/favorites`,
//                 lastModified: new Date().toISOString().split('T')[0],
//                 changeFrequency: 'weekly',
//                 priority: 0.6
//             },
//             {
//                 url: `${baseUrl}/search`,
//                 lastModified: new Date().toISOString().split('T')[0],
//                 changeFrequency: 'weekly',
//                 priority: 0.7
//             }
//         ];

//         // API dan animelarni olish
//         const moviesData = await fetchData('all-movies/all/');
        
//         let movies = [];
//         if (moviesData) {
//             // API dan kelgan ma'lumotni tahlil qilish
//             if (Array.isArray(moviesData)) {
//                 movies = moviesData;
//             } else if (moviesData.results) {
//                 movies = moviesData.results;
//             } else if (moviesData.data) {
//                 movies = moviesData.data;
//             } else {
//                 movies = Object.values(moviesData);
//             }
//         }

//         console.log(`📊 ${movies.length} ta anime topildi`);

//         // Anime sahifalari
//         const moviePages = movies.map(film => {
//             const id = film.mcrntindx || film.id;
//             const created = film.created_at || film.updated_at || new Date();
            
//             return {
//                 url: `${baseUrl}/anime/${id}`,
//                 lastModified: formatSitemapDate(created),
//                 changeFrequency: 'weekly',
//                 priority: 0.8
//             };
//         });

//         // Barcha sahifalar
//         const allPages = [...staticPages, ...moviePages];
        
//         // Sitemap yaratish
//         const sitemapXml = generateSitemap(allPages);
        
//         // public papkasiga yozish
//         const outputPath = path.join(__dirname, '../public/sitemap.xml');
//         fs.writeFileSync(outputPath, sitemapXml);
        
//     } catch (error) {
//         console.error('❌ Sitemap yaratishda xatolik:', error);
//         process.exit(1);
//     }
// }

// // Ishga tushirish
// generateSitemapFile();

// scripts/sitemap-generator.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://shingeki.uz/#';

// API dan ma'lumot olish
async function fetchData(endpoint) {
    try {
        const res = await fetch(`https://bk.afd-platform.uz/afd-platform/backend/urls/${endpoint}`);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error(`fetchData xato (${endpoint}):`, error);
        return null;
    }
}

function formatSitemapDate(date) {
    if (!date) return new Date().toISOString().split('T')[0];
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

function generateSitemap(pages) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(({ url, lastModified, changeFrequency, priority }) => `
    <url>
        <loc>${url}</loc>
        <lastmod>${lastModified}</lastmod>
        <changefreq>${changeFrequency}</changefreq>
        <priority>${priority}</priority>
    </url>`).join('')}
</urlset>`;
}

async function generateSitemapFile() {
    try {
        console.log('🔄 Sitemap yaratilmoqda...');

        // Statik sahifalar
        const staticPages = [
            {
                url: baseUrl,
                lastModified: new Date().toISOString().split('T')[0],
                changeFrequency: 'daily',
                priority: 1.0
            },
            {
                url: `${baseUrl}/all-animes`,
                lastModified: new Date().toISOString().split('T')[0],
                changeFrequency: 'daily',
                priority: 0.9
            },
            {
                url: `${baseUrl}/favorites`,
                lastModified: new Date().toISOString().split('T')[0],
                changeFrequency: 'weekly',
                priority: 0.6
            },
            {
                url: `${baseUrl}/search`,
                lastModified: new Date().toISOString().split('T')[0],
                changeFrequency: 'weekly',
                priority: 0.7
            }
        ];

        // API dan animelarni olish
        const moviesData = await fetchData('all-movies/all/');
        
        let movies = [];
        if (moviesData) {
            if (Array.isArray(moviesData)) {
                movies = moviesData;
            } else if (moviesData.results) {
                movies = moviesData.results;
            } else if (moviesData.data) {
                movies = moviesData.data;
            } else {
                movies = Object.values(moviesData);
            }
        }

        console.log(`📊 ${movies.length} ta anime topildi`);

        // Anime sahifalari
        const moviePages = movies.map(film => {
            const id = film.mcrntindx || film.id;
            const created = film.created_at || film.updated_at || new Date();
            
            return {
                url: `${baseUrl}/anime/${id}`,
                lastModified: formatSitemapDate(created),
                changeFrequency: 'weekly',
                priority: 0.8
            };
        });

        // Barcha sahifalar
        const allPages = [...staticPages, ...moviePages];
        
        // Sitemap yaratish
        const sitemapXml = generateSitemap(allPages);
        
        // public papkasiga yozish
        const outputPath = path.join(__dirname, '../public/sitemap.xml');
        
        // public papkasi mavjudligini tekshirish
        const publicDir = path.join(__dirname, '../public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, sitemapXml, 'utf8');
        console.log(`✅ Sitemap yaratildi: ${outputPath}`);
        console.log(`📝 Fayl hajmi: ${fs.statSync(outputPath).size} bayt`);
        
    } catch (error) {
        console.error('❌ Sitemap yaratishda xatolik:', error);
        process.exit(1);
    }
}

// Ishga tushirish
generateSitemapFile();