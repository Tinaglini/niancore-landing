<div align="center">

# Nian — Landing Page

**Flashcards com repetição espaçada, sem a interface dos anos 90 e sem te punir por faltar um dia.**

Landing page de acesso antecipado do Nian, construída com React (via CDN) e um design system neobrutalista, sem etapa de build.

[![Deploy to GitHub Pages](https://github.com/Tinaglini/niancore-landing/actions/workflows/deploy.yml/badge.svg)](https://github.com/Tinaglini/niancore-landing/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## ✶ Sobre

Esta é a landing page de captação de acesso antecipado (*waitlist*) do **Nian**, um app de flashcards com repetição espaçada focado em quem desistiu do Anki. A página é totalmente estática: React e Babel são carregados via CDN e o JSX é transpilado no navegador, então **não há etapa de build**.

A interface é trilíngue (🇧🇷 Português · 🇺🇸 Inglês · 🇪🇸 Espanhol), com troca de idioma persistida em `localStorage`.

## ✶ Stack

- **React 18** (UMD, via [unpkg](https://unpkg.com))
- **Babel Standalone** — transpilação de JSX em tempo de execução
- **CSS puro** — design system neobrutalista (sombras *hard-offset*, bordas grossas, paleta vibrante)
- **Fontes** — Montserrat + JetBrains Mono (Google Fonts)

## ✶ Estrutura

```
niancore-landing/
├── index.html      # Markup, estilos e carregamento dos scripts
├── app.jsx         # Aplicação React (copy PT/EN/ES, seções e componentes)
├── .github/
│   └── workflows/
│       └── deploy.yml   # Deploy automático para GitHub Pages
├── LICENSE
└── README.md
```

## ✶ Rodando localmente

Como o `index.html` carrega `app.jsx` via `fetch`, abrir o arquivo direto (`file://`) **não funciona** por causa de CORS. Use um servidor HTTP estático:

```bash
# Python 3
python3 -m http.server 8000

# ou Node
npx serve .
```

Depois acesse <http://localhost:8000>.

## ✶ Deploy

O deploy é automático: cada push na branch `main` dispara o workflow do GitHub Actions que publica o site no **GitHub Pages**. A URL ao vivo fica disponível em *Settings → Pages* após o primeiro deploy.

## ✶ Roadmap

O progresso é acompanhado via [Issues](https://github.com/Tinaglini/niancore-landing/issues) e [Milestones](https://github.com/Tinaglini/niancore-landing/milestones):

- **v1.0 — Lançamento da Landing** · página no ar, SEO e acessibilidade
- **v1.1 — Captura de Leads** · integração real do formulário de waitlist
- **v1.2 — Otimização & Crescimento** · analytics, performance e i18n

## ✶ Licença

Distribuído sob a licença [MIT](LICENSE). © 2026 Lucas Tinaglini.
