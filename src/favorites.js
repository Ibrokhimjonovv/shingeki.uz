const KEY = 'shingeki_sevimlilar';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export const favorites = {
  all() {
    return readAll();
  },
  has(id) {
    return readAll().some((a) => a.mal_id === id);
  },
  toggle(anime) {
    const list = readAll();
    const idx = list.findIndex((a) => a.mal_id === anime.mal_id);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.unshift(anime);
    }
    writeAll(list);
    return idx < 0;
  }
};
