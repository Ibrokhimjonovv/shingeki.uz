import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 1111

// Statik fayllarni serve qilish (dist papkasi)
app.use(express.static(path.join(__dirname, 'dist')))

// SPA uchun - hamma so'rovlarni index.html ga yo'naltirish
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Sitemap: http://localhost:${PORT}/sitemap.xml`)
})
