# Waitlist Backend (Supabase) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist waitlist emails directly from the static GitHub Pages site into a Supabase Postgres table, with no server and no build step.

**Architecture:** The browser loads `supabase-js` (UMD, via CDN) and a small `config.js`, then `app.jsx` creates a Supabase client with the public anon key and inserts each signup into `public.waitlist`. Row Level Security allows anonymous `INSERT` only — nobody can read the list with the anon key.

**Tech Stack:** Supabase (Postgres + PostgREST), `@supabase/supabase-js@2.106.2` UMD, React 18 (CDN) + Babel standalone (existing). No bundler.

---

## Testing note (read first)

This project has **no JS test runner** and runs unbundled in the browser (React + Babel via CDN). Forcing a unit-test framework onto it would be disproportionate. Verification therefore uses the **same browser-based harness already used in this repo**:

- Render the page with the cached Playwright Chromium headless shell and assert on the rendered DOM / `page.evaluate`.
- For the live database path, insert a test row through the real client and confirm it in Supabase, and confirm anonymous `SELECT` is denied.

Reusable headless binary:
```
$HOME/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell
```
Local server for any headless check: `python3 -m http.server <port>` from the repo root.

**One-time verification setup** (installs `playwright-core` so the `node -e` checks below can drive the cached browser). The checks run from the repo root and resolve the package via `NODE_PATH=/tmp/a11y/node_modules`:
```bash
mkdir -p /tmp/a11y && (cd /tmp/a11y && npm init -y >/dev/null 2>&1 && npm i playwright-core >/dev/null 2>&1) && echo "ready"
```

---

## File Structure

- **Create `docs/SUPABASE_SETUP.md`** — provisioning steps + SQL the user runs in Supabase. One responsibility: how to stand up the backend.
- **Create `config.js`** — `window.NIAN_SUPABASE = { url, anonKey }`. One responsibility: public runtime config.
- **Modify `index.html`** — load `supabase-js` (with SRI) and `config.js` before `app.jsx`.
- **Modify `app.jsx`** — module-level Supabase client + `saveLead()` helper; new copy strings; async `EmailForm` submit (loading/sent/error/duplicate); async `App.onSubmit`.

---

## Task 1: Supabase provisioning doc (SQL + steps)

**Files:**
- Create: `docs/SUPABASE_SETUP.md`

- [ ] **Step 1: Write the setup doc**

Create `docs/SUPABASE_SETUP.md` with exactly this content:

````markdown
# Setup do Supabase — waitlist

Passo a passo para provisionar o backend que salva os emails da landing.
Tudo aqui é feito **uma vez**, por você, no painel do Supabase.

## 1. Criar o projeto
1. Acesse https://supabase.com e crie um projeto (plano grátis serve).
2. Escolha uma região próxima (ex.: South America / São Paulo).

## 2. Criar a tabela + segurança (RLS)
No painel: **SQL Editor → New query**, cole e rode:

```sql
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null
    check (char_length(email) <= 254
           and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  lang text not null default 'pt' check (lang in ('pt','en','es')),
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_email_key
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

create policy "anon can insert waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);
```

> Não criamos policy de `select/update/delete`. Logo, a anon key consegue
> **gravar** mas **não** ler/baixar a lista. Para consultar os inscritos, use
> o painel do Supabase (Table Editor) ou a `service_role` key (secreta, nunca
> no front).

## 3. Pegar as credenciais públicas
**Project Settings → API**:
- **Project URL** → `https://SEU_PROJETO.supabase.co`
- **anon public** key → string longa `eyJ...`

Cole esses dois valores em `config.js` na raiz do repositório.

## 4. Conferir
- Table Editor mostra a tabela `waitlist` vazia.
- Após a landing gravar um teste, a linha aparece aqui.
````

- [ ] **Step 2: Verify the SQL parses (lint locally, no DB needed)**

Run:
```bash
grep -c "create policy" docs/SUPABASE_SETUP.md
```
Expected: `1`

- [ ] **Step 3: Commit**

```bash
git add docs/SUPABASE_SETUP.md
git commit -m "docs: add Supabase provisioning guide for waitlist"
```

---

## Task 2: Public config file + load scripts in index.html

**Files:**
- Create: `config.js`
- Modify: `index.html` (script block before `app.jsx`)

- [ ] **Step 1: Create `config.js` with placeholders**

```javascript
// Configuração pública do Supabase para a waitlist.
// A anon key é PÚBLICA por design (a segurança vem do Row Level Security),
// por isso pode ir versionada no git. Veja docs/SUPABASE_SETUP.md.
// Troque pelos valores reais em: Supabase → Project Settings → API.
window.NIAN_SUPABASE = {
  url: "https://SEU_PROJETO.supabase.co",
  anonKey: "SEU_ANON_KEY"
};
```

- [ ] **Step 2: Add the loader scripts to `index.html`**

Find this block near the end of `index.html`:

```html
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

<script type="text/babel" src="app.jsx"></script>
```

Replace it with (adds Supabase UMD + config.js **before** `app.jsx`):

```html
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

<!-- Supabase client (waitlist persistence) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.106.2/dist/umd/supabase.js" integrity="sha384-m/8UHFJHeU6nrCKP2hBnAseuvAKUmLF+8e5bWos5CJL023vuxX7kiVL5t8yjsJhV" crossorigin="anonymous"></script>
<script src="config.js"></script>

<script type="text/babel" src="app.jsx"></script>
```

- [ ] **Step 3: Verify globals load and app still mounts (headless)**

Run from repo root:
```bash
python3 -m http.server 8200 >/tmp/n.log 2>&1 & echo $! >/tmp/n.pid; sleep 1
SB="$HOME/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell"
"$SB" --headless --no-sandbox --disable-gpu --virtual-time-budget=9000 --dump-dom http://localhost:8200/ 2>/dev/null > /tmp/n_dom.html
grep -c "Você abriu o Anki" /tmp/n_dom.html      # app mounted
grep -oc "config.js" /tmp/n_dom.html             # config script present
kill "$(cat /tmp/n.pid)"
```
Expected: app-mounted count ≥ 1, `config.js` present. (No assertion on `window.supabase` here — dump-dom doesn't expose JS globals; Task 3 verifies the client.)

- [ ] **Step 4: Commit**

```bash
git add config.js index.html
git commit -m "feat: load supabase-js and public config on the page"
```

---

## Task 3: Supabase client + saveLead helper + new copy strings

**Files:**
- Modify: `app.jsx` (top of file; COPY object for pt/en/es)

- [ ] **Step 1: Add the client + helper at the top of `app.jsx`**

Find the first line:
```javascript
const { useState, useEffect, useRef } = React;
```

Insert immediately after it:
```javascript

// ──────────────────────────────────────────────────────────────────
// Supabase client (waitlist persistence)
// ──────────────────────────────────────────────────────────────────
const NIAN_SB = (typeof window !== "undefined" && window.NIAN_SUPABASE) || null;
const sb = (NIAN_SB && NIAN_SB.url && NIAN_SB.url.indexOf("SEU_PROJETO") === -1 && window.supabase)
  ? window.supabase.createClient(NIAN_SB.url, NIAN_SB.anonKey)
  : null;

// Saves a lead. Resolves on success AND on duplicate (Postgres 23505).
// Throws on real errors so the form can show an error state.
// If Supabase isn't configured yet, no-ops with a warning (cosmetic success).
async function saveLead(email, lang) {
  if (!sb) {
    console.warn("[Nian] Supabase não configurado — inscrição não foi salva.");
    return;
  }
  const { error } = await sb
    .from("waitlist")
    .insert({ email: email.trim().toLowerCase(), lang });
  if (error && error.code !== "23505") throw error;
}
```

- [ ] **Step 2: Add `form_sending` and `form_err_generic` to the PT copy**

In the `pt` object, find:
```javascript
    form_nospam: "Sem spam. Só avisamos quando abrir o acesso.",
```
Insert immediately after it:
```javascript
    form_sending: "Enviando…",
    form_err_generic: "Algo deu errado. Tenta de novo em instantes.",
```

- [ ] **Step 3: Add the same keys to the EN copy**

In the `en` object, find:
```javascript
    form_nospam: "No spam. We only email when access opens.",
```
Insert immediately after it:
```javascript
    form_sending: "Sending…",
    form_err_generic: "Something went wrong. Please try again in a moment.",
```

- [ ] **Step 4: Add the same keys to the ES copy**

In the `es` object, find:
```javascript
    form_nospam: "Sin spam. Solo avisamos cuando se abra el acceso.",
```
Insert immediately after it:
```javascript
    form_sending: "Enviando…",
    form_err_generic: "Algo salió mal. Inténtalo de nuevo en un momento.",
```

- [ ] **Step 5: Verify app still mounts and the client initializes (headless)**

Run from repo root (uses `page.evaluate` to read JS globals):
```bash
python3 -m http.server 8201 >/tmp/n.log 2>&1 & echo $! >/tmp/n.pid; sleep 1
NODE_PATH=/tmp/a11y/node_modules node -e '
import("playwright-core").then(async ({chromium})=>{
  const EXEC=process.env.HOME+"/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell";
  const b=await chromium.launch({executablePath:EXEC,headless:true,args:["--no-sandbox"]});
  const p=await b.newPage();
  await p.goto("http://localhost:8201/",{waitUntil:"networkidle"});
  await p.waitForSelector("#root .nian-btn",{timeout:15000});
  const hasFactory=await p.evaluate(()=>typeof window.supabase?.createClient==="function");
  const mounted=await p.evaluate(()=>!!document.querySelector("#root .nian-btn"));
  console.log("supabase factory present:", hasFactory, "| app mounted:", mounted);
  await b.close();
});'
kill "$(cat /tmp/n.pid)"
```
Expected: `supabase factory present: true | app mounted: true`

- [ ] **Step 6: Commit**

```bash
git add app.jsx
git commit -m "feat: add supabase client, saveLead helper and form copy"
```

---

## Task 4: Async form submission (loading / sent / error / duplicate)

**Files:**
- Modify: `app.jsx` (`EmailForm` component + `App.onSubmit`)

- [ ] **Step 1: Make `EmailForm.submit` async with a loading state**

In `EmailForm`, find:
```javascript
  const submit = (e) => {
    e.preventDefault();
    const v = email.trim();
    if (!v) { setErr(t.form_err_empty); setState("error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setErr(t.form_err_invalid); setState("error"); return; }
    setState("sent");
    setErr("");
    onSubmit?.(v);
  };
```
Replace with:
```javascript
  const submit = async (e) => {
    e.preventDefault();
    const v = email.trim();
    if (!v) { setErr(t.form_err_empty); setState("error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setErr(t.form_err_invalid); setState("error"); return; }
    setErr("");
    setState("loading");
    try {
      await onSubmit?.(v);
      setState("sent");
    } catch (err) {
      setErr(t.form_err_generic);
      setState("error");
    }
  };
```

- [ ] **Step 2: Make the submit button reflect the loading state**

In `EmailForm`, find:
```javascript
        <button type="submit" className="nian-btn">
          {ctaLabel} <Arrow size={20} />
        </button>
```
Replace with:
```javascript
        <button type="submit" className="nian-btn" disabled={state === "loading"}
          style={state === "loading" ? { opacity: 0.7, cursor: "wait" } : undefined}>
          {state === "loading" ? t.form_sending : <>{ctaLabel} <Arrow size={20} /></>}
        </button>
```

- [ ] **Step 3: Make `App.onSubmit` persist the lead before the toast**

In `App`, find:
```javascript
  const onSubmit = (email) => {
    setToast(`✓ ${email} ${t.toast_added}`);
    setTimeout(() => setToast(null), 3200);
  };
```
Replace with:
```javascript
  const onSubmit = async (email) => {
    await saveLead(email, lang);
    setToast(`✓ ${email} ${t.toast_added}`);
    setTimeout(() => setToast(null), 3200);
  };
```

- [ ] **Step 4: Verify the full submit flow (headless, no creds → cosmetic success)**

With `config.js` still holding placeholders, `saveLead` no-ops, so a valid submit should reach the success state. Run from repo root:
```bash
python3 -m http.server 8202 >/tmp/n.log 2>&1 & echo $! >/tmp/n.pid; sleep 1
NODE_PATH=/tmp/a11y/node_modules node -e '
import("playwright-core").then(async ({chromium})=>{
  const EXEC=process.env.HOME+"/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell";
  const b=await chromium.launch({executablePath:EXEC,headless:true,args:["--no-sandbox"]});
  const p=await b.newPage();
  await p.goto("http://localhost:8202/",{waitUntil:"networkidle"});
  await p.waitForSelector("#root input[type=email]",{timeout:15000});
  // empty submit → error
  await p.click("#root .nian-btn");
  const err=await p.locator("#root [role=alert]").first().isVisible().catch(()=>false);
  // valid submit → success card (role=status)
  await p.fill("#root input[type=email]","teste@exemplo.com");
  await p.click("#root .nian-btn");
  await p.waitForSelector("#root [role=status]",{timeout:8000});
  const sent=await p.locator("#root [role=status]").first().isVisible();
  console.log("error-on-empty:",err,"| success-on-valid:",sent);
  await b.close();
});'
kill "$(cat /tmp/n.pid)"
```
Expected: `error-on-empty: true | success-on-valid: true`

- [ ] **Step 5: Commit**

```bash
git add app.jsx
git commit -m "feat: persist waitlist signups via supabase with loading/error states

Closes #5"
```

---

## Task 5: Live wiring (real credentials) + end-to-end verification + merge

**Files:**
- Modify: `config.js` (real URL + anon key)

> Prerequisite: the user has completed `docs/SUPABASE_SETUP.md` and provided the
> Project URL + anon public key.

- [ ] **Step 1: Put the real credentials in `config.js`**

Replace the placeholder values in `config.js` with the real `url` and `anonKey`
provided by the user.

- [ ] **Step 2: Live insert test against the real project**

Serve locally and submit a unique email through the real client:
```bash
python3 -m http.server 8203 >/tmp/n.log 2>&1 & echo $! >/tmp/n.pid; sleep 1
NODE_PATH=/tmp/a11y/node_modules node -e '
import("playwright-core").then(async ({chromium})=>{
  const EXEC=process.env.HOME+"/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell";
  const b=await chromium.launch({executablePath:EXEC,headless:true,args:["--no-sandbox"]});
  const p=await b.newPage();
  const email="test+"+Date.now()+"@nian.dev";
  await p.goto("http://localhost:8203/",{waitUntil:"networkidle"});
  await p.waitForSelector("#root input[type=email]",{timeout:15000});
  await p.fill("#root input[type=email]",email);
  await p.click("#root .nian-btn");
  await p.waitForSelector("#root [role=status]",{timeout:10000});
  console.log("inserted (success card shown) for:",email);
  await b.close();
});'
kill "$(cat /tmp/n.pid)"
```
Expected: success card shown; the row appears in Supabase **Table Editor → waitlist**. (User confirms the row, since anon cannot read it back.)

- [ ] **Step 3: Confirm anonymous read is denied (RLS sanity check)**

Anon `SELECT` must return an empty array, never the stored rows. Replace
`SEU_PROJETO` and `SEU_ANON_KEY` with the real values:
```bash
curl -s "https://SEU_PROJETO.supabase.co/rest/v1/waitlist?select=email" \
  -H "apikey: SEU_ANON_KEY" -H "Authorization: Bearer SEU_ANON_KEY"
```
Expected: `[]` (empty) — RLS blocks reads. If real emails come back, a SELECT
policy is misconfigured; stop and fix RLS before merging.

- [ ] **Step 4: Commit real config**

```bash
git add config.js
git commit -m "chore: wire real Supabase credentials for waitlist"
```

- [ ] **Step 5: Push, open PR, merge after deploy verification**

```bash
git push -u origin feat/waitlist-backend
gh pr create --base main --head feat/waitlist-backend \
  --title "feat: backend da waitlist (Supabase)" \
  --body "Implementa #5: persiste os emails da waitlist no Supabase direto do site estático (anon key + RLS insert-only). Sem servidor, sem build.

## Verificação
- Headless: estados do form (erro/loading/sucesso) OK
- Live: insert real grava na tabela; SELECT anônimo negado pelo RLS

Closes #5"
```
After merge, wait for the Pages deploy and confirm a live signup on
https://tinaglini.github.io/niancore-landing/ creates a row.

---

## Self-review notes

- **Spec coverage:** table+RLS (Task 1), no-build CDN load (Task 2), client+helper+copy (Task 3), async flow with loading/sent/error/duplicate + cosmetic-when-unconfigured (Task 4), live verification incl. anon-read-denied + merge-after-creds (Task 5). All spec sections mapped.
- **Names consistent:** `saveLead(email, lang)`, client `sb`, `window.NIAN_SUPABASE`, copy keys `form_sending`/`form_err_generic`, table `waitlist`, column `lang` — used identically across tasks.
- **No placeholders in deliverables:** the only `SEU_PROJETO`/`SEU_ANON_KEY` tokens are intentional config placeholders the user replaces in Task 5; the client treats `SEU_PROJETO` as "unconfigured".
