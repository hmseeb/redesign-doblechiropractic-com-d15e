/* ============================================================
   Doble Chiropractic & Upper Cervical Care — site scripts
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. Mobile navigation
     --------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) closeNav();
    });
  }

  /* ---------------------------------------------------------
     2. Sticky header shadow
     --------------------------------------------------------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     3. Scroll reveal
     --------------------------------------------------------- */
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealTargets = document.querySelectorAll(
    '.section__head, .card, .conditions__col, .band__grid > *, ' +
    '.special__copy, .special__media, .doctor__media, .doctor__copy, ' +
    '.mission, .hours__card, .contact__info, .formwrap'
  );

  if (!reduceMotion && 'IntersectionObserver' in window) {
    Array.prototype.forEach.call(revealTargets, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealTargets, function (el) { io.observe(el); });

    /* Safety net: a very fast jump-scroll can skip an element entirely so the
       observer never fires for it. Content must never stay invisible — sweep
       anything at or above the viewport bottom and reveal it. */
    var sweep = function () {
      var limit = window.innerHeight;
      Array.prototype.forEach.call(revealTargets, function (el) {
        if (el.classList.contains('is-visible')) return;
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    };
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);
    window.addEventListener('load', sweep);
  }

  /* ---------------------------------------------------------
     4. Contact form — LeadrVision
     --------------------------------------------------------- */
  var ENDPOINT = 'https://vision.leadrai.com/api/forms/6836675363c8a1cc4fbb14dc2a805402';

  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  var pageField = document.getElementById('pageField');
  var submitBtn = document.getElementById('submitBtn');

  /* Hidden _page field always carries the current URL so visitors
     are returned to the right page after a plain HTML submission. */
  if (pageField) pageField.value = window.location.href;

  function showSuccess(scroll) {
    if (!success) return;
    success.hidden = false;
    if (scroll) {
      success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }
  }

  /* Plain (no-JS / fallback) submissions come back with ?submitted=1 */
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('submitted') === '1') {
      showSuccess(true);
      if (form) form.hidden = true;
    }
  } catch (err) { /* URLSearchParams unsupported — plain form still works */ }

  function clearError(field) {
    field.classList.remove('has-error');
    field.removeAttribute('aria-invalid');
    var note = field.parentNode.querySelector('.err');
    if (note) note.remove();
  }

  function setError(field, message) {
    field.classList.add('has-error');
    field.setAttribute('aria-invalid', 'true');
    if (!field.parentNode.querySelector('.err')) {
      var note = document.createElement('p');
      note.className = 'err';
      note.textContent = message;
      field.parentNode.appendChild(note);
    }
  }

  function validate() {
    var ok = true;
    var first = null;
    var required = form.querySelectorAll('[required]');

    Array.prototype.forEach.call(required, function (field) {
      clearError(field);
      var value = (field.value || '').trim();
      var message = '';

      if (!value) {
        message = 'This field is required.';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        message = 'Please enter a valid email address.';
      } else if (field.type === 'tel' && value.replace(/[^0-9]/g, '').length < 10) {
        message = 'Please enter a 10-digit phone number.';
      }

      if (message) {
        ok = false;
        setError(field, message);
        if (!first) first = field;
      }
    });

    if (first) first.focus();
    return ok;
  }

  if (form) {
    Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (field) {
      field.addEventListener('input', function () { clearError(field); });
    });

    form.addEventListener('submit', function (e) {
      // Keep the plain POST path alive if fetch is unavailable.
      if (typeof window.fetch !== 'function') {
        if (!validate()) e.preventDefault();
        return;
      }

      e.preventDefault();
      if (!validate()) return;

      if (pageField) pageField.value = window.location.href;

      var data = {};
      new FormData(form).forEach(function (value, key) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          data[key] = [].concat(data[key], value);
        } else {
          data[key] = value;
        }
      });
      data._page = window.location.href;

      var label = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed: ' + res.status);
          return res.json().catch(function () { return { ok: true }; });
        })
        .then(function (json) {
          if (json && json.ok === false) throw new Error('Submission rejected');
          form.reset();
          if (pageField) pageField.value = window.location.href;
          form.hidden = true;
          showSuccess(true);
        })
        .catch(function () {
          // Network/JS failure: fall back to a real browser POST.
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = label;
          }
          HTMLFormElement.prototype.submit.call(form);
        });
    });
  }

  /* ---------------------------------------------------------
     5. Current year in footer copyright (keeps content fresh)
     --------------------------------------------------------- */
  var yearNodes = document.querySelectorAll('[data-year]');
  Array.prototype.forEach.call(yearNodes, function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();
