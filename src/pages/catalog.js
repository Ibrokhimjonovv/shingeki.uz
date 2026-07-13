import { api } from '../api.js';
import { animeCard, attachCardEvents } from '../components/card.js';
import { loader, errorState, emptyState, cacheAnimeList } from '../components/states.js';
import { adaptAFDToCard } from '../utils/adapters.js';

const ALL_GENRES = [
  { id: 1, name: 'Ekshn' },
  { id: 2, name: 'Sarguzasht' },
  { id: 4, name: 'Komediya' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantastika' },
  { id: 14, name: 'Vahima' },
  { id: 7, name: 'Detektiv' },
  { id: 22, name: 'Romantika' },
  { id: 24, name: 'Sci-Fi' },
  { id: 30, name: 'Sport' },
  { id: 36, name: 'Hayotiy' },
  { id: 37, name: "G'ayrioddiy" }
];

export function renderCatalogSkeleton({ mode, query = '', genreId = '' }) {

  return `
    <section class="section catalog">
      
      <div class="grid" id="catalogGrid">${loader("Ro'yxat yuklanmoqda...")}</div>
      <div class="pagination" id="catalogPagination"></div>
    </section>
  `;
}

export async function mountCatalog({ mode, query = '', genreId = '', page = 1 }) {
  const gridEl = document.getElementById('catalogGrid');
  const pagEl = document.getElementById('catalogPagination');

  if (!gridEl) return;
  gridEl.innerHTML = loader();

  try {
    let res;

    if (mode === 'search') {
      res = await api.search(query);
    } else if (mode === 'genre') {
      res = await api.randomByGenre(genreId);
    } else if (mode === 'coming-soon') {
      res = await api.comingSoonAll(page);
    } else {
      res = await api.allAnimes(page);
    }

    let list = [];
    let pagination = null;

    if (res.data) {
      list = res.data;
      pagination = res.pagination;
    } else if (Array.isArray(res)) {
      list = res;
    } else if (res.results) {
      list = res.results;
    }

    // adaptAFDToCard orqali o'tkazish
    const adaptedList = list.map(adaptAFDToCard);
    cacheAnimeList(adaptedList);

    if (!adaptedList.length) {
      gridEl.innerHTML = emptyState(
        mode === 'search'
          ? "Bu nom bo'yicha hech narsa topilmadi."
          : "Bu bo'limda anime topilmadi."
      );
      pagEl.innerHTML = '';
      return;
    }

    gridEl.innerHTML = adaptedList.map((a) => animeCard(a)).join('');
    attachCardEvents(gridEl);

    const isSearchOrGenre = mode === 'search' || mode === 'genre';

    if (isSearchOrGenre || !pagination) {
      pagEl.innerHTML = `
        <span class="pagination__page">Jami: ${adaptedList.length} ta anime</span>
      `;
    } else {
      const hasNext = !!pagination.next;
      const currentPage = pagination.current_page || page;
      const totalPages = pagination.total_pages || '?';

      pagEl.innerHTML = `
        <button class="btn btn--ghost" id="prevPage" ${page <= 1 ? 'disabled' : ''}>← Oldingi</button>
        <span class="pagination__page">Sahifa ${currentPage} / ${totalPages}</span>
        <button class="btn btn--ghost" id="nextPage" ${!hasNext ? 'disabled' : ''}>Keyingi →</button>
      `;

      document.getElementById('prevPage')?.addEventListener('click', () => {
        if (page > 1) navigateSamePage(mode, query, genreId, page - 1);
      });
      document.getElementById('nextPage')?.addEventListener('click', () => {
        if (hasNext) navigateSamePage(mode, query, genreId, page + 1);
      });
    }

  } catch (e) {
    console.error('Catalog mount error:', e);
    gridEl.innerHTML = errorState("Ma'lumotlarni yuklab bo'lmadi.");
    pagEl.innerHTML = '';
  }
}

function navigateSamePage(mode, query, genreId, page) {
  if (mode === 'search') {
    window.location.hash = `/search?q=${encodeURIComponent(query)}&page=${page}`;
  } else if (mode === 'genre') {
    window.location.hash = `/genre/${genreId}?page=${page}`;
  } else if (mode === 'coming-soon') {
    window.location.hash = `/coming-soon?page=${page}`;
  } else if (mode === 'fasl') {
    window.location.hash = `/fasl?page=${page}`;
  } else {
    window.location.hash = `/all-animes?page=${page}`;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}