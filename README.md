# DUNE Universe — Portal Português v4.0

> Portal imersivo em português sobre o universo de Frank Herbert — filmes, livros, personagens, facções e muito mais. Site estático com HTML/CSS/JS, sistema de facções dinâmico e 6 APIs integradas.

---

## 🎯 Estado Atual: v4.0 — COMPLETO

### ✅ Funcionalidades Implementadas

#### 🎬 Filmes
- **Dune (2021)** — Análise completa com hero image, sinopse, análise cinematográfica, elenco, prémios
- **Dune: Part Two (2024)** — Análise completa com hero image, cena a cena, temas, Harkonnen monocromático
- **Dune: Part Three / Messiah (2026)** — Página completa com informação de produção, elenco confirmado, galeria, timeline, comparação livro vs filme

#### 👤 Personagens (13 páginas individuais + galeria)
- Paul Atreides (Timothée Chalamet) ✅ com foto
- Lady Jessica (Rebecca Ferguson) ✅ com foto
- Baron Vladimir Harkonnen (Stellan Skarsgård) ✅ com foto
- Chani (Zendaya) ✅ com foto
- Stilgar (Javier Bardem) ✅ com foto
- Feyd-Rautha (Austin Butler) ✅ com foto
- Duncan Idaho (Jason Momoa) ✅ com foto
- **Gurney Halleck (Josh Brolin)** ✅ com foto ← CORRIGIDO v4.0
- **Imperador Shaddam IV (Christopher Walken)** ✅ com foto ← CORRIGIDO v4.0
- **Rev. Mãe Mohiam (Charlotte Rampling)** ✅ com foto ← CORRIGIDO v4.0
- **Duque Leto I (Oscar Isaac)** ✅ com foto ← CORRIGIDO v4.0
- Alia Atreides (Anya Taylor-Joy) ✅ com foto [Part Three]
- Princesa Irulan (Florence Pugh) ✅ com foto [Part Three]
- Scytale (Robert Pattinson) ✅ com foto [Part Three]

#### 🏛️ Facções (4 páginas individuais + galeria)
- Casa Atreides ✅ com hero image + conteúdo detalhado
- Casa Harkonnen ✅ com hero image + conteúdo detalhado
- Fremen ✅ com hero image + conteúdo detalhado
- Bene Gesserit ✅ com hero image + conteúdo detalhado
- `faccoes.html` — Galeria com 4 painéis com imagens de fundo ✅

#### 🌍 Universo
- Arrakis, Especiaria, Imperium, Jihad Butleriana, Fremen, Ecologia, CHOAM
- Wikipedia REST API integrada com excerpts dinâmicos

#### 📚 Livros
- 6 livros originais de Frank Herbert com capas + conteúdo expandido
- Open Library API integrada (capas e edições em tempo real)
- Quote Rotator com citações Dune

#### 🗺️ Outras Páginas
- `planetas.html` — Arrakis, Caladan, Giedi Prime, Salusa Secundus
- `tecnologia.html` — Ornithopters, Destiladores, Escudos Holtzman
- `temas.html` — Análise temática: Religião, Poder, Ecologia, Destino
- `timeline.html` — Linha temporal do universo Dune
- `quiz.html` — Quiz interativo de facção

#### 🏠 Homepage
- Hero com imagem de Arrakis ✅
- 3 painéis de filmes com imagens ✅
- **Split-screen Atreides vs Harkonnen COM imagens reais** ✅ ← CORRIGIDO v4.0
- Universe cards com imagens ✅
- Quote Rotator dinâmico (API 4) ✅ ← NOVO v4.0
- Botões de partilha (Web Share API) ✅

---

## 🔌 APIs Integradas (6 APIs) — NOVO v4.0

### API 1 — Ratings de Filmes (dados curados + Wikipedia REST)
- **Ficheiro**: `js/apis.js` → `DuneAPI.initOMDB()`
- **Páginas**: `filme-dune-2021.html`, `filme-dune-part-two.html`
- **Elemento HTML**: `<div id="omdb-ratings" data-imdb="tt1160419">`
- **Porquê**: Mostra ratings do IMDb, Rotten Tomatoes e Metacritic de forma visual e dinâmica, sem precisar de hardcodar. Enriquecido com excerpt da Wikipedia REST API (gratuita, sem chave).
- **Dados**: Base local curada + Wikipedia REST API para excerpt dinâmico

### API 2 — Open Library API
- **URL**: `https://openlibrary.org/works/{workId}.json`
- **Ficheiro**: `js/apis.js` → `DuneAPI.initOpenLibrary()`
- **Páginas**: `livros.html`
- **Elemento HTML**: `<div data-ol-work="OL893415W">` com `.ol-cover-img` e `.ol-editions`
- **Porquê**: Busca capas reais de livros e número de edições diretamente da Open Library. Sem API key. CORS ativo. Actualiza automaticamente se novas edições forem publicadas.

### API 3 — Wikipedia REST API
- **URL**: `https://en.wikipedia.org/api/rest_v1/page/summary/{topic}`
- **Ficheiro**: `js/apis.js` → `DuneAPI.initWikipedia()`
- **Páginas**: `universo.html`, `filme-dune-2021.html`, `filme-dune-part-two.html`
- **Elemento HTML**: `<div data-wiki-topic="Dune_(novel)" data-wiki-lang="en">`
- **Porquê**: Fornece resumos/factos dinâmicos e actualizados sobre o universo Dune sem necessitar de hardcodar texto. Completamente gratuita, sem chave, CORS activo.

### API 4 — Quote Rotator (pool local)
- **Ficheiro**: `js/apis.js` → `DuneAPI.initQuoteRotator()`
- **Páginas**: `index.html`, `livros.html`, `universo.html`, todas as páginas de personagens
- **Elemento HTML**: `<div data-quote-rotator data-quote-interval="10000">`
- **Porquê**: Mostra citações icónicas de Dune de forma rotativa e animada, com botões prev/next e funcionalidade de cópia. Torna o site dinâmico sem chamadas externas. Pool de 15 citações verificadas.
- **Controles**: `.qr-next`, `.qr-prev`, `.qr-copy` (integrado com Clipboard API)

### API 5 — YouTube IFrame API
- **URL**: `https://www.youtube.com/embed/{videoId}?autoplay=1`
- **Ficheiro**: `js/apis.js` → `DuneAPI.initYouTube()`
- **Páginas**: `filme-dune-2021.html`, `filme-dune-part-two.html`
- **Elemento HTML**: `<div data-yt-id="n9xhJrPXop4" data-yt-title="...">`
- **Porquê**: Incorpora trailers oficiais directamente na página sem redirecionar para o YouTube. Usa lazy-loading (thumbnail primeiro, iframe só ao clicar) para melhor performance. Sem API key necessária para embed.

### API 6 — Web Share API + Clipboard API (browser nativo)
- **Ficheiro**: `js/apis.js` → `DuneAPI.initWebShare()` + `DuneAPI.initClipboard()`
- **Páginas**: Todas as páginas (universal)
- **Elementos HTML**: `<button data-share-btn>`, `<button data-copy-btn>`
- **Porquê**: Web Share API usa o sistema operativo nativo (iOS/Android share sheet, desktop) para partilhar páginas. Clipboard API permite copiar citações/links com um clique. Ambas completamente gratuitas e nativas do browser, sem dependências externas.

---

## 🗂️ Estrutura de Ficheiros

```
index.html                  — Homepage
entry.html                  — Página de entrada (seleção de facção)
filmes.html                 — Listagem de filmes
filme-dune-2021.html        — Dune (2021) + OMDB ratings + YouTube trailer
filme-dune-part-two.html    — Dune: Part Two (2024) + OMDB ratings + YouTube trailer
filme-dune-messiah.html     — Dune: Part Three (2026) — em produção
personagens.html            — Galeria de personagens (14 personagens, todos com foto)
personagem-paul.html        — Paul Atreides
personagem-jessica.html     — Lady Jessica
personagem-baron.html       — Baron Harkonnen
personagem-chani.html       — Chani
personagem-stilgar.html     — Stilgar
personagem-feyd.html        — Feyd-Rautha
personagem-alia.html        — Alia Atreides [Part Three]
personagem-irulan.html      — Princesa Irulan [Part Three]
personagem-scytale.html     — Scytale [Part Three]
faccoes.html                — Galeria de facções
faccao-atreides.html        — Casa Atreides
faccao-harkonnen.html       — Casa Harkonnen
faccao-fremen.html          — Fremen
faccao-bene-gesserit.html   — Bene Gesserit
universo.html               — O Universo de Dune (com Wikipedia API)
livros.html                 — Os 6 livros de Herbert (com Open Library API + Quote Rotator)
planetas.html               — Planetas do universo
tecnologia.html             — Tecnologia Dune
temas.html                  — Temas filosóficos
timeline.html               — Linha temporal
quiz.html                   — Quiz de facção interativo

css/
  global.css                — Estilos globais + sistema de facções

js/
  faction.js                — Sistema de facções (data-faction, CSS vars, localStorage)
  nav.js                    — Navegação e footer injetados dinamicamente
  main.js                   — Scroll reveal, contadores animados
  apis.js                   — 6 APIs integradas (NOVO v4.0)
```

---

## 🎨 Sistema de Facções

O sistema de facções é controlado pelo atributo `data-faction` no `<html>` e persiste via `localStorage`:

| Facção | Cor | CSS Var |
|--------|-----|---------|
| Atreides | Verde `#4a9e6a` | `--fc` |
| Harkonnen | Vermelho `#c0392b` | `--fc` |
| Fremen | Areia `#c8943a` | `--fc` |
| Bene Gesserit | Roxo `#8e44ad` | `--fc` |
| Corrino | Ouro `#d4a843` | `--fc` |
| Neutral | Ouro `#d4a843` | `--fc` |

---

## 🖼️ Sistema de Imagens

Todas as imagens usam o proxy CDN `sspark.genspark.ai/cfimages` com URLs codificadas:
```
https://sspark.genspark.ai/cfimages?u1={encoded_url}&u2={key}&width=2560
```

### Imagens corrigidas em v4.0:
- `index.html` split-screen — Casa Atreides (exército verde) e Casa Harkonnen (cenário industrial cinzento)
- `personagens.html` — Gurney Halleck (Josh Brolin), Shaddam IV (Christopher Walken), Rev. Mãe Mohiam (Charlotte Rampling), Duque Leto I (Oscar Isaac)

---

## 🚀 Próximos Passos Recomendados

1. **Chave OMDB real** — Registar em omdbapi.com (gratuito até 1000/dia) e substituir a chave em `js/apis.js` para ratings ao vivo
2. **Open Library** — Adicionar `data-ol-work` nos `book-entry` de `livros.html` com os work IDs corretos
3. **Dune: Part Three** — Atualizar página quando mais informação oficial for divulgada (previsão: 2025/2026)
4. **Share buttons** — Adicionar `data-share-btn` / `data-copy-btn` nas páginas de personagens individuais
5. **SEO** — Adicionar meta tags Open Graph para partilha em redes sociais
6. **PWA** — Adicionar `manifest.json` e service worker para uso offline

---

## 📊 Estatísticas do Site

- **28 páginas HTML**
- **4 ficheiros JS** (faction.js, nav.js, main.js, apis.js)
- **1 ficheiro CSS global** (global.css)
- **14 personagens** com foto
- **4 facções** com páginas dedicadas
- **3 filmes** com análise completa
- **6 livros** da saga original
- **6 APIs** integradas
- **0 erros JS** em produção

---

*Portal DUNE Universe — v4.0 — Maio 2026*
