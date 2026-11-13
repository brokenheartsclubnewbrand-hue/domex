(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMenu() {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Otwórz menu');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    navigation.classList.toggle('open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  window.matchMedia('(min-width: 851px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  document.querySelector('#year').textContent = new Date().getFullYear();

  const company = window.DOMEX_COMPANY || {};
  document.querySelectorAll('[data-contact]').forEach(link => {
    const kind = link.dataset.contact;
    const value = (company[kind] || '').trim();
    if (!value) return;
    if (kind === 'phone') {
      if (!/^\+?[\d\s()-]{7,30}$/.test(value)) return;
      link.href = 'tel:' + value.replace(/[^+\d]/g, '');
      link.querySelector('span').textContent = value;
    } else if (kind === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
      link.href = 'mailto:' + value;
      link.querySelector('span').textContent = value;
    } else {
      let url;
      try { url = new URL(value, location.href); } catch { return; }
      if (!['https:', 'http:'].includes(url.protocol)) return;
      link.href = url.href;
      if (kind === 'facebook') { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    }
    link.hidden = false;
  });

  const navLinks = [...navigation.querySelectorAll('a')];
  const sections = navLinks.map(link => document.querySelector(link.hash));
  if ('IntersectionObserver' in window) {
    let scrollFrame = false;
    function updateNavigation() {
      const threshold = document.querySelector('.site-header').offsetHeight + 90;
      const current = [...sections].reverse().find(section => section && section.getBoundingClientRect().top <= threshold) || sections[0];
      navLinks.forEach(link => {
        const active = link.hash === '#' + current.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
      scrollFrame = false;
    }
    window.addEventListener('scroll', () => {
      if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(updateNavigation); }
    }, { passive: true });
    updateNavigation();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.remove('pending'); revealObserver.unobserve(entry.target); }
      }), { threshold: .06 });
      document.querySelectorAll('.service-card, .about-copy, .gallery-item, .area-inner').forEach(element => {
        element.classList.add('reveal', 'pending'); revealObserver.observe(element);
      });
    }
    const mobileQuote = document.querySelector('.mobile-quote');
    new IntersectionObserver(entries => mobileQuote.classList.toggle('obscured', entries[0].isIntersecting), { threshold: .05 }).observe(document.querySelector('.quote-form'));
  }

  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = lightbox.querySelector('img');
  let photoIndex = 0;
  function showPhoto(index) {
    photoIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[photoIndex];
    lightboxImage.src = item.dataset.image;
    lightboxImage.alt = item.dataset.caption;
    document.querySelector('#lightbox-caption').textContent = item.dataset.caption + ' · ' + (photoIndex + 1) + '/' + galleryItems.length;
  }
  galleryItems.forEach((item, index) => item.addEventListener('click', () => { showPhoto(index); lightbox.showModal(); }));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(photoIndex + 1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) { const rect = lightbox.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) lightbox.close(); } });
  lightbox.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') showPhoto(photoIndex - 1); if (event.key === 'ArrowRight') showPhoto(photoIndex + 1); });
  let touchStart = null;
  lightbox.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', event => { if (touchStart === null) return; const delta = event.changedTouches[0].clientX - touchStart; if (Math.abs(delta) > 50) showPhoto(photoIndex + (delta < 0 ? 1 : -1)); touchStart = null; }, { passive: true });

  const form = document.querySelector('.quote-form');
  const phone = form.elements.phone;
  const email = form.elements.email;
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('[type=submit]');
  const submitLabel = submit.querySelector('span');
  function validateContact() {
    phone.setCustomValidity('');
    email.setCustomValidity('');
    if (!phone.value.trim() && !email.value.trim()) phone.setCustomValidity('Podaj numer telefonu lub adres e-mail.');
    else if (phone.value.trim() && !/^\+?[\d\s()-]{7,30}$/.test(phone.value.trim())) phone.setCustomValidity('Podaj poprawny numer telefonu (co najmniej 7 cyfr).');
    else if (phone.value.trim() && phone.value.replace(/\D/g, '').length < 7) phone.setCustomValidity('Numer telefonu musi zawierać co najmniej 7 cyfr.');
  }
  [phone, email].forEach(input => input.addEventListener('input', validateContact));
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { form.elements.service.value = link.dataset.service; }));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    validateContact();
    if (!form.reportValidity()) return;
    status.hidden = true;
    status.classList.remove('error');
    submit.disabled = true;
    submitLabel.textContent = 'Wysyłanie zapytania…';
    form.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString(), signal: controller.signal });
      if (!response.ok) throw new Error('Submission rejected');
      status.textContent = 'Dziękujemy! Twoje zapytanie zostało wysłane. DOMEX skontaktuje się z Tobą, aby omówić szczegóły.';
      form.reset();
      phone.setCustomValidity('');
    } catch {
      status.classList.add('error');
      status.textContent = 'Nie udało się potwierdzić wysłania zapytania. Spróbuj ponownie za chwilę. Wpisane informacje pozostały w formularzu.';
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
      submitLabel.textContent = 'Wyślij zapytanie o wycenę';
      form.removeAttribute('aria-busy');
      status.hidden = false;
      status.focus({ preventScroll: true });
    }
  });
})();
