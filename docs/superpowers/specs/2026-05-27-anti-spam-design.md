# Spec — Anti-spam do formulário (client-side)

**Data:** 2026-05-27
**Issue:** #6 — Adicionar proteção anti-spam ao formulário
**Milestone:** v1.1 — Captura de Leads

## Problema

O formulário insere emails no Supabase direto do navegador (ver
[2026-05-26-waitlist-backend-design.md](2026-05-26-waitlist-backend-design.md)).
Bots de formulário podem preencher e enviar lixo, poluindo a tabela `waitlist`.

## Objetivo

Barrar **spam casual de formulário** sem adicionar infra, sem fricção visível
para o usuário real, e sem quebrar a acessibilidade já implementada (#3).

## Decisão (brainstorming)

Abordagem **leve, client-side** (honeypot + time-trap + throttle local). A
opção robusta (Edge Function + Turnstile travando o insert direto) foi
descartada por reintroduzir a infra serverless evitada na #7.

## Limite conhecido (honesto)

Estes guardas protegem o **formulário**. Como a publishable key é pública,
ninguém impede um `POST` direto em `/rest/v1/waitlist`. Blindar a API exigiria
mover o insert para uma Edge Function com verificação de captcha (registrado
como upgrade futuro — opção B). Para uma waitlist pré-lançamento, o vetor
realista é spam de formulário, coberto aqui.

## Arquitetura

Toda a lógica vive no componente `EmailForm` em `app.jsx`. Os guardas rodam
**depois** da validação de email (vazio/inválido continuam virando erro) e
**antes** de chamar `saveLead`. Nenhum arquivo novo, nenhuma dependência nova.

## Os três guardas

| Guarda | Como | Threshold |
|---|---|---|
| **Honeypot** | `<input>` oculto (`name="company"`, fora da tela, `tabindex=-1`, `aria-hidden`, `autocomplete="off"`). Se vier com valor → bot. | valor não-vazio |
| **Time-trap** | `useRef(Date.now())` na montagem; compara no submit. | envio em < `2000ms` |
| **Throttle** | timestamp em `localStorage["nian-last-signup"]` após envio real. | novo envio em < `60000ms` |

## Comportamento ao detectar

Se **qualquer** guarda disparar: o form mostra a **tela de sucesso normalmente
mas NÃO chama `saveLead`** (no-op silencioso). Não tipar o bot, não poluir o
banco. Só envios limpos persistem.

A11y/UX:
- Honeypot fora do fluxo de teclado/leitor de tela (`tabindex=-1` + `aria-hidden`).
- `autocomplete="off"` evita autofill do navegador (que causaria falso-positivo).
- Threshold de 2s conta a partir da montagem — humano não preenche email e
  envia em 2s; falso-positivo é desprezível.

## Componentes / responsabilidades

- **`EmailForm` (`app.jsx`)**:
  - `mountedAt = useRef(Date.now())` e `honeyRef = useRef(null)`.
  - Constantes `MIN_FILL_MS = 2000`, `COOLDOWN_MS = 60000`.
  - Honeypot input oculto dentro do `<form>`.
  - `submit`: após validação, checa honeypot/time-trap/throttle. Se spam →
    `setState("sent")` e retorna. Senão segue o fluxo atual
    (`loading → await onSubmit → grava timestamp → sent`).

## Verificação

Headless (Playwright + Chromium em cache), observando requisições
`POST /rest/v1/waitlist`:

- Honeypot preenchido via JS + email válido → **sucesso na tela, sem POST**.
- Envio imediato (< 2s) → **sucesso na tela, sem POST**.
- Envio limpo (> 2s) → **POST 201**.
- Segundo envio dentro de 60s do anterior → **sem POST**.

## Fora de escopo

- Proteção contra abuso direto da API REST → opção B (Edge Function + Turnstile), futuro.
- CAPTCHA visível → descartado (fricção; e exige verificação server-side).
