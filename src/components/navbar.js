export function renderNavbar(activeRoute = '') {
  return `
  <header class="nav">
    <div class="nav__inner">
      <a href="#/" class="nav__logo">
        <span class="nav__logo-mark">新</span>
        <span class="nav__logo-text">SHINGEKI</span>
      </a>
      <nav class="nav__links">
        <a href="#/" class="${activeRoute === '' ? 'is-active' : ''}">Bosh sahifa</a>
        <a href="#/all-animes" class="${activeRoute === 'all-animes' ? 'is-active' : ''}">Barcha animelar</a>
        <a href="#/favorites" class="${activeRoute === 'favorites' ? 'is-active' : ''}">Sevimlilar</a>
      </nav>
      <form class="nav__search" id="navSearchForm">
        <input type="search" id="navSearchInput" placeholder="Anime nomini kiriting..." autocomplete="off" />
        <button type="submit" aria-label="Qidirish">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </form>
      <!-- Yangi: Mobile search toggle tugmasi -->
      <div style="display: flex">
        <button class="nav__search-toggle" id="navSearchToggle" aria-label="Qidirish">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <button class="nav__burger" id="navBurger" aria-label="Menyu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <!-- Mobile search (navbar tagidan chiqadigan) -->
        <div class="nav__mobile-search" id="navMobileSearch">
          <form class="nav__mobile-search-form" id="navMobileSearchForm">
            <input type="search" id="navMobileSearchInput" placeholder="Anime nomini kiriting..." autocomplete="off" />
            <button type="submit" aria-label="Qidirish">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </form>
        </div>
        <div class="nav__mobile" id="navMobile">
          <a href="#/">Bosh sahifa</a>
          <a href="#/all-animes">Barcha animelar</a>
          <a href="#/favorites">Sevimlilar</a>
        </div>
  </header>
  `;
}

export function attachNavbarEvents(router) {
  const form = document.getElementById('navSearchForm');
  const input = document.getElementById('navSearchInput');
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  
  // Yangi: Mobile search elementlari
  const searchToggle = document.getElementById('navSearchToggle');
  const mobileSearch = document.getElementById('navMobileSearch');
  const mobileForm = document.getElementById('navMobileSearchForm');
  const mobileInput = document.getElementById('navMobileSearchInput');

  // Desktop search
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) {
      window.location.hash = `#/search?q=${encodeURIComponent(q)}`;
    }
  });

  // Mobile search toggle - bosganda ochiladi/yopiladi
  searchToggle?.addEventListener('click', () => {
    mobileSearch.classList.toggle('is-open');
    // Agar burger ochiq bo'lsa, uni yopamiz (chalkashmaslik uchun)
    if (mobile.classList.contains('is-open')) {
      mobile.classList.remove('is-open');
      burger.classList.remove('is-open');
    }
  });

  // Mobile search submit
  mobileForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = mobileInput.value.trim();
    if (q) {
      window.location.hash = `#/search?q=${encodeURIComponent(q)}`;
      // Qidiruvdan keyin search panelni yopish
      mobileSearch.classList.remove('is-open');
    }
  });

  // Mobile searchni tashqariga bosganda yopish
  document.addEventListener('click', (e) => {
    if (mobileSearch.classList.contains('is-open')) {
      const isClickInside = mobileSearch.contains(e.target) || searchToggle?.contains(e.target);
      if (!isClickInside) {
        mobileSearch.classList.remove('is-open');
      }
    }
  });

  // Burger menyu
  burger?.addEventListener('click', () => {
    mobile.classList.toggle('is-open');
    burger.classList.toggle('is-open');
    // Agar mobile search ochiq bo'lsa, uni yopamiz
    if (mobileSearch.classList.contains('is-open')) {
      mobileSearch.classList.remove('is-open');
    }
  });

  document.querySelectorAll('.nav__mobile a').forEach((a) =>
    a.addEventListener('click', () => {
      mobile.classList.remove('is-open');
      burger.classList.remove('is-open');
    })
  );

  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  });
}