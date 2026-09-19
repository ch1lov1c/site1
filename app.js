document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('[data-slider]');

  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    const dotsWrap = slider.querySelector('.slider-dots');

    if (!slides.length) return;

    if (slides.length < 2) {
      slider.classList.add('is-single');
      slides[0].classList.add('is-active');
      return;
    }

    let index = 0;

    const dots = slides.map((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', `Открыть фото ${i + 1}`);
      btn.addEventListener('click', () => show(i));
      dotsWrap.appendChild(btn);
      return btn;
    });

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });
    }

    prevBtn?.addEventListener('click', () => show(index - 1));
    nextBtn?.addEventListener('click', () => show(index + 1));

    let startX = 0;
    slider.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });

    let autoRotate = null;

    function startAuto() {
      if (slides.length < 2) return;
      stopAuto();
      autoRotate = window.setInterval(() => show(index + 1), 4500);
    }

    function stopAuto() {
      if (autoRotate) window.clearInterval(autoRotate);
    }

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('focusout', startAuto);
    slider.addEventListener('touchstart', stopAuto, { passive: true });
    slider.addEventListener('touchend', startAuto, { passive: true });

    show(0);
    startAuto();
  });
});
