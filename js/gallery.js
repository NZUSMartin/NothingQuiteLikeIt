/* ============================================================
   NOTHING QUITE LIKE IT — Gallery & Lightbox
   ============================================================ */

(function () {
  'use strict';

  const items    = Array.from(document.querySelectorAll('.gallery__item[data-src]'));
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox || !items.length) return;

  const img     = lightbox.querySelector('.lightbox__img');
  const caption = lightbox.querySelector('.lightbox__caption');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn  = lightbox.querySelector('.lightbox__prev');
  const nextBtn  = lightbox.querySelector('.lightbox__next');

  let currentIndex = 0;

  function open(index) {
    currentIndex = index;
    const item = items[index];
    img.src = item.dataset.src;
    img.alt = item.dataset.label || '';
    if (caption) caption.textContent = item.dataset.label || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    items[currentIndex]?.querySelector('img')?.closest('.gallery__item')?.focus();
  }

  function navigate(dir) {
    let next = currentIndex + dir;
    if (next < 0) next = items.length - 1;
    if (next >= items.length) next = 0;
    open(next);
  }

  // Open on click
  items.forEach((item, i) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View ${item.dataset.label || 'image'}`);
    item.addEventListener('click', () => open(i));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => navigate(-1));
  nextBtn?.addEventListener('click', () => navigate(1));

  // Keyboard nav
  lightbox.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')    close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Close on backdrop
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

})();
