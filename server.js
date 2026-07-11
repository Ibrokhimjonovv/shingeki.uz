// server.js
import express from 'express'
import compression from 'compression'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(compression())

// API konfiguratsiyasi
const API_URL = process.env.API_URL || 'http://localhost:8000'

// API dan ma'lumot olish
async function fetchFromAPI(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    return []
  }
}

// Sitemap generatsiya
function generateSitemapXML(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${new Date(url.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>${url.changefreq || 'weekly'}</changefreq>
    <priority>${url.priority || '0.5'}</priority>
  </url>`).join('')}
</urlset>`
}

// Sitemap endpoint
app.get('/sitemap.xml', async (req, res) => {
  try {
    // API lardan ma'lumotlarni olish
    const [posts, products] = await Promise.all([
      fetchFromAPI('/api/posts').catch(() => []),
      fetchFromAPI('/api/products').catch(() => [])
    ])
    
    // URL lar ro'yxati
    const urls = [
      {
        loc: 'https://yourdomain.com',
        priority: '1.0',
        changefreq: 'daily',
        lastmod: new Date()
      },
      {
        loc: 'https://yourdomain.com/about',
        priority: '0.8',
        changefreq: 'monthly'
      }
    ]
    
    // Postlarni qo'shish
    posts.forEach(post => {
      urls.push({
        loc: `https://yourdomain.com/blog/${post.slug || post.id}`,
        lastmod: post.updatedAt || post.createdAt,
        priority: '0.7',
        changefreq: 'weekly'
      })
    })
    
    // Mahsulotlarni qo'shish
    products.forEach(product => {
      urls.push({
        loc: `https://yourdomain.com/product/${product.slug || product.id}`,
        lastmod: product.updatedAt,
        priority: '0.9',
        changefreq: 'daily'
      })
    })
    
    const sitemap = generateSitemapXML(urls)
    
    res.header('Content-Type', 'application/xml')
    res.send(sitemap)
    
  } catch (error) {
    console.error('Sitemap generation error:', error)
    res.status(500).send('Error generating sitemap')
  }
})

// Statik fayllar
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Sitemap: http://localhost:${PORT}/sitemap.xml`)
})