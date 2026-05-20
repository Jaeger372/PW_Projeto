/* ============================================
   DUNE UNIVERSE — MAIN JS
   Navegação, animações, utilidades globais
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- PAGE LOADER ----
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1600);
  }

  // ---- NAVBAR SCROLL ----
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ---- ACTIVE NAV LINK ----
  const navLinks = document.querySelectorAll('.nav-link[href]');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- HAMBURGER MENU ----
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu .close-btn');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---- SCROLL REVEAL ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ---- TAB SYSTEM ----
  document.querySelectorAll('.tab-nav').forEach(tabNav => {
    const tabs = tabNav.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        const container = tabNav.closest('[data-tabs]') || tabNav.parentElement;

        tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');

        container.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });

        const targetContent = container.querySelector(`#${target}`);
        if (targetContent) targetContent.classList.add('active');
      });
    });
  });

  // ---- SAND PARTICLES ----
  const particleContainers = document.querySelectorAll('.sand-particles');
  particleContainers.forEach(container => {
    createSandParticles(container);
  });

  function createSandParticles(container) {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('sand-particle');
      p.style.top = `${Math.random() * 100}%`;
      p.style.left = `${Math.random() * -20}%`;
      p.style.animationDuration = `${8 + Math.random() * 20}s`;
      p.style.animationDelay = `${Math.random() * 15}s`;
      p.style.width = `${1 + Math.random() * 3}px`;
      p.style.height = p.style.width;
      p.style.opacity = `${0.2 + Math.random() * 0.5}`;
      container.appendChild(p);
    }
  }

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- PROGRESS BARS ANIMATION ----
  const progressBars = document.querySelectorAll('.progress-fill[data-width]');
  const progressObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.getAttribute('data-width');
        el.style.width = width + '%';
        progressObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  progressBars.forEach(bar => {
    bar.style.width = '0%';
    progressObserver.observe(bar);
  });

  // ---- PARALLAX HERO ----
  const heroBg = document.querySelector('.hero-bg[data-parallax]');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      heroBg.style.transform = `translateY(${scroll * 0.4}px)`;
    }, { passive: true });
  }

  // ---- COUNTER ANIMATION ----
  function animateCounter(el, target, duration = 2000) {
    const start = parseInt(el.textContent) || 0;
    const range = target - start;
    const startTime = Date.now();

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + range * ease);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.getAttribute('data-counter')));
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ---- SPLIT SCREEN HOVER (conflict section) ----
  const splitLeft = document.querySelector('.split-left');
  const splitRight = document.querySelector('.split-right');
  const splitWrapper = document.querySelector('.split-screen');

  if (splitLeft && splitRight && splitWrapper) {
    splitLeft.addEventListener('mouseenter', () => {
      splitWrapper.classList.add('hover-left');
      splitWrapper.classList.remove('hover-right');
    });
    splitRight.addEventListener('mouseenter', () => {
      splitWrapper.classList.add('hover-right');
      splitWrapper.classList.remove('hover-left');
    });
    splitWrapper.addEventListener('mouseleave', () => {
      splitWrapper.classList.remove('hover-left', 'hover-right');
    });
  }

  // ---- ACCORDION ----
  document.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));

      // Open clicked if was closed
      if (!isOpen) item.classList.add('open');
    });
  });

  // ---- TOOLTIP ----
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      const text = el.getAttribute('data-tooltip');
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = text;
      document.body.appendChild(tooltip);

      const rect = el.getBoundingClientRect();
      tooltip.style.cssText = `
        position: fixed;
        top: ${rect.top - tooltip.offsetHeight - 8}px;
        left: ${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px;
        background: rgba(10,8,4,0.95);
        border: 1px solid var(--faction-border);
        color: var(--faction-text);
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 0.75rem;
        z-index: 999;
        pointer-events: none;
        white-space: nowrap;
      `;

      el._tooltip = tooltip;
    });

    el.addEventListener('mouseleave', () => {
      if (el._tooltip) {
        el._tooltip.remove();
        el._tooltip = null;
      }
    });
  });

});

// ---- UTILITY FUNCTIONS ----
window.DuneUtils = {
  formatDate: (date) => new Date(date).toLocaleDateString('pt-PT'),
  truncate: (str, len = 100) => str.length > len ? str.slice(0, len) + '...' : str,
  debounce: (fn, ms = 300) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }
};
