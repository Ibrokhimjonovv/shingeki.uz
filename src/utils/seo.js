// SEO teglarni tozalash (boshqa sahifaga o'tganda)
export function clearSEO() {
  // Title ni defaultga qaytarish
  document.title = 'SHINGEKI.UZ — Tarjima animelar olami | O\'zbek tilida anime';
  
  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = "SHINGEKI.UZ - o'zbek tilidagi eng yaxshi anime sayti. Barcha janrdagi animelarni onlayn tarjima uzbek tilida tomosha qiling. Bepul va yuqori sifatli.";
  }
  
  // Meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.content = 'anime, o\'zbek tilida anime, anime tarjima, onlayn anime, bepul anime, shingeki, anime uzbek, manga, anime katalog';
  }
  
  // Robot meta teglarini normal holatga qaytarish
  const metaRobots = document.querySelector('meta[name="robots"]');
  if (metaRobots) {
    metaRobots.content = 'index, follow';
  }
  
  const metaGooglebot = document.querySelector('meta[name="googlebot"]');
  if (metaGooglebot) {
    metaGooglebot.content = 'index, follow';
  }
  
  // Canonical
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.href = window.location.origin + '/';
  }
  
  // Open Graph teglar
  const ogTags = [
    'og:title',
    'og:description',
    'og:image',
    'og:url',
    'og:type',
    'og:site_name',
    'og:locale'
  ];
  
  ogTags.forEach(prop => {
    const tag = document.querySelector(`meta[property="${prop}"]`);
    if (tag && prop === 'og:title') {
      tag.content = 'SHINGEKI.UZ — Tarjima animelar olami | O\'zbek tilida anime';
    } else if (tag && prop === 'og:description') {
      tag.content = "SHINGEKI.UZ - o'zbek tilidagi eng yaxshi anime sayti. Barcha janrdagi animelarni onlayn tarjima uzbek tilida tomosha qiling. Bepul va yuqori sifatli.";
    } else if (tag && prop === 'og:url') {
      tag.content = window.location.origin + '/';
    } else if (tag && prop === 'og:type') {
      tag.content = 'website';
    } else if (tag && prop === 'og:site_name') {
      tag.content = 'SHINGEKI.UZ';
    } else if (tag && prop === 'og:locale') {
      tag.content = 'uz_UZ';
    } else if (tag && prop === 'og:image') {
      tag.content = 'https://shingeki.uz/preview.png';
    }
  });
  
  // Twitter teglar
  const twitterTags = [
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image'
  ];
  
  twitterTags.forEach(prop => {
    const tag = document.querySelector(`meta[name="${prop}"]`);
    if (tag && prop === 'twitter:title') {
      tag.content = 'SHINGEKI.UZ — Tarjima animelar olami | O\'zbek tilida anime';
    } else if (tag && prop === 'twitter:description') {
      tag.content = "SHINGEKI.UZ — O'zbek tilidagi eng yaxshi anime platformasi. Barcha janrdagi animelarni onlayn tarjimada, yuqori sifatda va mutlaqo bepul tomosha qiling. Anime olamiga xush kelibsiz!";
    } else if (tag && prop === 'twitter:card') {
      tag.content = 'summary_large_image';
    } else if (tag && prop === 'twitter:image') {
      tag.content = 'https://shingeki.uz/preview.png';
    }
  });
  
  // Schema.org JSON-LD ni olib tashlash
  const schemaScript = document.querySelector('#seo-schema');
  if (schemaScript) {
    schemaScript.remove();
  }
  
  // HTTP statusni tiklash
  if (window.history?.replaceState && window.history.state?.is404) {
    window.history.replaceState(
      { ...window.history.state, status: 200, is404: false },
      '',
      window.location.href
    );
  }
}

// SEO meta teg yangilash
export function updateSEO(anime) {
  // Avval eski teglarni tozalaymiz
  clearSEO();
  
  const title = anime.movies_real_name || 'Anime';
  const description = anime.movies_description || `${title} anime ni onlayn tomosha qiling. Eng yaxshi sifatda bepul ko'rish.`;
  const img = anime.movies_preview || anime.movies_preview_url || '';
  const genres = (anime.genre || '').split(', ').filter(Boolean);
  const keywords = [title, 'anime', 'onlayn', 'tomosha', ...genres, 'tarjima', 'uzbek tilida', 'bepul'].join(', ');
  const url = window.location.href;
  
  // Title
  document.title = `${title} - anime onlayn tomosha qilish | Shingeki.uz`;
  
  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = `${title} anime ni onlayn tarjima uzbek tilida tomosha qiling. ${description.slice(0, 150)}...`;

  // Meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.content = keywords;

  // Robot meta teglari - normal holat
  let metaRobots = document.querySelector('meta[name="robots"]');
  if (!metaRobots) {
    metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    document.head.appendChild(metaRobots);
  }
  metaRobots.content = 'index, follow';
  
  let metaGooglebot = document.querySelector('meta[name="googlebot"]');
  if (!metaGooglebot) {
    metaGooglebot = document.createElement('meta');
    metaGooglebot.name = 'googlebot';
    document.head.appendChild(metaGooglebot);
  }
  metaGooglebot.content = 'index, follow';

  // OG tags
  const ogTags = {
    'og:title': `${title} - onlayn anime tomosha qilish`,
    'og:description': `${title} anime ni uzbek tilida onlayn tomosha qiling. Bepul va yuqori sifatda.`,
    'og:image': img || 'https://shingeki.uz/preview.png',
    'og:url': url,
    'og:type': 'video.tv_show',
    'og:site_name': 'Shingeki.uz',
    'og:locale': 'uz_UZ',
  };

  Object.entries(ogTags).forEach(([key, value]) => {
    let tag = document.querySelector(`meta[property="${key}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', key);
      document.head.appendChild(tag);
    }
    tag.content = value;
  });

  // Twitter Card
  const twitterTags = {
    'twitter:card': 'summary_large_image',
    'twitter:title': `${title} - onlayn anime`,
    'twitter:description': `${title} anime ni uzbek tilida tomosha qiling.`,
    'twitter:image': img || 'https://shingeki.uz/preview.png',
  };

  Object.entries(twitterTags).forEach(([key, value]) => {
    let tag = document.querySelector(`meta[name="${key}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = key;
      document.head.appendChild(tag);
    }
    tag.content = value;
  });

  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url.split('?')[0];

  // Schema.org JSON-LD
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    'name': title,
    'description': description || `${title} anime onlayn.`,
    'image': img || 'https://shingeki.uz/preview.png',
    'genre': genres,
    'countryOfOrigin': anime.country || 'Yaponiya',
    'numberOfEpisodes': anime.all_series || '?',
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '5',
      'bestRating': '5',
      'ratingCount': anime.count || 0
    },
    'url': url,
    'contentRating': 'PG-13',
  };

  let script = document.querySelector('#seo-schema');
  if (script) {
    script.remove();
  }
  
  script = document.createElement('script');
  script.id = 'seo-schema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
  
  // HTTP statusni yangilash
  if (window.history?.replaceState) {
    window.history.replaceState(
      { ...window.history.state, status: 200, is404: false },
      '',
      window.location.href
    );
  }
}

// 404 meta teglarini o'rnatish
export function set404SEOMeta(errorMessage = 'Sahifa topilmadi') {
// Meta robots - noindex, nofollow, noarchive
let metaRobots = document.querySelector('meta[name="robots"]');
if (!metaRobots) {
  metaRobots = document.createElement('meta');
  metaRobots.name = 'robots';
  document.head.appendChild(metaRobots);
}
metaRobots.content = 'noindex, nofollow, noarchive';

// Googlebot uchun alohida
let metaGooglebot = document.querySelector('meta[name="googlebot"]');
if (!metaGooglebot) {
  metaGooglebot = document.createElement('meta');
  metaGooglebot.name = 'googlebot';
  document.head.appendChild(metaGooglebot);
}
metaGooglebot.content = 'noindex, nofollow';

// Sahifa sarlavhasi
document.title = `${errorMessage} | Shingeki.uz`;

// Meta description
let metaDesc = document.querySelector('meta[name="description"]');
if (!metaDesc) {
  metaDesc = document.createElement('meta');
  metaDesc.name = 'description';
  document.head.appendChild(metaDesc);
}
metaDesc.content = 'Kechirasiz, siz qidirayotgan sahifa topilmadi. Boshqa animelarni ko\'rish uchun bosh sahifaga qayting.';

// Meta keywords tozalash
const metaKeywords = document.querySelector('meta[name="keywords"]');
if (metaKeywords) {
  metaKeywords.content = '';
}

// OG teglar
const ogTags = {
  'og:title': `${errorMessage} | Shingeki.uz`,
  'og:description': 'Kechirasiz, bu sahifa topilmadi.',
  'og:type': 'website',
  'og:url': window.location.href,
};

Object.entries(ogTags).forEach(([key, value]) => {
  let tag = document.querySelector(`meta[property="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', key);
    document.head.appendChild(tag);
  }
  tag.content = value;
});

// Twitter teglar
const twitterTags = {
  'twitter:card': 'summary',
  'twitter:title': `${errorMessage} | Shingeki.uz`,
  'twitter:description': 'Kechirasiz, bu sahifa topilmadi.',
};

Object.entries(twitterTags).forEach(([key, value]) => {
  let tag = document.querySelector(`meta[name="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = key;
    document.head.appendChild(tag);
  }
  tag.content = value;
});

// Canonical URL
let canonical = document.querySelector('link[rel="canonical"]');
if (!canonical) {
  canonical = document.createElement('link');
  canonical.rel = 'canonical';
  document.head.appendChild(canonical);
}
canonical.href = window.location.href.split('?')[0];

// Schema.org JSON-LD ni olib tashlash
const schemaScript = document.querySelector('#seo-schema');
if (schemaScript) {
  schemaScript.remove();
}

// HTTP status simulyatsiyasi
if (window.history?.replaceState) {
  window.history.replaceState(
    { ...window.history.state, status: 404, is404: true },
    '',
    window.location.href
  );
}
}