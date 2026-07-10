// /src/utils/seo.js

// SEO teglarni tozalash (boshqa sahifaga o'tganda)
export function clearSEO() {
    // Title ni defaultga qaytarish
    document.title = 'SHINGEKI - Tarjima animelar olami';
    
    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = "O'zbek tilida anime haqida ma'lumot, katalog va tarjimalar - SHINGEKI";
    }
    
    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.content = 'anime, o\'zbek tilida anime, anime tarjima, onlayn anime, bepul anime, shingeki';
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
        tag.content = 'SHINGEKI - Anime tarjimalar olami | O\'zbek tilida anime';
      } else if (tag && prop === 'og:description') {
        tag.content = "O'zbek tilidagi eng yaxshi anime sayti. Barcha janrdagi animelarni onlayn tarjima uzbek tilida tomosha qiling.";
      } else if (tag && prop === 'og:url') {
        tag.content = window.location.origin + '/';
      } else if (tag && prop === 'og:type') {
        tag.content = 'website';
      } else if (tag && prop === 'og:site_name') {
        tag.content = 'SHINGEKI';
      } else if (tag && prop === 'og:locale') {
        tag.content = 'uz_UZ';
      } else if (tag && prop === 'og:image') {
        tag.content = 'https://shingeki.uz/og-image.jpg';
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
        tag.content = 'SHINGEKI - Anime tarjimalar olami';
      } else if (tag && prop === 'twitter:description') {
        tag.content = "O'zbek tilidagi eng yaxshi anime sayti. Bepul va yuqori sifatli animelar.";
      } else if (tag && prop === 'twitter:card') {
        tag.content = 'summary_large_image';
      } else if (tag && prop === 'twitter:image') {
        tag.content = 'https://shingeki.uz/og-image.jpg';
      }
    });
    
    // Schema.org JSON-LD ni olib tashlash
    const schemaScript = document.querySelector('#seo-schema');
    if (schemaScript) {
      schemaScript.remove();
    }
  }
  
  // SEO meta teg yangilash
  export function updateSEO(anime) {
    // Avval eski teglarni tozalaymiz (lekin ba'zilarini saqlab qolamiz)
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
  
    // OG tags
    const ogTags = {
      'og:title': `${title} - onlayn anime tomosha qilish`,
      'og:description': `${title} anime ni uzbek tilida onlayn tomosha qiling. Bepul va yuqori sifatda.`,
      'og:image': img || 'https://shingeki.uz/og-image.jpg',
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
      'twitter:image': img || 'https://shingeki.uz/og-image.jpg',
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
      'image': img || 'https://shingeki.uz/og-image.jpg',
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
      script.remove(); // Eskisini olib tashlaymiz
    }
    
    script = document.createElement('script');
    script.id = 'seo-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }