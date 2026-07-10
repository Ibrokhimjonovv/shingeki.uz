import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderHomeSkeleton, mountHome, unmountHome } from './pages/home.js';
import { renderCatalogSkeleton, mountCatalog } from './pages/catalog.js';
import { renderDetailSkeleton, mountDetail } from './pages/detail.js';
import { renderFavoritesPage, mountFavoritesPage } from './pages/favoritesPage.js';
import { clearSEO } from './utils/seo.js'; // ✅ QO'SHILDI

const app = document.getElementById('app');

function parseHash() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart] = hash.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  const params = new URLSearchParams(queryPart || '');
  return { segments, params };
}

function layout(activeRoute, contentHTML) {
  return `
    ${renderNavbar(activeRoute)}
    <main class="main">${contentHTML}</main>
    ${renderFooter()}
  `;
}

async function render() {
  unmountHome();
  const { segments, params } = parseHash();
  const page = segments[0] || '';

  // ========== SEO tozalash (detail bo'lmasa) ==========
  if (page !== 'anime') {
    clearSEO();
  }

  if (page === '') {
    app.innerHTML = layout('', renderHomeSkeleton());
    attachNavbarEvents();
    mountHome();
  } else if (page === 'all-animes') {
    const p = Number(params.get('page') || 1);
    app.innerHTML = layout('all-animes', renderCatalogSkeleton({ mode: 'all-animes' }));
    attachNavbarEvents();
    mountCatalog({ mode: 'all-animes', page: p });
  } else if (page === 'search') {
    const q = params.get('q') || '';
    const p = Number(params.get('page') || 1);
    app.innerHTML = layout('', renderCatalogSkeleton({ mode: 'search', query: q }));
    attachNavbarEvents();
    const searchInput = document.getElementById('navSearchInput');
    if (searchInput) searchInput.value = q;
    mountCatalog({ mode: 'search', query: q, page: p });
  } else if (page === 'anime') {
    const id = segments[1];
    if (id) {
      app.innerHTML = layout('', renderDetailSkeleton());
      attachNavbarEvents();
      mountDetail(id);
    } else {
      window.location.hash = '#/';
    }
  } else if (page === 'favorites') {
    app.innerHTML = layout('favorites', renderFavoritesPage());
    attachNavbarEvents();
    mountFavoritesPage();
  } else {
    app.innerHTML = layout('', `
      <div class="state state--empty" style="min-height:60vh;display:flex;flex-direction:column;justify-content:center;">
        <div class="state__icon">404</div>
        <p>Bu sahifa topilmadi.</p>
        <a href="#/" class="btn btn--primary" style="margin-top:16px;width:fit-content;">Bosh sahifaga qaytish</a>
      </div>
    `);
    attachNavbarEvents();
  }

  window.scrollTo({ top: 0 });
}

// ========== BIRLASHTIRILGAN HASHCHANGE EVENT ==========
window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  
  // SEO tozalash (agar detail bo'lmasa)
  if (!hash.startsWith('#/anime/')) {
    clearSEO();
  }
  
  // Sahifani render qilish
  render();
});

// DOM loaded
window.addEventListener('DOMContentLoaded', render);

// Agar birinchi marta render qilish kerak bo'lmasa, lekin hozircha render() chaqirilgan
// render(); // Bu qator kerak emas, chunki DOMContentLoaded render() ni chaqiradi