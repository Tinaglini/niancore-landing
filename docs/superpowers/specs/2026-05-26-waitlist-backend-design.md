# Spec — Backend da waitlist (Supabase)

**Data:** 2026-05-26
**Issue:** #5 — Integrar formulário de waitlist a um backend real
**Milestone:** v1.1 — Captura de Leads

## Problema

Hoje o `EmailForm` apenas valida o email no cliente, mostra a tela de sucesso
com um número de fila **fictício** e dispara um toast. Nenhum email é
persistido. O site é estático (GitHub Pages), sem runtime de servidor.

## Objetivo

Persistir os emails da waitlist num banco real, **direto do navegador**, sem
adicionar servidor nem etapa de build, mantendo a UX atual.

## Decisões tomadas (brainstorming)

- **Supabase sozinho** (sem Resend nesta fase). Resend/confirmação por email
  ficam para a issue #7.
- **Contador de fila permanece cosmético** — não liberamos contagem/leitura no
  banco, então a posição na fila continua sendo um número amigável exibido.
- **Sem build:** `supabase-js` carregado via CDN (UMD), igual ao React/Babel.

## Arquitetura

```
Navegador (GitHub Pages)
  └─ supabase-js (CDN, window.supabase.createClient)
       └─ insert → Supabase REST (PostgREST)
            └─ tabela public.waitlist (Postgres) com RLS
```

Nenhum segredo no cliente: a **anon key** é pública por design; a segurança vem
do Row Level Security, não de esconder a chave.

## Modelo de dados — `public.waitlist`

| coluna | tipo | regras |
|---|---|---|
| `id` | uuid | PK, default `gen_random_uuid()` |
| `email` | text | `not null`, único case-insensitive (índice em `lower(email)`), `CHECK` de formato + tamanho |
| `lang` | text | `CHECK (lang in ('pt','en','es'))`, default `'pt'` |
| `created_at` | timestamptz | default `now()` |

### SQL de setup (executado pelo usuário no SQL Editor)

```sql
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null
    check (char_length(email) <= 254
           and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  lang text not null default 'pt' check (lang in ('pt','en','es')),
  created_at timestamptz not null default now()
);

-- unicidade case-insensitive
create unique index if not exists waitlist_email_key
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- única policy: inserir é permitido para visitantes anônimos; ler/editar/apagar não.
create policy "anon can insert waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);
```

## Segurança (RLS)

- RLS **ativado**.
- **Única** policy: `INSERT` para o papel `anon`. **Nenhuma** policy de
  `SELECT/UPDATE/DELETE` → com a anon key ninguém lê nem baixa a lista.
- `CHECK` de formato/tamanho do email como defesa adicional contra lixo.
- Proteção anti-spam mais forte (honeypot/rate-limit) é a issue #6 — fora deste escopo.

## Fluxo do formulário (`EmailForm.submit`)

1. Valida email no cliente (lógica atual).
2. Estado **`loading`** — botão exibe "Enviando…" e fica desabilitado.
3. `supabase.from('waitlist').insert({ email: <lower/trim>, lang })`.
4. **Sucesso** → estado `sent` (tela de sucesso atual + número cosmético) + toast.
5. **Duplicado** (Postgres `23505`) → tratado como **sucesso** ("você já está na lista").
6. **Erro de rede/outro** → estado `error` com mensagem amigável; mantém o email
   digitado para retry.

### Componentes / responsabilidades

- **`config.js`** (novo): expõe `window.NIAN_SUPABASE = { url, anonKey }`.
- **client Supabase** (em `app.jsx`, nível de módulo): criado uma vez se houver
  config; helper `async saveLead(email, lang)` que insere e normaliza o
  resultado (sucesso, duplicado→sucesso, erro→throw).
- **`App.onSubmit`**: vira `async (email) => { await saveLead(email, lang); setToast(...) }`.
- **`EmailForm.submit`**: vira `async`, controla os estados `idle/loading/sent/error`.

### Copy nova (PT/EN/ES)

- `form_sending`: "Enviando…" / "Sending…" / "Enviando…"
- `form_err_generic`: mensagem amigável de falha (ex.: "Algo deu errado. Tenta de novo.").

## Config / credenciais

- `index.html` carrega, antes de `app.jsx`: o UMD do `supabase-js` (CDN) e o `config.js`.
- `config.js` contém Project URL + anon key (podem ir para o git).
- **Comportamento sem config:** se `window.NIAN_SUPABASE` estiver ausente/placeholder,
  `saveLead` registra um `console.warn` e a UX cai no comportamento atual
  (sucesso cosmético, sem gravar). O PR só é mergeado **depois** das credenciais
  reais entrarem, para que produção sempre grave.

## Pré-requisitos do usuário (não automatizáveis)

1. Criar projeto Supabase grátis.
2. Rodar o SQL acima no SQL Editor.
3. Fornecer Project URL + anon public key (ou colar em `config.js`).

## Verificação

- **Sem credenciais:** render headless confirma app montando, validação do form
  e estado de erro/loading funcionando; fallback cosmético sem quebrar.
- **Com credenciais (ao vivo):** inserir um email de teste e confirmar a linha na
  tabela `waitlist`; confirmar que duplicado não quebra; confirmar que `SELECT`
  anônimo é negado pelo RLS.

## Fora de escopo (outras issues)

- Anti-spam honeypot/rate-limit → #6
- Email de confirmação / double opt-in (Resend + Edge Function) → #7
- Contador real de fila (exigiria RPC/contagem com policy própria)
