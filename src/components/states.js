export function loader(text = 'Yuklanmoqda...') {
  return `
    <div class="state state--loading" data-loader="true">
      <div class="spinner"></div>
      <p>${text}</p>
    </div>
  `;
}

export function errorState(message = 'Nimadir xato ketdi.') {
  return `
    <div class="state state--error">
      <div class="state__icon">⚠</div>
      <p>${message}</p>
      <p class="state__sub">Internetni tekshiring yoki birozdan so'ng qayta urinib ko'ring.</p>
    </div>
  `;
}

export function emptyState(message = 'Hech narsa topilmadi.') {
  return `
    <div class="state state--empty">
      <div class="state__icon">見</div>
      <p>${message}</p>
    </div>
  `;
}

export function cacheAnimeList(list) {
  window.__animeCache = window.__animeCache || {};
  list.forEach((a) => (window.__animeCache[a.mal_id] = a));
}
