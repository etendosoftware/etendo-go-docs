(function () {
  function initHeroBg() {
    var bg = document.querySelector('.etendo-home__hero-bg');
    var hero = document.querySelector('.etendo-home__hero');
    if (!bg || !hero) return;

    var BASE_OPACITY = 0.1;

    function update() {
      var heroH = hero.offsetHeight;
      var scrollY = window.scrollY || window.pageYOffset;
      var progress = Math.min(scrollY / (heroH * 0.5), 1);
      bg.style.opacity = BASE_OPACITY * (1 - progress);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // Runs on full load and on MkDocs instant navigation
  document.addEventListener('DOMContentLoaded', initHeroBg);
  document.addEventListener('DOMSwitch', initHeroBg);
})();
