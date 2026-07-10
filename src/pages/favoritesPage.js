import { favorites } from '../favorites.js';
import { animeCard, attachCardEvents } from '../components/card.js';
import { emptyState, cacheAnimeList } from '../components/states.js';

export function renderFavoritesPage() {
  const list = favorites.all();
  cacheAnimeList(list);

  return `
    <section class="section catalog">
      <div class="catalog__head">
        <h1 class="section__title">Sevimli animelar</h1>
        <p class="section__sub">♥ belgisi bosilgan animelar shu yerda saqlanadi (brauzeringizda, faqat siz uchun)</p>
      </div>
      <div class="grid" id="favGrid">
        ${list.length ? list.map((a) => animeCard(a)).join('') : emptyState("Hali sevimlilarga hech narsa qo'shmadingiz.")}
      </div>
    </section>
  `;
}

export function mountFavoritesPage() {
  const grid = document.getElementById('favGrid');
  if (!grid) return;
  attachCardEvents(grid, () => {
    // re-render list after removal
    const list = favorites.all();
    if (!list.length) {
      grid.innerHTML = emptyState("Hali sevimlilarga hech narsa qo'shmadingiz.");
    }
  });
}
