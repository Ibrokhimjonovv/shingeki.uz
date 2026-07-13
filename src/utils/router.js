// src/utils/router.js
export function navigateTo(path) {
    // History API orqali URL'ni o'zgartiramiz, lekin sahifani qayta yuklamaymiz
    window.history.pushState({}, '', path);
    
    // Hashchange event o'rniga popstate event ishlatamiz
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  
  export function getCurrentPath() {
    // URL'dan path'ni olamiz (# belgisisiz)
    return window.location.pathname + window.location.search;
  }