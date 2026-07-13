import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderHomeSkeleton, mountHome, unmountHome } from './pages/home.js';
import { renderCatalogSkeleton, mountCatalog } from './pages/catalog.js';
import { renderDetailSkeleton, mountDetail } from './pages/detail.js';
import { renderFavoritesPage, mountFavoritesPage } from './pages/favoritesPage.js';
import { clearSEO } from './utils/seo.js';
import { navigateTo, getCurrentPath } from './utils/router.js';

const app = document.getElementById('app');

function parsePath() {
  const fullPath = getCurrentPath();
  const [pathPart, queryPart] = fullPath.split('?');
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
  const { segments, params } = parsePath();
  const page = segments[0] || '';

  // ========== SEO tozalash (detail bo'lmasa) ==========
  if (page !== 'anime') {
    clearSEO();
  }

  if (page === '' || page === '/') {
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
      navigateTo('/');
    }
  } else if (page === 'favorites') {
    app.innerHTML = layout('favorites', renderFavoritesPage());
    attachNavbarEvents();
    mountFavoritesPage();
  } else if (page === 'coming-soon') {
    const p = Number(params.get('page') || 1);
    app.innerHTML = layout('', renderCatalogSkeleton({ mode: 'coming-soon' }));
    attachNavbarEvents();
    mountCatalog({ mode: 'coming-soon', page: p });
  } else if (page === 'genre') {
    const genreId = segments[1];
    if (genreId) {
      const p = Number(params.get('page') || 1);
      app.innerHTML = layout('', renderCatalogSkeleton({ mode: 'genre', genreId }));
      attachNavbarEvents();
      mountCatalog({ mode: 'genre', genreId, page: p });
    } else {
      navigateTo('/');
    }
  } else {
    app.innerHTML = layout('', `
      <div class="state state--empty" style="min-height:60vh;display:flex;flex-direction:column;justify-content:center;">
        <div class="state__icon">404</div>
        <p>Bu sahifa topilmadi.</p>
        <a href="/" class="btn btn--primary" style="margin-top:16px;width:fit-content;" onclick="event.preventDefault(); window.navigateTo('/')">Bosh sahifaga qaytish</a>
      </div>
    `);
    attachNavbarEvents();
  }

  window.scrollTo({ top: 0 });
}

// navigateTo funksiyasini global qilamiz
window.navigateTo = navigateTo;

// Popstate event (oldinga/ortga tugmalari uchun)
window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  
  // SEO tozalash (agar detail bo'lmasa)
  if (!path.startsWith('/anime/')) {
    clearSEO();
  }
  
  render();
});

// Sahifadagi barcha linklar uchun delegate event
document.addEventListener('click', (e) => {
  // Faqat ichki linklar uchun
  const link = e.target.closest('a');
  if (!link) return;
  
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) return;
  
  e.preventDefault();
  navigateTo(href);
});

// DOM loaded
window.addEventListener('DOMContentLoaded', render);