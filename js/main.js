/* ============================================================
   NOTHING QUITE LIKE IT — Main JS
   Sticky header · scroll reveals · mobile nav · register form
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky header ─────────────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () =>
      header.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav ────────────────────────────────────────── */
  const menuBtn  = document.querySelector('.header__menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      mobileNav.classList.toggle('open', !expanded);
      document.body.style.overflow = expanded ? '' : 'hidden';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll reveals (Intersection Observer) ─────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => io.observe(el));
  }

  /* ── Gallery filter ────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.gallery__filter-btn');
  const galleryItems = document.querySelectorAll('.gallery__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.group === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ── Register interest form ────────────────────────────── */
  const registerForm = document.querySelector('.register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = registerForm.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      const btn = registerForm.querySelector('button[type="submit"]');
      btn.textContent = 'Registered';
      btn.disabled = true;
      registerForm.querySelector('input').disabled = true;
    });
  }

  /* ── Smooth anchor scrolling with header offset ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = (header?.offsetHeight ?? 72) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
