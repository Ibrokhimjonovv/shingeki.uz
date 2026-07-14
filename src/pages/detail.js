import { api } from '../api.js';
import { favorites } from '../favorites.js';
import { loader, errorState } from '../components/states.js';
import { adaptAFDToCard } from '../utils/adapters.js';
import { VideoPlayer } from '../components/videoPlayer.js';
import { animeCard, attachCardEvents } from '../components/card.js';
import { updateSEO, clearSEO, set404SEOMeta } from '../utils/seo.js';

export function renderDetailSkeleton() {
  return `<div id="detailRoot">${loader("Anime ma'lumotlari yuklanmoqda...")}</div>`;
}

let currentPlayer = null;

// Detail sahifasining asosiy funksiyasi
export async function mountDetail(id) {
  const root = document.getElementById('detailRoot');

  // Oldingi pleyerni tozalash
  if (currentPlayer) {
    currentPlayer.destroy();
    currentPlayer = null;
  }

  try {
    const res = await api.movieDetail(id);

    console.log(res);
    
    
    // Agar API 404 qaytarsa yoki ma'lumot bo'sh bo'lsa
    if (!res || res.status === 404) {
      handleNotFound(root, id);
      return;
    }

    console.log("O'tdi");
    
    
    const anime = res.data || res;
    
    // Agar anime ma'lumotlari bo'sh bo'lsa
    if (!anime || Object.keys(anime).length === 0) {
      handleNotFound(root, id);
      return;
    }

    // SEO teglarni yangilash
    updateSEO(anime);

    const adapted = adaptAFDToCard(anime);
    window.__animeCache = window.__animeCache || {};
    window.__animeCache[adapted.mal_id] = adapted;

    const title = anime.movies_real_name || adapted.title;
    const img = anime.movies_preview || anime.movies_preview_url || '';
    const genres = (anime.genre || '').split(', ').filter(Boolean);
    const isFav = favorites.has(adapted.mal_id);
    const synopsis = anime.movies_description || '';
    const country = anime.country || '';
    const year = anime.year || '';
    const episodes = anime.all_series || '?';
    const type = anime.department_name || 'Anime';
    const views = anime.count || 0;
    const isSoon = anime.is_soon || false;

    // BARCHA seriyalarni olish (iframe, video, bo'sh - hammasi)
    const series = (anime.series || []).sort((a, b) => a.id - b.id);
    const hasSeries = series.length > 0;

    // Birinchi seriyani topish (afzal video URL li)
    const firstValidSeries = series.find(s =>
      s.video_url &&
      s.video_url !== '-' &&
      s.video_url !== '---'
    ) || series[0];

    // Video manbasini aniqlash
    const mainVideoUrl = anime.movies_url && anime.movies_url !== '-' && anime.movies_url !== '---'
      ? anime.movies_url
      : null;

    root.innerHTML = `
      <div class="detail">
        <div class="detail__banner" style="background-image:url('${img}')">
          <div class="detail__banner-scrim"></div>
        </div>
        <div class="detail__wrap">
          <div class="detail__top">
            <div class="detail__poster">
              <img src="${img}" alt="${title} poster" loading="lazy" />
            </div>
            <div class="detail__info">
              <h1 class="detail__title">${title}</h1>
              <div class="detail__tags">
                <span class="tag">👁 ${views.toLocaleString()} ko'rish</span>
                <span class="tag">${type}</span>
                <span class="tag">${episodes === 'Film' ? 'Film' : episodes + ' qism'}</span>
                ${country ? `<span class="tag">${country}</span>` : ''}
                ${year ? `<span class="tag">${year}</span>` : ''}
              </div>
              <div class="detail__genres">
                ${genres.map(g => `<span class="chip">${g.trim()}</span>`).join('')}
              </div>
              <div class="detail__actions">
                <button class="btn btn--primary" id="watchBtn">▶ Ko'rishni boshlash</button>
                <button class="btn btn--outline ${isFav ? 'is-active' : ''}" id="favBtn">
                  ♥ ${isFav ? "Sevimlilarda" : "Sevimlilarga qo'shish"}
                </button>
              </div>
            </div>
          </div>

          <div class="detail__body">
            <div class="detail__main">
              <!-- Video pleyer -->
              <section class="detail__section" id="playerSection">
                <h2 class="section__title section__title--sm">
                  ${firstValidSeries && !firstValidSeries.video_url?.includes('<iframe')
        ? firstValidSeries.title
        : 'Video pleyer'}
                </h2>
                <div class="player" id="playerBox"></div>
              </section>

              <a href="https://omg10.com/4/11277820" target="_blank" rel="noopener noreferrer" 
                style="justify-content: center;margin-bottom: 20px;width: 100%;display:flex;align-items:center;gap:8px;padding:15px 5px;
                        border:1.5px solid #A4D65E;border-radius:20px;background:linear-gradient(135deg,#f8fff4,#eef8e5);
                        text-decoration:none;color:#201547;font-size:13px;font-weight:600;font-family:system-ui,sans-serif;
                        transition:all 0.2s;box-shadow:0 2px 6px rgba(164,214,94,0.25);"
                onmouseover="this.style.transform='scale(1.03)';this.style.boxShadow='0 4px 12px rgba(164,214,94,0.4)';"
                onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 2px 6px rgba(164,214,94,0.25)';">
                <svg width="70" height="14" viewBox="0 0 133 27" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;flex-shrink:0;">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M91.8743 21.0682C93.2577 21.0682 94.6169 20.7915 95.527 20.214L94.2285 16.5682C93.7917 16.869 93.2092 17.0375 92.6267 17.0375C91.6802 17.0375 91.0734 16.4359 91.0734 15.341V11.7313L94.2285 11.1177V7.76074L91.0734 8.38641V2.63507H85.819V15.3891C85.819 19.2033 88.0275 21.0682 91.8743 21.0682ZM64.0485 12.3089V20.8156H58.7941V13.1631C58.7941 11.0214 57.8597 10.119 56.3307 10.119C54.6439 10.119 53.3454 11.1658 53.3454 13.6324V20.8156H48.091V5.94389H53.1027V7.55619C54.292 6.31689 55.9787 5.69122 57.8597 5.69122C61.3667 5.70325 64.0485 7.70057 64.0485 12.3089ZM25.5806 20.8155V12.3088C25.5806 7.70055 23.008 5.70323 19.5252 5.70323C17.3773 5.70323 15.5207 6.55751 14.3315 8.03746C13.2757 6.44922 11.5404 5.70323 9.48958 5.70323C7.71787 5.70323 6.14032 6.30484 5.01176 7.50805V5.94387H0V20.8155H5.24233V13.4399C5.24233 11.1297 6.34661 10.119 7.8999 10.119C9.30756 10.119 10.1691 11.0214 10.1691 13.1631V20.8155H15.4236V13.4399C15.4236 11.1297 16.54 10.119 18.0569 10.119C19.4403 10.119 20.3262 11.0214 20.3262 13.1631V20.8155H25.5806ZM36.9145 5.70323C32.0241 5.70323 28.4564 8.8797 28.4564 13.3556C28.4564 17.8556 32.0241 21.0562 36.9145 21.0562C41.8656 21.0562 45.3726 17.8556 45.3726 13.3556C45.3726 8.8797 41.8656 5.70323 36.9145 5.70323ZM36.9145 9.84227C38.7105 9.84227 40.0696 11.1056 40.0696 13.3556C40.0696 15.6297 38.7226 16.9171 36.9145 16.9171C35.1428 16.9171 33.7594 15.6297 33.7594 13.3556C33.7594 11.1056 35.1428 9.84227 36.9145 9.84227ZM113.232 5.9559V20.8035H108.22V19.3236C107.225 20.5027 105.757 21.0562 103.791 21.0562C99.7255 21.0562 96.4369 18.0963 96.4369 13.3556C96.4369 8.63906 99.7255 5.70323 103.791 5.70323C105.538 5.70323 106.946 6.19655 107.965 7.24334V5.9559H113.232ZM108.05 13.3556C108.05 11.1056 106.667 9.84227 104.895 9.84227C103.123 9.84227 101.74 11.1056 101.74 13.3556C101.74 15.6297 103.123 16.9171 104.895 16.9171C106.679 16.9171 108.05 15.6297 108.05 13.3556ZM133 18.0963V5.94389H127.976V7.74871C126.957 6.35298 125.355 5.69122 123.28 5.69122C119.3 5.69122 115.926 8.49469 115.926 12.8503C115.926 17.242 119.3 20.0335 123.28 20.0335C125.185 20.0335 126.714 19.4559 127.733 18.2768V18.7701C127.733 21.1043 126.544 22.3677 123.729 22.3677C121.957 22.3677 119.918 21.7661 118.669 20.7795L116.763 24.4252C118.584 25.7126 121.326 26.3744 124.202 26.3744C129.796 26.3744 133 23.7153 133 18.0963ZM124.542 9.84229C126.423 9.84229 127.806 11.0575 127.806 12.8623C127.806 14.6672 126.423 15.9065 124.542 15.9065C122.661 15.9065 121.253 14.6672 121.253 12.8623C121.253 11.0455 122.661 9.84229 124.542 9.84229Z" fill="#201547"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M82.0568 18.6497L79.3143 15.7981C78.2949 16.6765 77.3241 17.0856 75.8558 17.0976C74.2054 17.0976 73.0405 16.5201 72.458 15.3169L83.1611 13.2834C83.1368 8.4345 79.5206 5.71525 75.2005 5.71525C70.4436 5.71525 66.9001 8.89172 66.9001 13.3677C66.9001 17.8075 70.3586 21.0682 75.698 21.0682C78.5498 21.0682 80.6491 20.238 82.0568 18.6497ZM69.2543 4.16311H72.7371L75.1156 2.08155L77.494 4.16311H80.9768L77.3848 0H72.8463L69.2543 4.16311ZM78.125 11.4546L72.0454 12.6337C72.2153 10.5281 73.4288 9.4091 75.2248 9.39707C76.681 9.39707 77.761 10.2153 78.125 11.4546ZM77.6394 22.8369L75.2609 24.9184L72.8825 22.8369H69.3997L72.9917 27H77.5302L81.1221 22.8369H77.6394Z" fill="#A4D65E"></path>
                </svg>
                <span style="letter-spacing:0.3px;">Monetag.comga o'tish</span>
              </a>

              ${hasSeries ? `
              <section class="detail__section">
                <h2 class="section__title section__title--sm">
                  Qismlar ro'yxati
                  <a href="https://t.me/tarjima_animelar_uzb" target="_blank" 
                    style="font-size:14px;color:var(--accent,#6c5ce7);margin-left:12px;">
                    Telegramda ko'rish →
                  </a>
                </h2>
                <div class="episode-list" id="episodeList">
                  ${series.map((ep, i) => {
          const isValidVideo = ep.video_url &&
            ep.video_url !== '-' &&
            ep.video_url !== '---';
          const isIframe = ep.video_url?.includes('<iframe');
          const encodedVideo = isValidVideo
            ? (isIframe
              ? encodeURIComponent(ep.video_url)
              : ep.video_url)
            : '';

          return `
                      <button class="episode-item ${isValidVideo ? '' : 'is-disabled'}" 
                              data-video="${encodedVideo}" 
                              data-title="${ep.title}"
                              data-poster="${img}"
                              data-iframe="${isIframe ? 'true' : 'false'}"
                              ${!isValidVideo ? 'disabled' : ''}>
                        <span class="episode-item__num">${i + 1}</span>
                        <span class="episode-item__title">${ep.title}</span>
                        ${isValidVideo
              ? '<span class="episode-item__play">▶</span>'
              : '<span class="episode-item__soon">Tez orada</span>'}
                      </button>
                    `;
        }).join('')}
                </div>
              </section>
              ` : ''}

              <!-- Syujet -->
              <section class="detail__section">
                <h2 class="section__title section__title--sm">Syujet</h2>
                <p class="detail__synopsis">${synopsis ? synopsis.replace(/\n/g, '<br/>') : "Tavsif mavjud emas."}</p>
              </section>
            </div>
            
            <aside class="detail__side">
              <div class="side-card">
                <h3>Ma'lumot</h3>
                <dl class="side-list">
                  <dt>Turi</dt><dd>${type}</dd>
                  <dt>Qismlar</dt><dd>${episodes}</dd>
                  <dt>Davlat</dt><dd>${country || "Noma'lum"}</dd>
                  <dt>Yil</dt><dd>${year || "Noma'lum"}</dd>
                  <dt>Ko'rishlar</dt><dd>${views.toLocaleString()}</dd>
                </dl>
              </div>
            </aside>
          </div>
          <!-- Shunga o'xshash animelar -->
              <section class="detail__section" id="recommendedSection">
                <div class="section__head">
                  <div>
                    <h2 class="section__title section__title--sm">Shunga o'xshash animelar</h2>
                    <p class="section__sub">Xuddi shu janrdagi tasodifiy takliflar</p>
                  </div>
                </div>
                <div class="custom-carousel" id="recommendedCarousel">
                  ${loader('Tavsiyalar yuklanmoqda...')}
                </div>
              </section>
        </div>
      </div>
    `;

    // Shunga o'xshash animelarni yuklash
    loadRecommendations(genres, id);

    // Video pleyerni ishga tushirish
    const playerBox = document.getElementById('playerBox');

    if (playerBox) {
      if (isSoon) {
        playerBox.innerHTML = `
          <div class="player__placeholder">
            <span>🕐</span>
            <p>Tez orada</p>
            <small>Bu anime hali chiqmagan</small>
          </div>
        `;
      } else {
        let videoSrc = null;
        let isIframeVideo = false;

        if (mainVideoUrl) {
          videoSrc = mainVideoUrl;
          isIframeVideo = mainVideoUrl.includes('<iframe');
        } else if (firstValidSeries?.video_url) {
          videoSrc = firstValidSeries.video_url;
          isIframeVideo = firstValidSeries.video_url.includes('<iframe');
        }

        if (isIframeVideo && videoSrc) {
          playerBox.innerHTML = videoSrc;
        } else if (videoSrc && videoSrc !== '-' && videoSrc !== '---') {
          currentPlayer = new VideoPlayer(playerBox, {
            src: videoSrc,
            poster: img,
            title: firstValidSeries?.title || title,
            autoplay: false
          });
        } else {
          playerBox.innerHTML = `
            <div class="player__placeholder">
              <span>▶</span>
              <p>Video mavjud emas</p>
              <small>Tez orada qo'shiladi</small>
            </div>
          `;
        }
      }
    }

    // Favorit tugmasi
    document.getElementById('favBtn')?.addEventListener('click', (e) => {
      const nowFav = favorites.toggle(adapted);
      e.target.classList.toggle('is-active', nowFav);
      e.target.innerHTML = `♥ ${nowFav ? 'Sevimlilarda' : "Sevimlilarga qo'shish"}`;
    });

    // Ko'rish tugmasi
    document.getElementById('watchBtn')?.addEventListener('click', () => {
      document.getElementById('playerSection')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Qismlar ro'yxati
    document.querySelectorAll('.episode-item:not([disabled])').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.episode-item').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const isIframe = btn.dataset.iframe === 'true';
        const title = btn.dataset.title;
        const poster = btn.dataset.poster;
        const playerBox = document.getElementById('playerBox');

        if (!playerBox) return;

        if (currentPlayer) {
          currentPlayer.destroy();
          currentPlayer = null;
        }

        if (isIframe) {
          const videoUrl = decodeURIComponent(btn.dataset.video);
          playerBox.innerHTML = `
            <div class="vp-iframe-wrapper">
              ${videoUrl}
            </div>
          `;
        } else {
          const videoUrl = btn.dataset.video;
          if (videoUrl) {
            currentPlayer = new VideoPlayer(playerBox, {
              src: videoUrl,
              poster: poster,
              title: title,
              autoplay: false
            });
          }
        }

        const playerTitle = document.querySelector('#playerSection .section__title--sm');
        if (playerTitle) playerTitle.textContent = title;

        document.getElementById('playerSection')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

  } catch (e) {
    console.error('Detail mount error:', e);
    
    // Xatolik turiga qarab ishlov berish
    if (e.response?.status === 404 || e.status === 404) {
      handleNotFound(root, id);
    } else {
      // Boshqa xatoliklar uchun
      root.innerHTML = errorState("Anime ma'lumotlarini yuklab bo'lmadi.");
      set404SEOMeta(`Anime topilmadi`);
    }
  }
}

// 404 holatini boshqarish funksiyasi
function handleNotFound(root, id) {
  // Meta robotlarni noindex, nofollow qilish
  set404SEOMeta(`Anime topilmadi (#${id})`);
  
  // 404 sahifa kontentini ko'rsatish
  root.innerHTML = `
    <div class="not-found-page">
      <div class="not-found-content">
        <div class="not-found-icon">🔍</div>
        <h1 class="not-found-title">Anime topilmadi</h1>
        <p class="not-found-text">
          Kechirasiz, siz qidirayotgan anime (#${id}) topilmadi yoki o'chirilgan bo'lishi mumkin.
        </p>
        <div class="not-found-actions">
          <a href="/" class="btn btn--primary" data-link>
            <span>🏠</span>
            Bosh sahifaga qaytish
          </a>
          <a href="/anime" class="btn btn--outline" data-link>
            <span>📺</span>
            Barcha animelar
          </a>
        </div>
        <div class="not-found-suggestions">
          <h3>Sizga yoqishi mumkin:</h3>
          <div id="notFoundSuggestions" class="custom-carousel">
            ${loader('Tavsiyalar yuklanmoqda...')}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Tavsiyalarni yuklash
  loadNotFoundSuggestions();
}

// Tavsiyalarni yuklash funksiyasi
async function loadRecommendations(genres, currentId) {
  const carousel = document.getElementById('recommendedCarousel');
  if (!carousel) return;

  try {
    let allRecommendations = [];

    // Agar janrlar bo'lsa, birinchi janr bo'yicha qidiramiz
    if (genres && genres.length > 0) {
      // Bir nechta janrlarni sinab ko'ramiz
      for (const genre of genres) {
        try {
          const res = await api.randomByGenre(genre.trim());
          const list = res.data || res || [];
          const adaptedList = list.map(adaptAFDToCard);

          // Hozirgi animeni filtrlaymiz (o'zini ko'rsatmaslik uchun)
          const filtered = adaptedList.filter(a => a.mal_id != currentId);
          allRecommendations = allRecommendations.concat(filtered);

          // 10 tadan ko'p bo'lsa to'xtatamiz
          if (allRecommendations.length >= 10) break;
        } catch (e) {
          console.warn(`"${genre}" janri bo'yicha tavsiyalar topilmadi:`, e);
        }
      }
    }

    // Agar tavsiyalar topilmasa, boshqa usul: random anime
    if (allRecommendations.length === 0) {
      try {
        const res = await api.home(20);
        const list = res.data || res || [];
        const adaptedList = list.map(adaptAFDToCard);
        // Hozirgi animeni filtrlaymiz
        allRecommendations = adaptedList
          .filter(a => a.mal_id != currentId)
          .sort(() => Math.random() - 0.5);
      } catch (e) {
        console.warn('Alternativ tavsiyalar topilmadi:', e);
      }
    }

    // Kartochkalarni render qilish
    if (allRecommendations.length > 0) {
      // Takrorlanishlarni olib tashlash
      const unique = [];
      const seen = new Set();
      for (const item of allRecommendations) {
        if (!seen.has(item.mal_id)) {
          seen.add(item.mal_id);
          unique.push(item);
        }
      }

      // 10 tadan ko'p bo'lmasin
      const finalList = unique.slice(0, 10);

      carousel.innerHTML = finalList.map(a => animeCard(a)).join('');
      attachCardEvents(carousel);

    } else {
      carousel.innerHTML = `<p class="section__empty">Tavsiyalar topilmadi.</p>`;
    }

  } catch (e) {
    console.error('Tavsiyalarni yuklashda xatolik:', e);
    carousel.innerHTML = `<p class="section__empty">Tavsiyalarni yuklab bo'lmadi.</p>`;
  }
}

// 404 sahifasi uchun tavsiyalar
async function loadNotFoundSuggestions() {
  const container = document.getElementById('notFoundSuggestions');
  if (!container) return;
  
  try {
    const res = await api.home(6);
    const list = res.data || res || [];
    const adaptedList = list.map(adaptAFDToCard);
    
    if (adaptedList.length > 0) {
      container.innerHTML = adaptedList.map(a => animeCard(a)).join('');
      attachCardEvents(container);
    } else {
      container.innerHTML = `<p class="section__empty">Tavsiyalar topilmadi.</p>`;
    }
  } catch (e) {
    console.warn('Tavsiyalar yuklanmadi:', e);
    container.innerHTML = '';
  }
}