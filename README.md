# DUNE Universe — Portal Enciclopédico

> Portal não oficial sobre o universo de Frank Herbert. Fins educacionais.
> 
> **v3.0** — Dune: Part Three (Messiah) 2026 completamente integrado: página de análise completa, 3 novas páginas de personagens (Alia, Irulan, Scytale), painéis actualizados em filmes.html e index.html, nav.js com links para todos os filmes.

---

## 🏛️ Sobre o Projeto

Website completo e imersivo sobre o universo Dune, construído como uma experiência cinematográfica premium. Sistema de facções adaptativo que personaliza cores, destaques e navegação com base na escolha do utilizador.

---

## ✅ Funcionalidades Implementadas

### 🎬 Experiência de Entrada
- **entry.html** — Ecrã de entrada cinematográfico com animação de estrelas, dunas, partículas de areia e seleção de facção
- Redireccionamento automático para a entrada na primeira visita
- Facção guardada em localStorage para persistência

### 🏠 Homepage Cinematográfica
- **index.html** — Homepage completa com:
  - Hero de ecrã completo com atmosfera de deserto
  - Secção de filmes com painéis interativos
  - Destaque de Paul Atreides
  - Split-screen interativo (Atreides vs Harkonnen)
  - Cards do universo
  - Temas de Dune
  - Barra de estatísticas com contadores animados
  - CTA final

### 🌌 Universo
- **universo.html** — Introdução completa ao universo: especiaria, Imperium, ecologia, estrutura política

### 👤 Personagens (9 páginas individuais)
- **personagem-paul.html** — Paul Atreides (protagonista / Muad'Dib / Imperador)
- **personagem-jessica.html** — Lady Jessica (Bene Gesserit)
- **personagem-baron.html** — Baron Vladimir Harkonnen
- **personagem-chani.html** — Chani (guerreira Fremen)
- **personagem-stilgar.html** — Stilgar (Naib de Sietch Tabr)
- **personagem-feyd.html** — Feyd-Rautha Harkonnen
- **personagem-alia.html** — Alia Atreides (Anya Taylor-Joy — Part Three 2026)
- **personagem-irulan.html** — Princesa Irulan (Florence Pugh — Part Three 2026)
- **personagem-scytale.html** — Scytale/Face Dancer Tleilaxu (Robert Pattinson — Part Three 2026)
- **personagens.html** — Galeria com filtros por facção (15+ personagens)

### 🏰 Facções (4 páginas individuais + listagem)
- **faccao-atreides.html** — Casa Atreides (tema verde)
- **faccao-harkonnen.html** — Casa Harkonnen (tema vermelho)
- **faccao-fremen.html** — Fremen (tema azul)
- **faccao-bene-gesserit.html** — Bene Gesserit (tema violeta)
- **faccoes.html** — Listagem de todas as facções

### 🎥 Filmes (3 páginas + listagem)
- **filme-dune-2021.html** — Dune (2021) — Denis Villeneuve
- **filme-dune-part-two.html** — Dune: Part Two (2024)
- **filme-dune-messiah.html** — Dune: Part Three / Messiah (2026) — análise completa com elenco, sinopse, temas, livro vs filme, galeria
- **filmes.html** — Listagem dos filmes (3 painéis com imagens)

### 📚 Livros
- **livros.html** — Os 6 romances originais de Frank Herbert + obras expandidas

### 🌍 Planetas
- **planetas.html** — Arrakis, Caladan, Giedi Prime, Kaitain, Salusa Secundus (selector interativo)

### ⚙️ Tecnologia
- **tecnologia.html** — Mentats, Bene Gesserit, Navigadores, Destilantes, Ornithópteros, Shields

### 📖 Temas
- **temas.html** — Religião & Profecia, Poder & Política, Ecologia, Destino & Livre-Arbítrio, Messianismo

### ⏱️ Timeline Interativa
- **timeline.html** — Linha do tempo de 10.000+ anos de história
  - 5 eras históricas (Butleriano Jihad → Pós-Dune)
  - Filtros por tipo de evento (Político, Guerra, Profecia, Ecologia, Religião, Ciência)
  - Eventos expansíveis com detalhes aprofundados

### ◎ Quiz de Facção
- **quiz.html** — Quiz de 10 perguntas para descobrir a facção do utilizador
  - Pontuação por facção (Atreides, Harkonnen, Fremen, Bene Gesserit)
  - Resultado visual com traços de personalidade e barras animadas
  - Distribuição das respostas
  - Aplica a facção ao sistema global automaticamente

---

## 🎨 Sistema de Facções Adaptativo

Todas as páginas adaptam visualmente à facção escolhida:

| Facção | Cor Principal | Símbolo |
|--------|--------------|---------|
| Casa Atreides | Verde (#4a9e6a) | ⚔ |
| Casa Harkonnen | Vermelho (#c0392b) | ⚡ |
| Fremen | Azul (#2980b9) | ◈ |
| Bene Gesserit | Violeta (#8e44ad) | ◉ |

A facção é aplicada via `data-faction` no elemento `<html>` e persiste em `localStorage`.

---

## 🗂️ Estrutura de Ficheiros

```
index.html              — Homepage cinematográfica
entry.html              — Ecrã de entrada + seleção de facção
universo.html           — Universo Dune
personagens.html        — Galeria de personagens
personagem-paul.html    — Paul Atreides
personagem-jessica.html — Lady Jessica
personagem-baron.html   — Baron Harkonnen
personagem-chani.html   — Chani
personagem-stilgar.html — Stilgar
personagem-feyd.html    — Feyd-Rautha
personagem-alia.html    — Alia Atreides (Dune: Part Three)
personagem-irulan.html  — Princesa Irulan (Dune: Part Three)
personagem-scytale.html — Scytale / Tleilaxu (Dune: Part Three)
faccoes.html            — Listagem de facções
faccao-atreides.html    — Casa Atreides
faccao-harkonnen.html   — Casa Harkonnen
faccao-fremen.html      — Fremen
faccao-bene-gesserit.html — Bene Gesserit
filmes.html             — Listagem de filmes
filme-dune-2021.html    — Dune (2021)
filme-dune-part-two.html — Dune: Part Two (2024)
filme-dune-messiah.html  — Dune: Part Three / Messiah (2026)
livros.html             — Livros
planetas.html           — Planetas (selector interativo)
tecnologia.html         — Tecnologia
temas.html              — Temas filosóficos
timeline.html           — Linha do tempo interativa
quiz.html               — Quiz de facção

css/
  global.css            — Estilos globais + sistema de facções CSS

js/
  faction.js            — Sistema de facções (localStorage + aplicação)
  main.js               — Animações, scroll reveal, contadores, tabs
  nav.js                — Navbar com dropdowns + footer + modal de facção
```

---

## 🔗 Navegação — URIs Principais

| Página | URI |
|--------|-----|
| Homepage | `index.html` |
| Entrada | `entry.html` |
| Universo | `universo.html` |
| Personagens | `personagens.html` |
| Facções | `faccoes.html` |
| Filmes | `filmes.html` |
| Livros | `livros.html` |
| Planetas | `planetas.html` |
| Tecnologia | `tecnologia.html` |
| Temas | `temas.html` |
| Timeline | `timeline.html` |
| Quiz | `quiz.html` |

### Fragmentos de Âncora (Temas)
- `temas.html#religiao`
- `temas.html#poder`
- `temas.html#ecologia`
- `temas.html#destino`
- `temas.html#heroi`

---

## 🛠️ Tecnologias

- **HTML5** puro com CSS variables para temas de facção
- **CSS3** — animações, grid, flexbox, custom properties, backdrop-filter
- **JavaScript ES6+** — vanilla JS, Intersection Observer, localStorage
- **Google Fonts** — Cinzel (display), Raleway (body), Crimson Text (prose)
- Sem frameworks ou bibliotecas externas — 100% vanilla

---

## 📋 Funcionalidades Não Implementadas / Próximos Passos

- [x] ~~Páginas individuais para Alia Atreides, Irulan Corrino, Scytale~~ ✅ Adicionadas
- [x] ~~Dune: Part Three (Messiah) completamente integrado~~ ✅
- [ ] Páginas individuais para Duque Leto I, Duncan Idaho, Gurney Halleck, Reverendo Mãe Mohiam
- [ ] Secção de personagens de Children of Dune (Leto II, Ghanima)
- [ ] Modo "sem spoilers" (ocultar conteúdo além do Livro 1)
- [ ] Motor de busca interno
- [ ] Sistema de favoritos
- [ ] Galeria de citações por facção
- [ ] Página de adaptações (série TV, jogos, etc.)
- [ ] Glossário / Terminologia de Dune
- [ ] Mapas interativos de Arrakis

---

## 📜 Aviso Legal

Este é um portal não oficial criado para fins educacionais e de entretenimento. Dune e todos os personagens, locais e elementos relacionados são propriedade intelectual dos respectivos detentores de direitos (Frank Herbert Estate, Legendary Entertainment, etc.).

Baseado nas obras de **Frank Herbert** (1920–1986).
