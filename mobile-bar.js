/* Нижняя панель связи: появляется после hero (моб.) */
(function () {
  var bar = document.querySelector('.sticky-booking');
  var hero = document.querySelector('.hero');
  if (!bar || !hero) return;
  var mq = window.matchMedia('(max-width: 760px)');
  var ticking = false;
  function sync() {
    ticking = false;
    if (!mq.matches) { bar.classList.remove('is-hidden'); return; }
    var limit = hero.offsetHeight - window.innerHeight * 0.25;
    bar.classList.toggle('is-hidden', window.scrollY < Math.max(limit, 0));
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(sync); }
  }, { passive: true });
  window.addEventListener('resize', sync);
  if (mq.addEventListener) mq.addEventListener('change', sync);
  sync();
})();
