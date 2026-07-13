import { api } from '../api.js';
import { animeCard, attachCardEvents } from '../components/card.js';
import { loader, errorState, cacheAnimeList } from '../components/states.js';
import { adaptAFDToCard } from '../utils/adapters.js';

function heroSlide(anime, index, active) {
  const img = anime.imgloc || anime.image || '';
  const title = anime.movies_real_name || anime.mnme || 'Nomsiz anime';
  const country = anime.cont || '';
  const yearMatch = anime.mnme?.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : '';
  const synopsis = `${country}${year ? ', ' + year : ''} • Shingeki.uz`;
  
  return `
    <div class="hero__slide ${active ? 'is-active' : ''}" data-slide="${index}" style="background-image:url('${img}')">
      <div class="hero__scrim"></div>
      <div class="hero__content">
        <p class="hero__eyebrow">アニメ・オンライン <span>•</span> №${index + 1} tavsiya</p>
        <h1 class="hero__title">${title}</h1>
        <div class="hero__tags">
          <span class="tag tag--score">★ Yangi</span>
          ${country ? `<span class="tag">${country}</span>` : ''}
          ${year ? `<span class="tag">${year}</span>` : ''}
        </div>
        <p class="hero__desc">${synopsis}</p>
        <div class="hero__actions">
          <a href="/anime/${anime.mcrntindx}" class="btn btn--primary">▶ Hozir ko'rish</a>
          <a href="/anime/${anime.mcrntindx}" class="btn btn--ghost">Batafsil ma'lumot</a>
        </div>
      </div>
    </div>
  `;
}

function carouselSection(id, title, subtitle) {
  return `
    <section class="section">
      <div class="section__head">
        <div>
          <h2 class="section__title">${title}</h2>
          <p class="section__sub">${subtitle}</p>
        </div>
        <div class="section__nav">
          <button class="scroll-btn" data-scroll="${id}" data-dir="-1" aria-label="Chapga">‹</button>
          <button class="scroll-btn" data-scroll="${id}" data-dir="1" aria-label="O'ngga">›</button>
        </div>
      </div>
      <div class="carousel" id="${id}">${loader()}</div>
    </section>
  `;
}

const GENRE_PILLS = [
  { id: 1, name: 'Ekshn', jp: 'アクション' },
  { id: 4, name: 'Komediya', jp: 'コメディ' },
  { id: 8, name: 'Drama', jp: 'ドラマ' },
  { id: 10, name: 'Fantastika', jp: 'ファンタジー' },
  { id: 22, name: 'Romantika', jp: 'ロマンス' },
  { id: 24, name: 'Sci-Fi', jp: 'SF' },
  { id: 14, name: "Vahima", jp: 'ホラー' },
  { id: 30, name: "Sport", jp: 'スポーツ' }
];

export function renderHomeSkeleton() {
  return `
    <div class="hero" id="heroSection">${loader('Anime yuklanmoqda...')}</div>

    ${carouselSection('carTop', 'Eng mashhur animelar', "Foydalanuvchilar tomonidan eng ko'p tomosha qilingan")}
    ${carouselSection('carSeason', "Tez orada", 'Yaqinda chiqadigan animelar')}
    ${carouselSection('carAiring', 'Katalogdan', "Barcha animelar ro'yxati")}
  `;
}

let heroInterval = null;

export async function mountHome() {
  clearInterval(heroInterval);
  const heroEl = document.getElementById('heroSection');

  try {
    const swiperRes = await api.swiper(12);
    const heroList = swiperRes.data || swiperRes || [];
    
    // Keshga saqlash
    cacheAnimeList(heroList.map(adaptAFDToCard));

    if (heroList.length) {
      heroEl.innerHTML = `
        <div class="hero__slides">
          ${heroList.map((a, i) => heroSlide(a, i, i === 0)).join('')}
        </div>
        <div class="hero__dots">
          ${heroList.map((_, i) => `<button class="hero__dot ${i === 0 ? 'is-active' : ''}" data-dot="${i}"></button>`).join('')}
        </div>
      `;
      
      let current = 0;
      const slides = heroEl.querySelectorAll('.hero__slide');
      const dots = heroEl.querySelectorAll('.hero__dot');
      
      const goTo = (idx) => {
        slides[current]?.classList.remove('is-active');
        dots[current]?.classList.remove('is-active');
        current = idx;
        slides[current]?.classList.add('is-active');
        dots[current]?.classList.add('is-active');
      };
      
      dots.forEach((d) => d.addEventListener('click', () => goTo(Number(d.dataset.dot))));
      heroInterval = setInterval(() => goTo((current + 1) % slides.length), 6000);
    } else {
      heroEl.innerHTML = errorState("Anime ma'lumotlari topilmadi.");
    }

    // Home API - adaptAFDToCard orqali
    const homeRes = await api.home(16);
    const homeList = homeRes.data || homeRes || [];
    renderCarousel('carTop', homeList.map(adaptAFDToCard));

  } catch (e) {
    console.error('Home mount error:', e);
    heroEl.innerHTML = errorState("Anime ma'lumotlarini yuklab bo'lmadi.");
  }

  // Coming Soon
  api.comingSoon()
    .then((res) => {
      const list = Array.isArray(res) ? res : (res.data || []);
      renderCarousel('carSeason', list.map(adaptAFDToCard));
    })
    .catch(() => renderCarouselError('carSeason'));

  // All Animes
  api.allAnimes(1)
    .then((res) => {
      const list = res.data || res.results || [];
      renderCarousel('carAiring', list.map(adaptAFDToCard));
    })
    .catch(() => renderCarouselError('carAiring'));

  attachScrollButtons();
}

function renderCarousel(id, list) {
  const el = document.getElementById(id);
  if (!el) return;
  
  if (!list.length) {
    el.innerHTML = `<p class="section__empty">Hozircha ma'lumot yo'q.</p>`;
    return;
  }
  
  el.innerHTML = list.map((a) => animeCard(a)).join('');
  attachCardEvents(el);
}

function renderCarouselError(id) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<p class="section__empty">Yuklab bo'lmadi.</p>`;
}

function attachScrollButtons() {
  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.scroll);
      const dir = Number(btn.dataset.dir);
      target?.scrollBy({ left: dir * 640, behavior: 'smooth' });
    });
  });
}

export function unmountHome() {
  clearInterval(heroInterval);
}