# SHINGEKI — Anime katalogi (Vite + Vanilla JS)

O'zbek auditoriyasi uchun anime kashf qilish sayti. `tarjima-animelar.uz` uslubidagi tuzilma: bosh sahifa banner-karusel, katalog, janrlar bo'yicha filtr, qidiruv, anime sahifasi (qismlar ro'yxati, personajlar, tavsiyalar) va sevimlilar ro'yxati.

## Ishlatilgan API

Sayt **Jikan API v4** (https://jikan.moe) — MyAnimeList'ning bepul, kalitsiz ochiq API'sidan foydalanadi:
- `/top/anime`, `/seasons/now` — bosh sahifa va fasl ro'yxatlari
- `/anime?q=` — qidiruv, `/anime?genres=` — janr filtri
- `/anime/{id}/full`, `/episodes`, `/characters`, `/recommendations` — anime sahifasi

**Muhim:** Bu API faqat anime haqida *ma'lumot* beradi (rasm, tavsif, reyting, qismlar nomlari, treyler). U mualliflik huquqi bilan himoyalangan video fayllarni bermaydi, shuning uchun "Video pleyer" bo'limida asl treyler (agar mavjud bo'lsa) ko'rsatiladi, qism videosi esa "tarjima tayyorlanmoqda" ko'rinishida joylashtirilgan — bu joyga real video manbangizni (masalan, o'z serveringiz yoki boshqa video hosting) ulashingiz mumkin.

## O'rnatish va ishga tushirish

```bash
npm install
npm run dev
```

So'ng brauzerda ko'rsatilgan manzilni (odatda `http://localhost:5173`) oching.

Production build uchun:
```bash
npm run build
npm run preview
```

## Loyihaning tuzilishi

```
src/
  api.js              — Jikan API bilan ishlash (cache + so'rovlar navbati)
  favorites.js         — Sevimlilarni localStorage'da saqlash
  components/
    navbar.js          — Yuqori menyu va qidiruv
    footer.js          — Pastki qism
    card.js            — Anime karta komponenti
    states.js          — Loading/xato/bo'sh holatlar
  pages/
    home.js            — Bosh sahifa (banner, top, fasl, efirdagi)
    catalog.js          — Katalog / janr / qidiruv / fasl ro'yxatlari
    detail.js            — Anime sahifasi (video, qismlar, personajlar)
    favoritesPage.js    — Sevimlilar sahifasi
  main.js              — Hash-router va ilovani ishga tushirish
  style.css            — To'liq dizayn tizimi (qizil + to'q ko'k rang sxemasi)
```

## Rang sxemasi

Fon — deyarli qora tungi ko'k (`#090a10`), asosiy urg'u — qizil (`#e12a3d` → `#ff3b52` gradient), ikkinchi darajali urg'u — to'q ko'k/indigo (`#16204a`), reyting uchun oltin sariq (`#f0b93d`). Sarlavhalar uchun "Bebas Neue", matn uchun "Manrope", yapon uslubidagi detallar uchun "Noto Sans JP" shrifti ishlatilgan.
