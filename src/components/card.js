import { favorites } from '../favorites.js';

export function animeCard(anime) {
  // Adapter orqali kelgan ma'lumot, to'g'ridan-to'g'ri images.webp.large_image_url da bo'ladi
  const img = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || '';
  const title = anime.title_english || anime.title || 'Nomsiz';
  const score = anime.score ? anime.score : '—';
  const type = anime.type || 'Anime';
  const episodes = anime.episodes;
  const epsText = episodes === 'Film' ? 'Film' : (episodes ? `${episodes} qism` : '?');
  const animeId = anime.mal_id;
  const fav = favorites.has(animeId);

  return `
    <a href="/anime/${animeId}" class="card" data-id="${animeId}">
      <div class="card__poster">
        <img src="${img}" alt="${title}" loading="lazy" />
        <div class="card__score"><span>★</span>${5}</div>
        <button class="card__fav ${fav ? 'is-active' : ''}" data-fav="${animeId}" title="Sevimlilarga qo'shish" aria-label="Sevimlilarga qo'shish">♥</button>
        <div class="card__overlay">
          <span class="card__play">▶ Ko'rish</span>
        </div>
      </div>
      <div class="card__body">
        <h3 class="card__title">${title}</h3>
        <div class="card__meta">
          <span>${type}</span>
          <span class="dot">•</span>
          <span>${epsText}</span>
        </div>
      </div>
    </a>
  `;
}

export function attachCardEvents(container, onFavChange) {
  if (!container) return;
  
  container.querySelectorAll('[data-fav]').forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode?.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = Number(newBtn.dataset.fav);
      const anime = window.__animeCache?.[id];
      if (anime) {
        const nowFav = favorites.toggle(anime);
        newBtn.classList.toggle('is-active', nowFav);
        if (onFavChange) onFavChange();
      }
    });
  });
}