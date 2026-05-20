/* ============================================
   DUNE UNIVERSE — NAVIGATION COMPONENT
   Nav + Footer + Faction Selector
   ============================================ */

function renderNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const faction = localStorage.getItem('dune_faction') || 'neutral';
  const factionData = window.FactionSystem ? window.FactionSystem.getData(faction) : null;
  const factionName = factionData ? factionData.name : 'Escolher Facção';
  const factionSymbol = factionData ? factionData.symbol : '◎';

  const navLinks = [
    { href: 'index.html', label: 'Início' },
    { href: 'universo.html', label: 'Universo' },
    {
      href: 'personagens.html', label: 'Personagens',
      dropdown: [
        { href: 'personagem-paul.html', label: 'Paul Atreides' },
        { href: 'personagem-jessica.html', label: 'Lady Jessica' },
        { href: 'personagem-baron.html', label: 'Baron Harkonnen' },
        { href: 'personagem-chani.html', label: 'Chani' },
        { href: 'personagem-stilgar.html', label: 'Stilgar' },
        { href: 'personagem-feyd.html', label: 'Feyd-Rautha' },
        { href: 'personagens.html', label: '→ Todos os Personagens' },
      ]
    },
    {
      href: 'faccoes.html', label: 'Facções',
      dropdown: [
        { href: 'faccao-atreides.html', label: '⚔ Casa Atreides' },
        { href: 'faccao-harkonnen.html', label: '⚡ Casa Harkonnen' },
        { href: 'faccao-fremen.html', label: '◈ Fremen' },
        { href: 'faccao-bene-gesserit.html', label: '◉ Bene Gesserit' },
        { href: 'faccoes.html', label: '→ Todas as Facções' },
      ]
    },
    {
      href: 'filmes.html', label: 'Filmes',
      dropdown: [
        { href: 'filme-dune-2021.html', label: 'Dune (2021)' },
        { href: 'filme-dune-part-two.html', label: 'Dune: Part Two (2024)' },
        { href: 'filme-dune-messiah.html', label: '🔴 Dune: Part Three (2026)' },
        { href: 'filmes.html', label: '→ Todos os Filmes' },
      ]
    },
    { href: 'livros.html', label: 'Livros' },
    {
      href: '#explorar', label: 'Explorar',
      dropdown: [
        { href: 'planetas.html', label: '🌍 Planetas' },
        { href: 'tecnologia.html', label: '⚙ Tecnologia' },
        { href: 'temas.html', label: '📚 Temas' },
        { href: 'timeline.html', label: '⏱ Timeline' },
        { href: 'quiz.html', label: '◎ Quiz de Facção' },
      ]
    },
  ];

  // Build links HTML with dropdown support
  const linksHTML = navLinks.map(l => {
    const isActive = l.href === currentPage ||
      (l.dropdown && l.dropdown.some(d => d.href === currentPage));

    if (l.dropdown) {
      const dropItems = l.dropdown.map(d =>
        `<a href="${d.href}" class="nav-dropdown-item ${d.href === currentPage ? 'active' : ''}">${d.label}</a>`
      ).join('');
      return `
        <div class="nav-item has-dropdown ${isActive ? 'active' : ''}">
          <a href="${l.href === '#explorar' ? '#' : l.href}" class="nav-link ${isActive ? 'active' : ''}">${l.label} <span class="nav-arrow">▾</span></a>
          <div class="nav-dropdown">${dropItems}</div>
        </div>
      `;
    }
    return `<a href="${l.href}" class="nav-link ${isActive ? 'active' : ''}">${l.label}</a>`;
  }).join('');

  // Mobile links (flat)
  const mobileLinksHTML = [
    { href: 'index.html', label: 'Início' },
    { href: 'universo.html', label: 'Universo' },
    { href: 'personagens.html', label: 'Personagens' },
    { href: 'faccoes.html', label: 'Facções' },
    { href: 'filmes.html', label: 'Filmes' },
    { href: 'livros.html', label: 'Livros' },
    { href: 'planetas.html', label: 'Planetas' },
    { href: 'tecnologia.html', label: 'Tecnologia' },
    { href: 'temas.html', label: 'Temas' },
    { href: 'timeline.html', label: 'Timeline' },
    { href: 'quiz.html', label: 'Quiz de Facção' },
  ].map(l => `<a href="${l.href}" class="nav-link">${l.label}</a>`).join('');

  const navHTML = `
    <nav class="nav" id="mainNav">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">DU<span>N</span>E</a>
        <div class="nav-links">
          ${linksHTML}
          <button class="nav-faction-badge" onclick="openFactionSelector()" title="Mudar facção">
            <span class="faction-icon">${factionSymbol}</span>
            <span class="badge-name">${factionName}</span>
          </button>
        </div>
        <div class="hamburger" onclick="toggleMobileMenu()">
          <span></span><span></span><span></span>
        </div>
      </div>
    </nav>

    <!-- Dropdown styles -->
    <style>
      .nav-item { position: relative; }
      .nav-arrow { font-size: 0.55rem; opacity: 0.6; margin-left: 2px; transition: transform 0.2s; }
      .nav-item:hover .nav-arrow { transform: rotate(180deg); opacity: 1; }
      .nav-dropdown {
        position: absolute;
        top: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%);
        min-width: 200px;
        background: rgba(10,8,4,0.97);
        border: 1px solid var(--faction-border, rgba(212,168,67,0.15));
        border-radius: 8px;
        padding: 0.5rem 0;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
        transform: translateX(-50%) translateY(8px);
        backdrop-filter: blur(12px);
        z-index: 600;
        box-shadow: 0 16px 48px rgba(0,0,0,0.5);
      }
      .nav-item:hover .nav-dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
      }
      .nav-dropdown-item {
        display: block;
        padding: 0.6rem 1.25rem;
        font-size: 0.78rem;
        letter-spacing: 0.06em;
        color: rgba(245,240,232,0.5);
        text-decoration: none;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      .nav-dropdown-item:hover,
      .nav-dropdown-item.active {
        color: var(--faction-primary, #d4a843);
        background: var(--faction-glow, rgba(212,168,67,0.04));
        padding-left: 1.5rem;
      }
      .nav-dropdown-item.active {
        font-weight: 600;
      }
    </style>

    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobileMenu">
      <button class="close-btn" onclick="toggleMobileMenu()">✕</button>
      ${mobileLinksHTML}
      <button class="nav-faction-badge" onclick="openFactionSelector(); toggleMobileMenu();" style="margin-top: 1.5rem;">
        <span class="faction-icon">${factionSymbol}</span>
        <span class="badge-name">${factionName}</span>
      </button>
    </div>
  `;

  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    navPlaceholder.innerHTML = navHTML;
  }
}

function renderFooter() {
  const footerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">DUNE Universe</div>
            <p>Portal enciclopédico sobre o universo criado por Frank Herbert. Explore facções, personagens, planetas e os temas profundos que fazem de Dune uma das maiores obras da ficção científica.</p>
            <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap;">
              <a href="quiz.html" style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--faction-primary,#d4a843);border:1px solid var(--faction-border,rgba(212,168,67,0.2));padding:6px 14px;border-radius:20px;text-decoration:none;transition:all .3s;">◎ Quiz de Facção</a>
              <a href="timeline.html" style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(245,240,232,.4);border:1px solid rgba(255,255,255,.06);padding:6px 14px;border-radius:20px;text-decoration:none;transition:all .3s;">⏱ Timeline</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Explorar</h4>
            <ul>
              <li><a href="universo.html">Universo</a></li>
              <li><a href="planetas.html">Planetas</a></li>
              <li><a href="tecnologia.html">Tecnologia</a></li>
              <li><a href="temas.html">Temas</a></li>
              <li><a href="timeline.html">Timeline</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Personagens</h4>
            <ul>
              <li><a href="personagem-paul.html">Paul Atreides</a></li>
              <li><a href="personagem-jessica.html">Lady Jessica</a></li>
              <li><a href="personagem-baron.html">Baron Harkonnen</a></li>
              <li><a href="personagem-chani.html">Chani</a></li>
              <li><a href="personagem-stilgar.html">Stilgar</a></li>
              <li><a href="personagem-feyd.html">Feyd-Rautha</a></li>
              <li><a href="personagem-alia.html">Alia Atreides</a></li>
              <li><a href="personagem-irulan.html">Princesa Irulan</a></li>
              <li><a href="personagem-scytale.html">Scytale</a></li>
              <li><a href="personagens.html">→ Todos</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Facções &amp; Obras</h4>
            <ul>
              <li><a href="faccao-atreides.html">⚔ Casa Atreides</a></li>
              <li><a href="faccao-harkonnen.html">⚡ Casa Harkonnen</a></li>
              <li><a href="faccao-fremen.html">◈ Fremen</a></li>
              <li><a href="faccao-bene-gesserit.html">◉ Bene Gesserit</a></li>
              <li><a href="livros.html">Livros</a></li>
              <li><a href="filme-dune-messiah.html">🔴 Dune: Part Three</a></li>
              <li><a href="filmes.html">Todos os Filmes</a></li>
              <li><a href="quiz.html">Quiz de Facção</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2024 Dune Universe · Portal Não Oficial · Fins Educacionais</span>
          <span>Baseado nas obras de Frank Herbert</span>
        </div>
      </div>
    </footer>
  `;

  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = footerHTML;
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const isOpen = menu.classList.contains('open');
  if (isOpen) {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

// Faction selector modal
function openFactionSelector() {
  // Remove existing if present
  const existing = document.getElementById('faction-modal');
  if (existing) { existing.remove(); return; }

  const m = document.createElement('div');
  m.id = 'faction-modal';
  m.innerHTML = `
    <div class="faction-modal-overlay" onclick="closeFactionModal()"></div>
    <div class="faction-modal-box">
      <button class="faction-modal-close" onclick="closeFactionModal()">✕</button>
      <h3>Mudar Facção</h3>
      <p>A tua experiência será adaptada.</p>
      <div class="faction-modal-grid">
        <button onclick="changeFaction('atreides')" class="fm-btn ${localStorage.getItem('dune_faction') === 'atreides' ? 'active' : ''}" data-f="atreides">
          <span>⚔</span> Casa Atreides
        </button>
        <button onclick="changeFaction('harkonnen')" class="fm-btn ${localStorage.getItem('dune_faction') === 'harkonnen' ? 'active' : ''}" data-f="harkonnen">
          <span>⚡</span> Casa Harkonnen
        </button>
        <button onclick="changeFaction('fremen')" class="fm-btn ${localStorage.getItem('dune_faction') === 'fremen' ? 'active' : ''}" data-f="fremen">
          <span>◈</span> Fremen
        </button>
        <button onclick="changeFaction('bene-gesserit')" class="fm-btn ${localStorage.getItem('dune_faction') === 'bene-gesserit' ? 'active' : ''}" data-f="bene-gesserit">
          <span>◉</span> Bene Gesserit
        </button>
      </div>
      <div style="text-align:center;margin-top:1.2rem;">
        <a href="quiz.html" style="font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--faction-primary,#d4a843);opacity:.6;text-decoration:none;">Não tens a certeza? Faz o quiz →</a>
      </div>
    </div>
  `;
  m.style.cssText = `
    position: fixed; inset: 0; z-index: 800; display: flex;
    align-items: center; justify-content: center;
  `;

  const style = document.createElement('style');
  style.id = 'faction-modal-style';
  style.textContent = `
    .faction-modal-overlay {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(8px);
    }
    .faction-modal-box {
      position: relative; z-index: 1;
      background: #0f0d0a;
      border: 1px solid var(--faction-border);
      border-radius: 12px;
      padding: 2.5rem;
      max-width: 420px;
      width: 90%;
      text-align: center;
      animation: fadeInUp 0.3s ease;
    }
    .faction-modal-box h3 {
      font-family: 'Cinzel', serif;
      font-size: 1.2rem;
      letter-spacing: 0.1em;
      color: var(--faction-primary);
      margin-bottom: 0.5rem;
    }
    .faction-modal-box p {
      font-size: 0.8rem;
      color: var(--faction-muted);
      margin-bottom: 1.5rem;
    }
    .faction-modal-close {
      position: absolute; top: 1rem; right: 1rem;
      background: none; border: none;
      color: var(--faction-muted); cursor: pointer;
      font-size: 1rem; transition: color 0.2s;
    }
    .faction-modal-close:hover { color: var(--faction-primary); }
    .faction-modal-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    }
    .fm-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      color: rgba(245,240,232,0.6);
      font-family: 'Raleway', sans-serif;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .fm-btn:hover, .fm-btn.active {
      border-color: var(--faction-primary);
      color: var(--faction-primary);
      background: var(--faction-glow);
    }
    .fm-btn[data-f="atreides"]:hover, .fm-btn[data-f="atreides"].active { border-color: #4a9e6a; color: #4a9e6a; background: rgba(74,158,106,0.08); }
    .fm-btn[data-f="harkonnen"]:hover, .fm-btn[data-f="harkonnen"].active { border-color: #c0392b; color: #c0392b; background: rgba(192,57,43,0.08); }
    .fm-btn[data-f="fremen"]:hover, .fm-btn[data-f="fremen"].active { border-color: #2980b9; color: #2980b9; background: rgba(41,128,185,0.08); }
    .fm-btn[data-f="bene-gesserit"]:hover, .fm-btn[data-f="bene-gesserit"].active { border-color: #8e44ad; color: #8e44ad; background: rgba(142,68,173,0.08); }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(style);
  document.body.appendChild(m);
  document.body.style.overflow = 'hidden';
}

function closeFactionModal() {
  const modal = document.getElementById('faction-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
  const style = document.getElementById('faction-modal-style');
  if (style) style.remove();
}

function changeFaction(id) {
  if (window.FactionSystem) {
    FactionSystem.set(id);
  } else {
    localStorage.setItem('dune_faction', id);
    document.documentElement.setAttribute('data-faction', id);
  }
  closeFactionModal();
  renderNav();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();

  // Apply faction from storage
  const saved = localStorage.getItem('dune_faction');
  if (saved && window.FactionSystem) {
    FactionSystem.apply(saved);
  } else if (saved) {
    document.documentElement.setAttribute('data-faction', saved);
  }
});
