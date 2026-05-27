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
