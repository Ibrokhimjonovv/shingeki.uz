// AFD Platform backend — tarjima-animelar.uz shu API'dan foydalanadi.
const BASE = 'https://bk.afd-platform.uz/afd-platform/backend/urls/';

function get(path, params = {}) {
  const url = new URL(BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });
  return fetch(url.toString()).then((res) => {
    if (!res.ok) throw new Error(`API xatosi: ${res.status}`);
    return res.json();
  });
}

export const api = {
  // Bosh sahifa banner/swiper — SwiperMoviesSerializer
  swiper(limit = 10) {
    return get('tnsprmvs/', { l: limit });
  },
  // Bosh sahifa ro'yxati — HomeMoviesSerializer
  home(limit = 16) {
    return get('tnhmvs/', { l: limit });
  },
  // To'liq katalog, sahifalangan — AllMoviesSerializer
  allAnimes(page = 1) {
    return get('tnall-animes/', { page });
  },
  // Nomi bo'yicha qidiruv — MovieSearchSerializer (pagination yo'q)
  search(q) {
    return get('tnsearch/', { q });
  },
  // Tez orada chiqadiganlar (qisqa ro'yxat, 12 tagacha)
  comingSoon() {
    return get('csonanim/');
  },
  // Tez orada chiqadiganlar, to'liq/sahifalangan
  comingSoonAll(page = 1) {
    return get('csonalanim/', { page });
  },
  // Janr bo'yicha tasodifiy tanlov (sahifalanmagan, 30 tagacha)
  randomByGenre(genre) {
    return get('rnanim/', { genre });
  },
  // Bitta anime — qismlar, video, like/dislike bilan
  movieDetail(id) {
    return get(`movies/${id}/`);
  },
  async getVideoUrl(fileUrl) {
    try {
      const res = await get('get-video/', { file: fileUrl });
      return res.url || fileUrl;
    } catch (e) {
      console.warn('Presigned URL olishda xatolik:', e);
      return fileUrl;
    }
  }
};