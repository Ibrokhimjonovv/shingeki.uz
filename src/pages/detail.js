import { api } from '../api.js';
import { favorites } from '../favorites.js';
import { loader, errorState } from '../components/states.js';
import { adaptAFDToCard } from '../utils/adapters.js';
import { VideoPlayer } from '../components/videoPlayer.js';
import { animeCard, attachCardEvents } from '../components/card.js';
import { updateSEO, clearSEO } from '../utils/seo.js';

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
    const anime = res.data || res;

    // ========== SEO teglarni yangilash ==========
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
          <!-- ========== YANGI: Shunga o'xshash animelar ========== -->
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

    // ========== YANGI: Shunga o'xshash animelarni yuklash ==========
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
    root.innerHTML = errorState("Anime ma'lumotlarini yuklab bo'lmadi.");

     // Xato bo'lsa SEO ni tozalaymiz
     clearSEO();
  }
}

// ========== Tavsiyalarni yuklash funksiyasi ==========
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
          // if (allRecommendations.length >= 10) break;
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
          .sort(() => Math.random() - 0.5)
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
      const finalList = unique;

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