/**
 * AFD API'dan kelgan har qanday formatdagi anime ma'lumotini
 * animeCard komponenti kutgan formatga o'giradi
 */
export function adaptAFDToCard(afdAnime) {
    // Rasm - barcha variantlar
    const imageUrl = 
      afdAnime.alimgloc || 
      afdAnime.alimage ||
      afdAnime.hfimgloc || 
      afdAnime.hfsimage ||
      afdAnime.imgloc || 
      afdAnime.image ||
      afdAnime.movies_preview || 
      afdAnime.movies_preview_url ||
      '';
  
    // ID - detail va katalog formatlari
    const id = afdAnime.id || afdAnime.mcrntindx;
  
    // Nom
    const title = 
      afdAnime.movies_real_name || 
      afdAnime.alnme || 
      afdAnime.hfsnme || 
      afdAnime.mnme || 
      afdAnime.movies_name || 
      'Nomsiz';
  
    // Tavsif
    const synopsis = afdAnime.dscrp || afdAnime.movies_description || '';
  
    // Davlat
    const country = afdAnime.alcont || afdAnime.hfscont || afdAnime.cont || afdAnime.country || '';
  
    // Ko'rishlar soni
    const views = afdAnime.alcnt || afdAnime.hfscnt || afdAnime.count || 0;
  
    // Reyting
    const score = afdAnime.alscnt || afdAnime.hfsscnt || null;
  
    // Qismlar soni
    const episodes = afdAnime.alllsrs || afdAnime.hfsllsrs || afdAnime.all_series || null;
  
    // Janr
    const genre = afdAnime.genre || '';
  
    // Turi
    const type = afdAnime.aldnme || afdAnime.hfsdnme || afdAnime.dnme || afdAnime.department_name || 'Anime';
  
    // Yil
    const year = afdAnime.year || '';
  
    // Debug
    if (!imageUrl) {
      console.warn('adaptAFDToCard: rasm topilmadi!', afdAnime);
    }
  
    return {
      mal_id: id,
      title: title,
      title_english: title,
      images: {
        webp: {
          large_image_url: imageUrl
        },
        jpg: {
          large_image_url: imageUrl
        }
      },
      synopsis: synopsis || `${country}${year ? ', ' + year : ''} • ${views} ko'rish`,
      score: score,
      genres: genre ? genre.split(', ').map(g => ({ name: g.trim(), mal_id: 0 })) : [],
      type: type,
      episodes: episodes,
      status: 'Completed',
      aired: { string: country + (year ? ', ' + year : '') },
      year: year,
      views: views,
      country: country
    };
  }