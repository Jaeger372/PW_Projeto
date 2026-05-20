/* ============================================
   DUNE UNIVERSE — FACTION SYSTEM
   Sistema global de facção adaptativo
   ============================================ */

const FactionSystem = (() => {
  const STORAGE_KEY = 'dune_faction';

  const factions = {
    atreides: {
      id: 'atreides',
      name: 'Casa Atreides',
      motto: 'Corage e Honra',
      color: '#4a9e6a',
      symbol: '⚔',
      ctaText: 'Traçar o caminho',
      description: 'Nobreza, honra e estratégia definem a Casa Atreides.',
      focus: ['Paul Atreides', 'Lady Jessica', 'Honra', 'Estratégia'],
      highlights: ['personagem-paul', 'personagem-jessica', 'faccao-atreides']
    },
    harkonnen: {
      id: 'harkonnen',
      name: 'Casa Harkonnen',
      motto: 'Poder acima de tudo',
      color: '#c0392b',
      symbol: '⚡',
      ctaText: 'Tomar o poder',
      description: 'Brutalidade, dominação e medo são as ferramentas Harkonnen.',
      focus: ['Baron Harkonnen', 'Poder', 'Medo', 'Guerra'],
      highlights: ['personagem-baron', 'faccao-harkonnen']
    },
    fremen: {
      id: 'fremen',
      name: 'Fremen',
      motto: 'O deserto é nossa arma',
      color: '#2980b9',
      symbol: '◈',
      ctaText: 'Seguir o deserto',
      description: 'Sobrevivência, profecia e o espírito de Arrakis guiam os Fremen.',
      focus: ['Arrakis', 'Profecia', 'Sobrevivência', 'Ecologia'],
      highlights: ['planeta-arrakis', 'faccao-fremen']
    },
    'bene-gesserit': {
      id: 'bene-gesserit',
      name: 'Bene Gesserit',
      motto: 'Ver além do véu',
      color: '#8e44ad',
      symbol: '◉',
      ctaText: 'Ver além',
      description: 'Manipulação, visão e controle das linhagens humanas.',
      focus: ['Lady Jessica', 'Manipulação', 'Visão', 'Linhagem'],
      highlights: ['personagem-jessica', 'faccao-bene-gesserit']
    }
  };

  function get() {
    return localStorage.getItem(STORAGE_KEY) || null;
  }

  function set(factionId) {
    if (!factions[factionId]) return;
    localStorage.setItem(STORAGE_KEY, factionId);
    apply(factionId);
    dispatchEvent(factionId);
  }

  function apply(factionId) {
    document.documentElement.setAttribute('data-faction', factionId);

    // Update nav badge
    const badge = document.querySelector('.nav-faction-badge .badge-name');
    const badgeIcon = document.querySelector('.nav-faction-badge .faction-icon');
    if (badge) {
      const f = factions[factionId];
      badge.textContent = f.name;
      if (badgeIcon) badgeIcon.textContent = f.symbol;
    }

    // Update all CTA texts marked as faction-cta
    document.querySelectorAll('[data-faction-cta]').forEach(el => {
      el.textContent = factions[factionId].ctaText;
    });

    // Update faction-specific text blocks
    document.querySelectorAll('[data-faction-show]').forEach(el => {
      const show = el.getAttribute('data-faction-show');
      el.style.display = show === factionId ? 'block' : 'none';
    });

    // Highlight recommended content
    document.querySelectorAll('.faction-recommended').forEach(el => {
      el.removeAttribute('data-recommended');
    });

    const highlights = factions[factionId].highlights;
    highlights.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('data-recommended', 'true');
    });
  }

  function dispatchEvent(factionId) {
    const event = new CustomEvent('factionChanged', {
      detail: { faction: factionId, data: factions[factionId] }
    });
    window.dispatchEvent(event);
  }

  function init() {
    const saved = get();
    if (saved && factions[saved]) {
      apply(saved);
    }
  }

  function getData(factionId) {
    return factions[factionId] || null;
  }

  function getAll() {
    return factions;
  }

  return { get, set, apply, init, getData, getAll };
})();

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  FactionSystem.init();
});

// Export for global use
window.FactionSystem = FactionSystem;
