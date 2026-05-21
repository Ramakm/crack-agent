/* ============================================================
   Crack Agent — Generative AI Course Documentation
   main.js — Navigation, sidebar, copy buttons, TOC scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sidebar toggle (mobile) ── */
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  /* ── Sidebar module accordion — each section toggles independently ── */
  document.querySelectorAll('.nav-module-header[data-toggle]').forEach(header => {
    header.addEventListener('click', () => {
      header.closest('.nav-module').classList.toggle('open');
    });
  });

  /* ── Auto-open active module ── */
  const activeLink = document.querySelector('.nav-sub a.active');
  if (activeLink) {
    const module = activeLink.closest('.nav-module');
    if (module) module.classList.add('open');
    const header = module.querySelector('.nav-module-header');
    if (header) header.classList.add('active');
  }

  /* ── Copy code buttons ── */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-block').querySelector('pre');
      const text = pre ? pre.innerText : '';
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        btn.textContent = 'Error';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    });
  });

  /* ── TOC scroll spy ── */
  const tocLinks = document.querySelectorAll('.toc-inner a');
  const sections = [];
  tocLinks.forEach(a => {
    const id = a.getAttribute('href').replace('#', '');
    const el = document.getElementById(id);
    if (el) sections.push({ el, a });
  });

  if (sections.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const found = sections.find(s => s.el === entry.target);
        if (found) {
          if (entry.isIntersecting) {
            tocLinks.forEach(l => l.classList.remove('toc-active'));
            found.a.classList.add('toc-active');
          }
        }
      });
    }, { rootMargin: '-56px 0px -60% 0px' });

    sections.forEach(s => observer.observe(s.el));
  }

  /* ── Sidebar scroll-spy for nav-sub links ── */
  const navSubLinks = document.querySelectorAll('.nav-sub a');
  const navSections = [];
  navSubLinks.forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) navSections.push({ el, a });
    }
  });

  if (navSections.length) {
    const observer2 = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const found = navSections.find(s => s.el === entry.target);
        if (found && entry.isIntersecting) {
          navSubLinks.forEach(l => l.classList.remove('active'));
          found.a.classList.add('active');
        }
      });
    }, { rootMargin: '-56px 0px -55% 0px' });

    navSections.forEach(s => observer2.observe(s.el));
  }

});
