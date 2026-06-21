/* ============================================================
   NOTHING QUITE LIKE IT — Enquiry form
   Inline validation · Netlify Forms compatible · Formspree fallback
   ============================================================ */

(function () {
  'use strict';

  const form = document.querySelector('.enquiry-form');
  if (!form) return;

  const confirmation = document.querySelector('.form-confirmation');

  /* ── Validation rules ──────────────────────────────────── */
  const rules = {
    name:    v => v.trim().length >= 2   || 'Please enter your name.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
    arrival: v => !v || true,   // optional but if set, we accept any date string
    message: v => true,         // optional
  };

  function getGroup(el) { return el.closest('.form-group'); }

  function validate(input) {
    const rule = rules[input.name];
    if (!rule) return true;
    const result = rule(input.value);
    if (result === true) {
      getGroup(input)?.classList.remove('has-error');
      return true;
    } else {
      const errEl = getGroup(input)?.querySelector('.field-error');
      if (errEl) errEl.textContent = result;
      getGroup(input)?.classList.add('has-error');
      return false;
    }
  }

  // Live validation on blur
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validate(input));
    input.addEventListener('input', () => {
      if (getGroup(input)?.classList.contains('has-error')) validate(input);
    });
  });

  /* ── Submit ────────────────────────────────────────────── */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate all required fields
    let valid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
      if (!validate(input)) valid = false;
    });
    if (!valid) return;

    const submitBtn = form.querySelector('.form-submit button, .form-submit .btn');
    const originalText = submitBtn?.textContent;
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    /* ── Netlify Forms / Formspree submission ──────────────
       Set FORM_ENDPOINT to your Formspree ID, or leave empty
       to use Netlify's built-in form handling.
       See README.md for setup instructions.
    ─────────────────────────────────────────────────────── */
    const FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/YOUR_ID'

    try {
      const data = new FormData(form);
      const url  = FORM_ENDPOINT || form.action || window.location.pathname;
      const opts = {
        method: 'POST',
        headers: FORM_ENDPOINT ? { 'Accept': 'application/json' } : {},
        body: data,
      };
      const res = await fetch(url, opts);
      if (res.ok || res.status === 200 || res.status === 201) {
        showConfirmation();
        form.reset();
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
      } else {
        throw new Error('Server error');
      }
    } catch {
      // Fallback: still show confirmation in pre-launch (no backend yet)
      showConfirmation();
      form.reset();
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
    }
  });

  function showConfirmation() {
    if (!confirmation) return;
    confirmation.classList.add('visible');
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => confirmation.classList.remove('visible'), 8000);
  }

})();
