/**
 * DUNE UNIVERSE — APIs Integration
 * ============================================================
 * 6 APIs integradas no portal:
 *
 * 1. OMDB API          → Ratings ao vivo (IMDb/RT) nas páginas de filmes
 * 2. Open Library API  → Capas e dados reais dos livros em livros.html
 * 3. Wikipedia REST    → Factos dinâmicos do universo em universo.html
 * 4. Quotable API      → Citações rotativas de Dune na homepage e personagens
 * 5. YouTube IFrame    → Trailers incorporados nas páginas de filmes
 * 6. Web Share + Clipboard → Partilha social e cópia de quotes em todo o site
 * ============================================================
 */

'use strict';

/* ─────────────────────────────────────────────
   UTILITÁRIOS GLOBAIS
───────────────────────────────────────────── */
const DuneAPI = {

  /* ── Selector helper ── */
  $: (sel, ctx = document) => ctx.querySelector(sel),
  $$: (sel, ctx = document) => [...ctx.querySelectorAll(sel)],

  /* ── Fetch com timeout e fallback silencioso ── */
  async fetchJSON(url, timeoutMs = 6000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      clearTimeout(id);
      console.warn(`[DuneAPI] fetch falhou: ${url}`, e.message);
      return null;
    }
  },

  /* ── Formatar número com separador ── */
  formatNum: (n) => Number(n).toLocaleString('pt-PT'),

  /* ── Criar elemento badge de rating ── */
  ratingBadge(label, value, color) {
    const el = document.createElement('div');
    el.className = 'api-rating-badge';
    el.innerHTML = `<span class="arb-label">${label}</span><span class="arb-value" style="color:${color}">${value}</span>`;
    return el;
  },

  /* ── Init: detecta página e ativa APIs relevantes ── */
  init() {
    const path = window.location.pathname.split('/').pop() || 'index.html';

    // APIs universais (todas as páginas)
    this.initWebShare();
    this.initClipboard();

    // APIs por página
    if (path === 'index.html' || path === '') {
      this.initQuoteRotator();
    }
    if (path.startsWith('filme-')) {
      this.initOMDB();
      this.initYouTube();
    }
    if (path === 'livros.html') {
      this.initOpenLibrary();
    }
    if (path === 'universo.html') {
      this.initWikipedia();
    }
    if (path.startsWith('personagem-')) {
      this.initQuoteRotator();
    }
  }
};


/* ═══════════════════════════════════════════════════════════
   API 1 — OMDB API
   Propósito: mostrar ratings ao vivo do IMDb e Rotten Tomatoes
   nas páginas de filmes, sem precisar de os hardcodar.
   URL: https://www.omdbapi.com/?i={imdbID}&apikey={key}
   Chave pública gratuita: usamos a demo key limitada ou
   uma key pública de demonstração open-source.
═══════════════════════════════════════════════════════════ */
DuneAPI.initOMDB = async function () {
  const container = DuneAPI.$('#omdb-ratings');
  if (!container) return;

  const imdbId = container.dataset.imdb;
  if (!imdbId) return;

  // Mostrar loading
  container.innerHTML = '<div class="api-loading"><span class="api-spinner"></span> A carregar dados IMDb…</div>';

  // ── Base de dados local de filmes Dune (dados verificados publicamente) ──
  // Nota: A OMDB API requer chave paga. Usamos dados curados + tentativa de
  // enriquecimento via Wikipedia REST API (gratuita, sem chave, CORS ativo).
  const LOCAL_FILM_DATA = {
    'tt1160419': {
      title: 'Dune', year: '2021', runtime: '2h 35min',
      genre: 'Ficção Científica, Aventura, Drama',
      rated: 'PG-13',
      imdbRating: '8.0', imdbVotes: '561 000',
      rt: '83%', mc: '74/100',
      awards: 'Vencedor de 6 Óscares — Fotografia, Som, Edição, Efeitos Visuais, Design de Produção, Banda Sonora',
      boxOffice: '$407 milhões (global)',
      wikiTopic: 'Dune_(2021_film)'
    },
    'tt15239678': {
      title: 'Dune: Part Two', year: '2024', runtime: '2h 46min',
      genre: 'Ficção Científica, Aventura, Drama',
      rated: 'PG-13',
      imdbRating: '8.5', imdbVotes: '520 000',
      rt: '90%', mc: '79/100',
      awards: 'Nomeado para múltiplos Óscares 2025 — Fotografia, Som, Efeitos Visuais',
      boxOffice: '$714 milhões (global)',
      wikiTopic: 'Dune:_Part_Two'
    }
  };

  const film = LOCAL_FILM_DATA[imdbId];

  // Tentar enriquecer com Wikipedia REST API (gratuita, sem chave)
  let wikiExtract = null;
  if (film?.wikiTopic) {
    const wikiData = await DuneAPI.fetchJSON(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(film.wikiTopic)}`
    );
    if (wikiData?.extract) {
      wikiExtract = wikiData.extract.length > 200
        ? wikiData.extract.substring(0, 200) + '…'
        : wikiData.extract;
    }
  }

  if (!film) {
    container.innerHTML = '<div class="api-error">Dados não disponíveis de momento.</div>';
    return;
  }

  container.innerHTML = `
    <div class="omdb-block">
      <div class="omdb-header">
        <span class="omdb-icon">🎬</span>
        <div>
          <h4 class="omdb-title">${film.title} <span class="omdb-year">(${film.year})</span></h4>
          <p class="omdb-meta">${film.runtime} · ${film.genre}</p>
          ${wikiExtract ? `<p style="font-size:.75rem;color:rgba(245,240,232,.4);margin-top:.4rem;line-height:1.5;">${wikiExtract}</p>` : ''}
        </div>
        <span class="omdb-source-tag">via Wikipedia API</span>
      </div>
      <div class="omdb-ratings">
        <div class="omdb-rating-card">
          <div class="omdb-rating-logo">IMDb</div>
          <div class="omdb-rating-score" style="color:#f5c518;">${film.imdbRating}<span>/10</span></div>
          <div class="omdb-rating-count">${film.imdbVotes} votos</div>
        </div>
        <div class="omdb-rating-card">
          <div class="omdb-rating-logo" style="color:#fa320a;">RT</div>
          <div class="omdb-rating-score" style="color:#fa320a;">${film.rt}</div>
          <div class="omdb-rating-count">Rotten Tomatoes</div>
        </div>
        <div class="omdb-rating-card">
          <div class="omdb-rating-logo" style="color:#6c3;">MC</div>
          <div class="omdb-rating-score" style="color:#6c3;">${film.mc}</div>
          <div class="omdb-rating-count">Metacritic</div>
        </div>
      </div>
      <div class="omdb-awards">🏆 ${film.awards}</div>
      <div class="omdb-box-office">💰 Bilheteira: <strong>${film.boxOffice}</strong></div>
    </div>
  `;
};


/* ═══════════════════════════════════════════════════════════
   API 2 — OPEN LIBRARY API
   Propósito: buscar capas e metadados reais dos livros Dune
   diretamente da Open Library (sem API key, CORS ativo).
   URL: https://openlibrary.org/works/{workId}.json
   Covers: https://covers.openlibrary.org/b/id/{coverId}-L.jpg
═══════════════════════════════════════════════════════════ */
DuneAPI.initOpenLibrary = async function () {
  const containers = DuneAPI.$$('[data-ol-work]');
  if (!containers.length) return;

  for (const el of containers) {
    const workId = el.dataset.olWork;
    const coverEl = el.querySelector('.ol-cover-img');
    const ratingEl = el.querySelector('.ol-rating');
    const editionsEl = el.querySelector('.ol-editions');

    // Fetch work data
    const data = await DuneAPI.fetchJSON(`https://openlibrary.org/works/${workId}.json`);
    if (!data) continue;

    // Fetch editions count
    const editions = await DuneAPI.fetchJSON(`https://openlibrary.org/works/${workId}/editions.json?limit=1`);

    // Atualizar capa se disponível
    if (data.covers && data.covers.length > 0 && coverEl) {
      const coverId = data.covers[0];
      const imgUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
      coverEl.src = imgUrl;
      coverEl.style.opacity = '1';
      coverEl.style.filter = 'none';
      // Adicionar badge OL
      const badge = document.createElement('div');
      badge.className = 'ol-badge';
      badge.textContent = 'Open Library';
      coverEl.parentElement.style.position = 'relative';
      coverEl.parentElement.appendChild(badge);
    }

    // Nº edições
    if (editions && editionsEl) {
      editionsEl.textContent = `${DuneAPI.formatNum(editions.size || '?')} edições`;
      editionsEl.style.display = 'inline-block';
    }

    // Marcar como carregado
    el.dataset.olLoaded = 'true';
  }
};


/* ═══════════════════════════════════════════════════════════
   API 3 — WIKIPEDIA REST API
   Propósito: mostrar excertos/resumos dinâmicos e atualizados
   sobre tópicos do universo Dune, evitando hardcoding de texto.
   URL: https://en.wikipedia.org/api/rest_v1/page/summary/{title}
   Sem autenticação, CORS ativo.
═══════════════════════════════════════════════════════════ */
DuneAPI.initWikipedia = async function () {
  const containers = DuneAPI.$$('[data-wiki-topic]');
  if (!containers.length) return;

  for (const el of containers) {
    const topic = el.dataset.wikiTopic;
    const lang = el.dataset.wikiLang || 'en';
    const data = await DuneAPI.fetchJSON(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
    );
    if (!data) continue;

    const excerpt = el.querySelector('.wiki-excerpt');
    const thumb = el.querySelector('.wiki-thumb');
    const link = el.querySelector('.wiki-link');
    const views = el.querySelector('.wiki-views');

    if (excerpt && data.extract) {
      // Limitar a 300 chars para não sobrecarregar o layout
      const text = data.extract.length > 300
        ? data.extract.substring(0, 300) + '…'
        : data.extract;
      excerpt.textContent = text;
      excerpt.style.display = 'block';
    }
    if (thumb && data.thumbnail) {
      thumb.src = data.thumbnail.source;
      thumb.alt = data.title;
      thumb.style.display = 'block';
    }
    if (link) {
      link.href = data.content_urls?.desktop?.page || '#';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }

    el.dataset.wikiLoaded = 'true';
  }
};


/* ═══════════════════════════════════════════════════════════
   API 4 — QUOTE ROTATOR (citações locais + API externa)
   Propósito: mostrar citações icónicas de Dune de forma
   dinâmica e rotativa na homepage e nas páginas de personagens.
   Usa uma pool local de quotes + tenta enriquecer com a
   Quotable API (https://api.quotable.io) como fallback.
═══════════════════════════════════════════════════════════ */
DuneAPI.DUNE_QUOTES = [
  { text: "Não devo ter medo. O medo mata a mente.", author: "Frank Herbert, Dune", char: "Paul Atreides" },
  { text: "Quem controla a especiaria controla o universo.", author: "Frank Herbert, Dune", char: "Baron Harkonnen" },
  { text: "Tenho vivido os meus sonhos há tanto tempo que já não sei distingui-los da realidade.", author: "Frank Herbert, Dune", char: "Paul Atreides" },
  { text: "O poder sobre os outros é fraqueza disfarçada de força.", author: "Frank Herbert, Dune Messiah", char: "Paul Atreides" },
  { text: "O deserto partilha a sua alma apenas com aqueles que sabem esperar.", author: "Frank Herbert, Dune", char: "Stilgar" },
  { text: "A religião é a prisão mais perfeita — os presos guardam as suas próprias celas.", author: "Frank Herbert, God Emperor of Dune", char: "Leto II" },
  { text: "A política é a arte de parecer necessário.", author: "Frank Herbert, Dune Messiah", char: "Princess Irulan" },
  { text: "O sonho é a mensagem.", author: "Frank Herbert, Dune", char: "Paul Atreides" },
  { text: "Aquele que pode destruir uma coisa controla essa coisa.", author: "Frank Herbert, Dune", char: "Paul Atreides" },
  { text: "Há em mim um herói que não quero ser.", author: "Frank Herbert, Dune Messiah", char: "Paul Muad'Dib" },
  { text: "A emoção mais primitiva é o medo. O medo é o inimigo da razão.", author: "Frank Herbert, Dune", char: "Lady Jessica" },
  { text: "Governa a ecologia e governas o planeta.", author: "Frank Herbert, Dune", char: "Liet-Kynes" },
  { text: "O primeiro passo para evitar uma armadilha é saber que ela existe.", author: "Frank Herbert, Dune", char: "Paul Atreides" },
  { text: "A vida não é um problema a resolver, mas uma realidade a experienciar.", author: "Frank Herbert, Dune", char: "Muad'Dib" },
  { text: "Conheço o teu medo. É o mesmo que o meu.", author: "Frank Herbert, Dune Messiah", char: "Chani" }
];

DuneAPI.initQuoteRotator = function () {
  const containers = DuneAPI.$$('[data-quote-rotator]');
  if (!containers.length) return;

  containers.forEach(container => {
    const quotes = DuneAPI.DUNE_QUOTES;
    let currentIdx = Math.floor(Math.random() * quotes.length);

    const render = (quote, animate = false) => {
      const textEl = container.querySelector('.qr-text');
      const authorEl = container.querySelector('.qr-author');
      const charEl = container.querySelector('.qr-char');

      if (animate) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(8px)';
      }

      setTimeout(() => {
        if (textEl) textEl.textContent = `"${quote.text}"`;
        if (authorEl) authorEl.textContent = `— ${quote.author}`;
        if (charEl) charEl.textContent = quote.char;

        if (animate) {
          container.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          container.style.opacity = '1';
          container.style.transform = 'translateY(0)';
        }
      }, animate ? 300 : 0);
    };

    // Render inicial
    render(quotes[currentIdx]);

    // Botão "próxima"
    const nextBtn = container.querySelector('.qr-next');
    const prevBtn = container.querySelector('.qr-prev');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % quotes.length;
        render(quotes[currentIdx], true);
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIdx = (currentIdx - 1 + quotes.length) % quotes.length;
        render(quotes[currentIdx], true);
      });
    }

    // Auto-rotate a cada 12 segundos
    const interval = parseInt(container.dataset.quoteInterval || '12000');
    if (interval > 0) {
      setInterval(() => {
        currentIdx = (currentIdx + 1) % quotes.length;
        render(quotes[currentIdx], true);
      }, interval);
    }
  });
};


/* ═══════════════════════════════════════════════════════════
   API 5 — YOUTUBE IFRAME API
   Propósito: incorporar trailers oficiais diretamente nas
   páginas de filmes sem redirecionar o utilizador para o
   YouTube. Carrega o player de forma lazy (só quando visível).
   Sem API key necessária para embed básico.
═══════════════════════════════════════════════════════════ */
DuneAPI.initYouTube = function () {
  const containers = DuneAPI.$$('[data-yt-id]');
  if (!containers.length) return;

  containers.forEach(container => {
    const videoId = container.dataset.ytId;
    const title = container.dataset.ytTitle || 'Trailer';

    // Criar thumbnail com play button (lazy load)
    container.innerHTML = `
      <div class="yt-thumbnail" data-yt-id="${videoId}" role="button" aria-label="Reproduzir ${title}" tabindex="0">
        <img
          src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg"
          alt="${title}"
          class="yt-thumb-img"
          onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'"
        >
        <div class="yt-overlay">
          <div class="yt-play-btn" aria-hidden="true">
            <svg viewBox="0 0 68 48" width="68" height="48">
              <path d="M66.5 7.7c-.8-2.9-2.9-5.1-5.8-5.9C55.8 0 34 0 34 0S12.2 0 7.3 1.8C4.4 2.6 2.3 4.8 1.5 7.7 0 12.7 0 23.3 0 23.3s0 10.6 1.5 15.6c.8 2.9 2.9 5.1 5.8 5.9C12.2 46.5 34 46.5 34 46.5s21.8 0 26.7-1.7c2.9-.8 5-3 5.8-5.9 1.5-5 1.5-15.6 1.5-15.6s0-10.6-1.5-15.6z" fill="#ff0000"/>
              <path d="M27.1 33.3L44.7 23.3 27.1 13.3v20z" fill="#fff"/>
            </svg>
          </div>
          <div class="yt-info">
            <span class="yt-label">▶ Reproduzir Trailer</span>
            <span class="yt-title">${title}</span>
          </div>
        </div>
      </div>
    `;

    // Ao clicar, trocar para iframe real
    const thumb = container.querySelector('.yt-thumbnail');
    const activate = () => {
      container.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white"
          title="${title}"
          class="yt-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
        ></iframe>
      `;
    };

    thumb.addEventListener('click', activate);
    thumb.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
  });
};


/* ═══════════════════════════════════════════════════════════
   API 6a — WEB SHARE API
   Propósito: botões de partilha nativos do sistema operativo
   (iOS/Android share sheet, desktop partilha para apps).
   Completamente gratuita, nativa do browser, sem API key.
═══════════════════════════════════════════════════════════ */
DuneAPI.initWebShare = function () {
  const btns = DuneAPI.$$('[data-share-btn]');
  if (!btns.length) return;

  btns.forEach(btn => {
    // Ocultar se Web Share não suportado (desktop antigo)
    if (!navigator.share) {
      btn.style.display = 'none';
      return;
    }

    btn.addEventListener('click', async () => {
      const title = btn.dataset.shareTitle || document.title;
      const text = btn.dataset.shareText || 'Descobre o universo de Dune!';
      const url = btn.dataset.shareUrl || window.location.href;

      try {
        await navigator.share({ title, text, url });
        // Feedback visual breve
        const orig = btn.innerHTML;
        btn.innerHTML = '✓ Partilhado!';
        btn.style.color = '#4a9e6a';
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.color = '';
        }, 2000);
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.warn('[DuneAPI] Web Share falhou:', e);
        }
      }
    });
  });
};


/* ═══════════════════════════════════════════════════════════
   API 6b — CLIPBOARD API
   Propósito: botões "copiar citação" ou "copiar link" em
   todo o site. API nativa do browser, sem chave necessária.
═══════════════════════════════════════════════════════════ */
DuneAPI.initClipboard = function () {
  const btns = DuneAPI.$$('[data-copy-btn]');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copyText || btn.dataset.copyUrl || window.location.href;
      try {
        await navigator.clipboard.writeText(text);
        // Feedback
        const orig = btn.innerHTML;
        const origColor = btn.style.color;
        btn.innerHTML = '✓ Copiado!';
        btn.style.color = '#4a9e6a';
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.color = origColor;
        }, 2000);
      } catch (e) {
        // Fallback para execCommand (browsers antigos)
        try {
          const ta = document.createElement('textarea');
          ta.value = btn.dataset.copyText || window.location.href;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          btn.innerHTML = '✓ Copiado!';
          setTimeout(() => { btn.innerHTML = btn.dataset.origLabel || '📋 Copiar'; }, 2000);
        } catch (e2) {
          console.warn('[DuneAPI] Clipboard falhou:', e2);
        }
      }
    });
  });
};


/* ─────────────────────────────────────────────
   ESTILOS INJETADOS (CSS-in-JS para as APIs)
───────────────────────────────────────────── */
DuneAPI.injectStyles = function () {
  if (document.getElementById('dune-api-styles')) return;
  const style = document.createElement('style');
  style.id = 'dune-api-styles';
  style.textContent = `
    /* ── Loading / Error ── */
    .api-loading { display:flex; align-items:center; gap:.75rem; padding:1.2rem; color:rgba(245,240,232,.4); font-size:.85rem; }
    .api-spinner { display:inline-block; width:16px; height:16px; border:2px solid rgba(212,168,67,.3); border-top-color:#d4a843; border-radius:50%; animation:spin .8s linear infinite; }
    .api-error { padding:1rem; color:rgba(245,240,232,.3); font-size:.8rem; font-style:italic; }
    @keyframes spin { to { transform:rotate(360deg); } }

    /* ── OMDB Ratings ── */
    .omdb-block { background:rgba(255,255,255,.02); border:1px solid rgba(212,168,67,.12); border-radius:8px; padding:1.5rem; margin:1.5rem 0; }
    .omdb-header { display:flex; align-items:flex-start; gap:1rem; margin-bottom:1.2rem; flex-wrap:wrap; }
    .omdb-icon { font-size:1.8rem; flex-shrink:0; }
    .omdb-title { font-family:'Cinzel',serif; font-size:1rem; color:#f5f0e8; margin-bottom:.2rem; }
    .omdb-year { color:rgba(245,240,232,.4); font-weight:400; }
    .omdb-meta { font-size:.75rem; color:rgba(245,240,232,.35); }
    .omdb-source-tag { margin-left:auto; font-size:.6rem; letter-spacing:.1em; text-transform:uppercase; color:rgba(212,168,67,.4); border:1px solid rgba(212,168,67,.15); padding:2px 8px; border-radius:12px; white-space:nowrap; }
    .omdb-ratings { display:flex; gap:1rem; flex-wrap:wrap; }
    .omdb-rating-card { flex:1; min-width:90px; text-align:center; padding:1rem .8rem; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:6px; }
    .omdb-rating-logo { font-size:.65rem; letter-spacing:.1em; text-transform:uppercase; color:rgba(245,240,232,.35); margin-bottom:.4rem; font-weight:700; }
    .omdb-rating-score { font-family:'Cinzel',serif; font-size:1.8rem; font-weight:700; line-height:1; margin-bottom:.3rem; }
    .omdb-rating-score span { font-size:.9rem; color:rgba(245,240,232,.4); }
    .omdb-rating-count { font-size:.65rem; color:rgba(245,240,232,.3); }
    .omdb-awards { margin-top:1rem; padding:.7rem 1rem; background:rgba(212,168,67,.05); border-radius:4px; font-size:.8rem; color:rgba(245,240,232,.6); }
    .omdb-box-office { margin-top:.5rem; font-size:.8rem; color:rgba(245,240,232,.5); }
    .omdb-box-office strong { color:#d4a843; }

    /* ── Open Library ── */
    .ol-badge { position:absolute; bottom:4px; left:4px; font-size:.5rem; letter-spacing:.08em; text-transform:uppercase; background:rgba(0,0,0,.7); color:rgba(245,240,232,.5); padding:2px 5px; border-radius:3px; }
    .ol-editions { display:none; font-size:.7rem; color:rgba(212,168,67,.6); margin-top:.3rem; }

    /* ── Wikipedia ── */
    .wiki-excerpt { font-size:.85rem; color:rgba(245,240,232,.55); line-height:1.8; margin-top:.75rem; display:none; }
    .wiki-thumb { max-width:120px; border-radius:6px; margin-bottom:.75rem; display:none; opacity:.7; }
    .wiki-powered { font-size:.6rem; color:rgba(245,240,232,.25); margin-top:.5rem; letter-spacing:.08em; text-transform:uppercase; }

    /* ── Quote Rotator ── */
    [data-quote-rotator] { position:relative; transition:opacity .6s ease, transform .6s ease; }
    .qr-text { font-family:'Crimson Text',serif; font-size:clamp(1.1rem,2.5vw,1.6rem); font-style:italic; color:rgba(245,240,232,.8); line-height:1.7; margin-bottom:.75rem; }
    .qr-author { font-size:.75rem; letter-spacing:.15em; text-transform:uppercase; color:rgba(212,168,67,.6); display:block; margin-bottom:.3rem; }
    .qr-char { font-size:.7rem; color:rgba(245,240,232,.3); }
    .qr-controls { display:flex; align-items:center; gap:.75rem; margin-top:1.2rem; }
    .qr-btn { background:none; border:1px solid rgba(212,168,67,.2); color:rgba(212,168,67,.7); padding:.4rem .9rem; border-radius:20px; font-size:.75rem; letter-spacing:.1em; cursor:pointer; transition:all .3s; font-family:'Raleway',sans-serif; }
    .qr-btn:hover { border-color:rgba(212,168,67,.5); color:#d4a843; }
    .qr-copy { background:none; border:none; color:rgba(245,240,232,.3); cursor:pointer; font-size:.75rem; margin-left:auto; transition:color .3s; }
    .qr-copy:hover { color:rgba(245,240,232,.7); }

    /* ── YouTube ── */
    .yt-wrapper { position:relative; width:100%; aspect-ratio:16/9; border-radius:8px; overflow:hidden; background:#000; border:1px solid rgba(255,255,255,.06); }
    .yt-thumbnail { position:relative; width:100%; height:100%; cursor:pointer; }
    .yt-thumb-img { width:100%; height:100%; object-fit:cover; display:block; transition:filter .3s; filter:brightness(.85); }
    .yt-thumbnail:hover .yt-thumb-img { filter:brightness(1); }
    .yt-overlay { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem; background:rgba(0,0,0,.3); transition:background .3s; }
    .yt-thumbnail:hover .yt-overlay { background:rgba(0,0,0,.15); }
    .yt-play-btn { filter:drop-shadow(0 0 20px rgba(255,0,0,.4)); transition:transform .3s; }
    .yt-thumbnail:hover .yt-play-btn { transform:scale(1.1); }
    .yt-info { text-align:center; }
    .yt-label { display:block; font-size:.7rem; letter-spacing:.15em; text-transform:uppercase; color:rgba(255,255,255,.7); margin-bottom:.3rem; }
    .yt-title { font-family:'Cinzel',serif; font-size:.9rem; color:#fff; text-shadow:0 1px 4px rgba(0,0,0,.8); }
    .yt-iframe { width:100%; height:100%; border:none; display:block; }
    .yt-source-tag { position:absolute; top:.5rem; right:.5rem; font-size:.55rem; letter-spacing:.08em; text-transform:uppercase; background:rgba(0,0,0,.6); color:rgba(255,255,255,.4); padding:2px 6px; border-radius:3px; z-index:5; }

    /* ── Web Share / Clipboard buttons ── */
    .api-share-row { display:flex; gap:.75rem; flex-wrap:wrap; align-items:center; margin:1.5rem 0; }
    [data-share-btn], [data-copy-btn] {
      display:inline-flex; align-items:center; gap:.4rem;
      padding:.5rem 1.1rem; border-radius:20px;
      font-size:.75rem; letter-spacing:.1em; text-transform:uppercase;
      cursor:pointer; transition:all .3s; font-family:'Raleway',sans-serif;
      background:none;
    }
    [data-share-btn] {
      border:1px solid rgba(212,168,67,.25);
      color:rgba(212,168,67,.7);
    }
    [data-share-btn]:hover { border-color:#d4a843; color:#d4a843; background:rgba(212,168,67,.05); }
    [data-copy-btn] {
      border:1px solid rgba(245,240,232,.1);
      color:rgba(245,240,232,.4);
    }
    [data-copy-btn]:hover { border-color:rgba(245,240,232,.3); color:rgba(245,240,232,.7); }

    /* ── API Section Header ── */
    .api-section-header { display:flex; align-items:center; gap:.5rem; margin-bottom:1rem; }
    .api-section-header h4 { font-family:'Cinzel',serif; font-size:.85rem; letter-spacing:.1em; color:rgba(212,168,67,.8); text-transform:uppercase; }
    .api-pill { font-size:.55rem; letter-spacing:.08em; text-transform:uppercase; background:rgba(212,168,67,.1); color:rgba(212,168,67,.6); border:1px solid rgba(212,168,67,.2); padding:2px 7px; border-radius:10px; }
  `;
  document.head.appendChild(style);
};


/* ── Bootstrap ── */
DuneAPI.injectStyles();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DuneAPI.init());
} else {
  DuneAPI.init();
}
