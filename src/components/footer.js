export function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__brand">
          <span class="nav__logo-mark">新</span>
          <span class="nav__logo-text">SHINGEKI</span>
          <p>O'zbek anime ishqibozlari uchun katalog va kashfiyot maskani.</p>
        </div>
        <div class="footer__cols">
          <div>
            <h4>Navigatsiya</h4>
            <a href="#/">Bosh sahifa</a>
            <a href="#/all-animes">Barcha animelar</a>
            <a href="#/favorites">Sevimlilar</a>
          </div>
        </div>
      </div>
      <div class="footer__bottom">© ${new Date().getFullYear()} SHINGEKI — muxlislar tomonidan, muxlislar uchun.</div>
    </footer>
  `;
}
