const { useState, useEffect, useRef } = React;

// ──────────────────────────────────────────────────────────────────
// Copy (PT + EN + ES)
// ──────────────────────────────────────────────────────────────────
const COPY = {
  pt: {
    nav_badge: "Acesso antecipado · Fev/2026",
    hero_tag: "Para quem desistiu do Anki",
    hero_h1_a: "Você abriu o Anki, viu",
    hero_h1_hl: "650 cards",
    hero_h1_b: ", e fechou.",
    hero_h1_c: "A gente entende.",
    hero_p: ["Flashcards com repetição espaçada, ", "sem a interface dos anos 90", " e sem te punir por faltar um dia."],
    hero_cta: "Quero acesso antecipado",
    hero_pills: ["✶ Importa do Anki", "✶ Sem fila punitiva", "✶ Card em 5s"],
    hero_email_ph: "seu@email.com",
    form_err_empty: "Coloca seu email aí.",
    form_err_invalid: "Esse email não parece válido.",
    form_sent_q: "Pronto. Você é o #",
    form_sent_queue: " na fila.",
    form_sent_notify_a: "Avisamos no ",
    form_sent_notify_b: " quando abrir.",
    form_nospam: "Sem spam. Só avisamos quando abrir o acesso.",
    card_subject: "Medicina · Cardio",
    card_q_label: "PERGUNTA",
    card_a_label: "RESPOSTA",
    card_question: ["Qual diurético é poupador", "de potássio?"],
    card_answer: "Espironolactona",
    card_answer_sub: "Antagonista da aldosterona.",
    card_rating: ["Difícil", "Ok", "Fácil"],
    streak_n: "+5 dias",
    streak_label: "sem culpa",
    pains_h2: "Três motivos pelos quais você fechou o app. E nunca mais abriu.",
    pains: [
      { title: "Review Hell", body: "Faltou um dia e voltou com 650 cards. A gente não te pune por isso. Sua fila se ajusta ao seu ritmo, não o contrário.", quote: "\"Abri o Anki, vi 540 reviews, fechei. Faz 3 meses.\"" },
      { title: "90 min fazendo cards", body: "Crie um card em 5 segundos, não em 5 minutos. Cole texto, frente e verso aparece. Cloze automático. Sem add-on.", quote: "\"Passei 2h vendo anime e 90min disso foi fazendo card.\"" },
      { title: "Interface Windows 95", body: "Você não deveria precisar de tutorial no YouTube pra começar a estudar. Abre, importa, estuda. Nesta ordem.", quote: "\"Eu queria aprender japonês, mas a ferramenta parecia Windows 95.\"" }
    ],
    how_h2: "Três passos. Sem plugin, sem tutorial no YouTube, sem config global.",
    steps: [
      { title: "Crie ou importe seu deck", body: "Já tem deck no Anki? Importa em 30 segundos. .apkg, .csv ou cola de um Google Sheets. Decks prontos por curso, também." },
      { title: "Estude no seu ritmo", body: "O algoritmo se adapta a você. Não o contrário. Faltou? Tudo bem. Sua fila não vira castigo no dia seguinte." },
      { title: "Acompanhe seu progresso", body: "Veja o que está fixando, e o que ainda não. Sem surpresas na prova. Sem precisar exportar CSV pro Excel." }
    ],
    import_label: "importando",
    import_cards: "1.241 / 1.620 cards",
    import_topics: ["Cardiologia", "Pneumo", "Endócrino", "Nefro", "+ 7"],
    rhythm_title: "Sua semana",
    rhythm_pill: "sem fila atrasada",
    rhythm_days: ["S", "T", "Q", "Q", "S", "S", "D"],
    rhythm_caption: "Faltou quarta e sábado. Nenhum problema. Nada de 650 cards na segunda.",
    progress_title: "Fixação por tópico",
    progress_range: "últimos 30d",
    progress_topics: [
      { name: "Insuficiência cardíaca", v: 92 },
      { name: "Diuréticos", v: 78 },
      { name: "Arritmias", v: 41 }
    ],
    stats_h2: "O mercado existe. As pessoas amam, e odeiam, a mesma ferramenta há 20 anos.",
    stats: [
      { big: "86%", label: "dos estudantes de medicina americanos usam Anki.", sub: "Class Central + Migaku, 2024." },
      { big: "$700k", label: "receita mensal estimada do AnkiMobile iOS.", sub: "Sensor Tower, mar/2026." },
      { big: "650", label: "cards acumulados é o motivo #1 de abandono.", sub: "Verbatim de App Store, fóruns e blogs." }
    ],
    cta_h2: "Chega de interface que te faz desistir antes de estudar.",
    cta_p: "Acesso antecipado gratuito. Avisamos quando abrir. Sem subscription. Sem AI slop.",
    cta_btn: "Entrar na fila",
    cta_nospam: "Sem spam. Sem follow-up. Um único email quando abrir.",
    cta_dots: ["● importa do Anki", "● funciona offline", "● sem subscription"],
    marquee: ["spaced repetition sem planilha", "não te pune por faltar", "card em 5 segundos", "importa do Anki em 30s", "sem tutorial no youtube", "feito em 2026, não em 2006"],
    toast_added: "adicionado à fila."
  },
  en: {
    nav_badge: "Early access · Feb/2026",
    hero_tag: "For everyone who quit Anki",
    hero_h1_a: "You opened Anki, saw",
    hero_h1_hl: "650 cards",
    hero_h1_b: ", and closed it.",
    hero_h1_c: "We get it.",
    hero_p: ["Spaced repetition flashcards, ", "without the 90s interface", " and without punishing you for missing a day."],
    hero_cta: "Get early access",
    hero_pills: ["✶ Imports from Anki", "✶ No punitive queue", "✶ Card in 5s"],
    hero_email_ph: "you@email.com",
    form_err_empty: "Drop your email here.",
    form_err_invalid: "That email doesn't look right.",
    form_sent_q: "Done. You're #",
    form_sent_queue: " in line.",
    form_sent_notify_a: "We'll ping ",
    form_sent_notify_b: " when it opens.",
    form_nospam: "No spam. We only email when access opens.",
    card_subject: "Medicine · Cardio",
    card_q_label: "QUESTION",
    card_a_label: "ANSWER",
    card_question: ["Which diuretic is", "potassium-sparing?"],
    card_answer: "Spironolactone",
    card_answer_sub: "Aldosterone antagonist.",
    card_rating: ["Hard", "Ok", "Easy"],
    streak_n: "+5 days",
    streak_label: "no guilt",
    pains_h2: "Three reasons you closed the app. And never opened it again.",
    pains: [
      { title: "Review Hell", body: "Missed one day and came back to 650 cards. We don't punish you for that. Your queue adapts to your pace, not the other way around.", quote: "\"Opened Anki, saw 540 reviews, closed it. That was 3 months ago.\"" },
      { title: "90 min making cards", body: "Build a card in 5 seconds, not 5 minutes. Paste text, front and back appear. Auto cloze. No add-on required.", quote: "\"I spent 2h watching anime and 90 of those min were making cards.\"" },
      { title: "Windows 95 UI", body: "You shouldn't need a YouTube tutorial just to start studying. Open, import, study. In that order.", quote: "\"I wanted to learn Japanese, but the tool looked like Windows 95.\"" }
    ],
    how_h2: "Three steps. No plugin, no YouTube tutorial, no global config.",
    steps: [
      { title: "Create or import your deck", body: "Already have an Anki deck? Import it in 30 seconds. .apkg, .csv or paste from a Google Sheet. Ready-made decks by subject, too." },
      { title: "Study at your own pace", body: "The algorithm adapts to you. Not the other way around. Missed a day? That's fine. Your queue won't turn into punishment tomorrow." },
      { title: "Track your progress", body: "See what's sticking, and what isn't. No exam-day surprises. No CSV exports into Excel." }
    ],
    import_label: "importing",
    import_cards: "1,241 / 1,620 cards",
    import_topics: ["Cardiology", "Pulmo", "Endocrine", "Nephro", "+ 7"],
    rhythm_title: "Your week",
    rhythm_pill: "no backlog",
    rhythm_days: ["M", "T", "W", "T", "F", "S", "S"],
    rhythm_caption: "Missed Wednesday and Saturday. No problem. No 650 cards on Monday.",
    progress_title: "Retention by topic",
    progress_range: "last 30d",
    progress_topics: [
      { name: "Heart failure", v: 92 },
      { name: "Diuretics", v: 78 },
      { name: "Arrhythmias", v: 41 }
    ],
    stats_h2: "The market exists. People love, and hate, the same tool for 20 years.",
    stats: [
      { big: "86%", label: "of US medical students use Anki.", sub: "Class Central + Migaku, 2024." },
      { big: "$700k", label: "estimated monthly revenue of AnkiMobile iOS.", sub: "Sensor Tower, Mar/2026." },
      { big: "650", label: "stacked-up cards is the #1 reason for quitting.", sub: "Verbatim from App Store, forums, blogs." }
    ],
    cta_h2: "No more interfaces that make you quit before you study.",
    cta_p: "Free early access. We'll let you know when it opens. No subscription. No AI slop.",
    cta_btn: "Join the waitlist",
    cta_nospam: "No spam. No follow-up. One email when it opens.",
    cta_dots: ["● imports from Anki", "● works offline", "● no subscription"],
    marquee: ["spaced repetition without a spreadsheet", "no punishment for missing a day", "build a card in 5 seconds", "imports from Anki in 30s", "no youtube tutorial needed", "built in 2026, not 2006"],
    toast_added: "added to the waitlist."
  },
  es: {
    nav_badge: "Acceso anticipado · Feb/2026",
    hero_tag: "Para quien dejó Anki",
    hero_h1_a: "Abriste Anki, viste",
    hero_h1_hl: "650 tarjetas",
    hero_h1_b: ", y cerraste.",
    hero_h1_c: "Te entendemos.",
    hero_p: ["Flashcards con repetición espaciada, ", "sin la interfaz de los 90", " y sin castigarte por faltar un día."],
    hero_cta: "Quiero acceso anticipado",
    hero_pills: ["✶ Importa desde Anki", "✶ Sin cola punitiva", "✶ Tarjeta en 5s"],
    hero_email_ph: "tu@email.com",
    form_err_empty: "Pon tu email ahí.",
    form_err_invalid: "Ese email no parece válido.",
    form_sent_q: "Listo. Eres el #",
    form_sent_queue: " en la cola.",
    form_sent_notify_a: "Te avisamos a ",
    form_sent_notify_b: " cuando abra.",
    form_nospam: "Sin spam. Solo avisamos cuando se abra el acceso.",
    card_subject: "Medicina · Cardio",
    card_q_label: "PREGUNTA",
    card_a_label: "RESPUESTA",
    card_question: ["¿Qué diurético ahorra", "potasio?"],
    card_answer: "Espironolactona",
    card_answer_sub: "Antagonista de la aldosterona.",
    card_rating: ["Difícil", "Ok", "Fácil"],
    streak_n: "+5 días",
    streak_label: "sin culpa",
    pains_h2: "Tres razones por las que cerraste la app. Y nunca volviste a abrirla.",
    pains: [
      { title: "Review Hell", body: "Faltaste un día y volviste con 650 tarjetas. No te castigamos por eso. Tu cola se ajusta a tu ritmo, no al revés.", quote: "\"Abrí Anki, vi 540 reviews, cerré. Hace 3 meses.\"" },
      { title: "90 min haciendo tarjetas", body: "Crea una tarjeta en 5 segundos, no en 5 minutos. Pega texto, frente y reverso aparecen. Cloze automático. Sin add-on.", quote: "\"Pasé 2h viendo anime y 90 min de eso haciendo tarjetas.\"" },
      { title: "Interfaz Windows 95", body: "No deberías necesitar un tutorial en YouTube solo para empezar a estudiar. Abre, importa, estudia. En ese orden.", quote: "\"Quería aprender japonés, pero la herramienta parecía Windows 95.\"" }
    ],
    how_h2: "Tres pasos. Sin plugin, sin tutorial en YouTube, sin config global.",
    steps: [
      { title: "Crea o importa tu deck", body: "¿Ya tienes un deck en Anki? Lo importas en 30 segundos. .apkg, .csv o pegando desde un Google Sheet. Decks listos por materia, también." },
      { title: "Estudia a tu ritmo", body: "El algoritmo se adapta a ti. No al revés. ¿Faltaste? No pasa nada. Tu cola no se convierte en castigo al día siguiente." },
      { title: "Sigue tu progreso", body: "Ve qué está fijando, y qué todavía no. Sin sorpresas en el examen. Sin exportar CSV al Excel." }
    ],
    import_label: "importando",
    import_cards: "1.241 / 1.620 tarjetas",
    import_topics: ["Cardiología", "Neumo", "Endocrino", "Nefro", "+ 7"],
    rhythm_title: "Tu semana",
    rhythm_pill: "sin cola atrasada",
    rhythm_days: ["L", "M", "X", "J", "V", "S", "D"],
    rhythm_caption: "Faltaste miércoles y sábado. Ningún problema. Nada de 650 tarjetas el lunes.",
    progress_title: "Retención por tema",
    progress_range: "últimos 30d",
    progress_topics: [
      { name: "Insuficiencia cardíaca", v: 92 },
      { name: "Diuréticos", v: 78 },
      { name: "Arritmias", v: 41 }
    ],
    stats_h2: "El mercado existe. La gente ama, y odia, la misma herramienta hace 20 años.",
    stats: [
      { big: "86%", label: "de los estudiantes de medicina en EE.UU. usan Anki.", sub: "Class Central + Migaku, 2024." },
      { big: "$700k", label: "ingreso mensual estimado de AnkiMobile iOS.", sub: "Sensor Tower, mar/2026." },
      { big: "650", label: "tarjetas acumuladas es la razón #1 de abandono.", sub: "Verbatim de App Store, foros y blogs." }
    ],
    cta_h2: "Basta de interfaces que te hacen abandonar antes de estudiar.",
    cta_p: "Acceso anticipado gratuito. Avisamos cuando abra. Sin suscripción. Sin AI slop.",
    cta_btn: "Unirme a la lista",
    cta_nospam: "Sin spam. Sin follow-up. Un solo email cuando abra.",
    cta_dots: ["● importa desde Anki", "● funciona offline", "● sin suscripción"],
    marquee: ["repetición espaciada sin hoja de cálculo", "no te castiga por faltar", "tarjeta en 5 segundos", "importa desde Anki en 30s", "sin tutorial en youtube", "hecho en 2026, no en 2006"],
    toast_added: "añadido a la lista."
  }
};

// ──────────────────────────────────────────────────────────────────
// Icons
// ──────────────────────────────────────────────────────────────────
const Arrow = (p) => <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width={p.size || 20} height={p.size || 20} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>;
const Check = (p) => <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width={p.size || 14} height={p.size || 14} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const Bolt = (p) => <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width={p.size || 26} height={p.size || 26} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
const Flame = (p) => <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width={p.size || 26} height={p.size || 26} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2s4 4 4 8a4 4 0 0 1-4 4 4 4 0 0 1-4-4c0-1 0-2 1-3 0 3 2 4 3 4-2-3 0-7 0-9z" /><path d="M5 14a7 7 0 1 0 14 0c0 5-3 8-7 8s-7-3-7-8z" /></svg>;
const Skull = (p) => <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width={p.size || 26} height={p.size || 26} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a8 8 0 0 0-8 8v4l2 2v3h4v-2h4v2h4v-3l2-2v-4a8 8 0 0 0-8-8z" /><circle cx="9" cy="11" r="1.2" fill="currentColor" /><circle cx="15" cy="11" r="1.2" fill="currentColor" /></svg>;
const Pixel = (p) => <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width={p.size || 26} height={p.size || 26} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><rect x="3" y="3" width="6" height="6" /><rect x="15" y="3" width="6" height="6" /><rect x="3" y="15" width="6" height="6" /><rect x="15" y="15" width="6" height="6" /><rect x="9" y="9" width="6" height="6" /></svg>;
const Sparkle = (p) => <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" /></svg>;
const Globe = (p) => <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a13 13 0 0 1 0 18a13 13 0 0 1 0-18z" /></svg>;

// ──────────────────────────────────────────────────────────────────
// Language switcher (segmented control)
// ──────────────────────────────────────────────────────────────────
function LangSwitch({ lang, setLang }) {
  const opts = [
    { code: "pt", label: "PT" },
    { code: "en", label: "EN" },
    { code: "es", label: "ES" }
  ];
  return (
    <div role="group" aria-label="Selecionar idioma / Select language" style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: 4, background: "var(--card)",
      border: "2px solid var(--line)", borderRadius: 999,
      boxShadow: "3px 3px 0 0 var(--shadow)"
    }}>
      <span style={{ display: "inline-flex", alignItems: "center", padding: "0 8px 0 6px", color: "var(--muted)" }}>
        <Globe size={14} />
      </span>
      {opts.map((o) => (
        <button
          key={o.code}
          onClick={() => setLang(o.code)}
          aria-pressed={lang === o.code}
          style={{
            appearance: "none", cursor: "pointer", font: "inherit",
            border: "none", padding: "6px 12px",
            borderRadius: 999,
            fontWeight: 800, fontSize: 12, letterSpacing: "0.08em",
            background: lang === o.code ? "var(--ink)" : "transparent",
            color: lang === o.code ? "var(--bg)" : "var(--ink)",
            transition: "background 120ms ease, color 120ms ease"
          }}>
          {o.label}
        </button>
      ))}
    </div>);
}

// ──────────────────────────────────────────────────────────────────
// Email form
// ──────────────────────────────────────────────────────────────────
function EmailForm({ t, ctaLabel, compact = false, onSubmit }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const v = email.trim();
    if (!v) { setErr(t.form_err_empty); setState("error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setErr(t.form_err_invalid); setState("error"); return; }
    setState("sent");
    setErr("");
    onSubmit?.(v);
  };

  if (state === "sent") {
    return (
      <div className="nb" role="status" style={{ padding: 22, display: "flex", alignItems: "center", gap: 14, background: "var(--c-mint)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 999, border: "2.5px solid var(--line)", display: "grid", placeItems: "center", background: "var(--card)" }}>
          <Check size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17 }}>{t.form_sent_q}{Math.floor(1200 + Math.random() * 220)}{t.form_sent_queue}</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{t.form_sent_notify_a}<strong style={{ color: "var(--ink)" }}>{email}</strong>{t.form_sent_notify_b}</div>
        </div>
      </div>);
  }

  return (
    <form onSubmit={submit} noValidate>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 280px", position: "relative" }}>
          <input
            className="nian-input"
            type="email"
            placeholder={t.hero_email_ph}
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
            aria-label="email"
            autoComplete="email" />
        </div>
        <button type="submit" className="nian-btn">
          {ctaLabel} <Arrow size={20} />
        </button>
      </div>
      {state === "error" &&
      <div role="alert" style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: "var(--danger)" }}>{err}</div>
      }
      {!compact &&
      <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)", display: "flex", alignItems: "center", gap: 8 }}>
          <span className="check" aria-hidden><Check /></span>
          {t.form_nospam}
        </div>
      }
    </form>);
}

// ──────────────────────────────────────────────────────────────────
// Hero
// ──────────────────────────────────────────────────────────────────
function Hero({ t, onSubmit, lang, setLang }) {
  return (
    <section style={{ padding: "32px 0 56px" }}>
      <div className="wrap">
        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 56, gap: 16, flexWrap: "wrap" }}>
          <div className="wordmark">
            <span className="mark">N</span>
            <span>Nian</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className="pill hide-mobile">
              <Sparkle /> {t.nav_badge}
            </span>
            <LangSwitch lang={lang} setLang={setLang} />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <div className="section-tag" style={{ marginBottom: 22 }}>
              <span className="dot"></span> {t.hero_tag}
            </div>

            <h1 style={{ marginBottom: 22 }}>
              {t.hero_h1_a} <span className="hl">{t.hero_h1_hl}</span>{t.hero_h1_b}<br />
              {t.hero_h1_c}
            </h1>

            <p style={{ fontSize: 20, lineHeight: 1.4, color: "var(--ink)", marginBottom: 32, fontWeight: 500, maxWidth: 560 }}>
              {t.hero_p[0]}<strong>{t.hero_p[1]}</strong>{t.hero_p[2]}
            </p>

            <EmailForm t={t} ctaLabel={t.hero_cta} onSubmit={onSubmit} />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 22 }}>
              <span className="pill" style={{ background: "var(--c-pink)" }}>{t.hero_pills[0]}</span>
              <span className="pill" style={{ background: "var(--c-mint)" }}>{t.hero_pills[1]}</span>
              <span className="pill" style={{ background: "var(--c-yellow)" }}>{t.hero_pills[2]}</span>
            </div>
          </div>

          <DeckMockup t={t} />
        </div>
      </div>
    </section>);
}

function DeckMockup({ t }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    // Don't auto-animate the card for users who prefer reduced motion.
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setFlipped((f) => !f), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 440, justifySelf: "center", aspectRatio: "5/6", margin: "0 auto" }}>
      <div className="tape" style={{ top: -8, left: 30, transform: "rotate(-9deg)" }}></div>
      <div className="tape" style={{ top: -10, right: 40, background: "color-mix(in oklab, var(--c-pink) 95%, transparent)", transform: "rotate(7deg)" }}></div>

      <div style={{ position: "absolute", inset: "8% -4% 0 12%", background: "var(--c-yellow)", border: "2.5px solid var(--line)", boxShadow: "5px 5px 0 0 var(--shadow)", borderRadius: 18 }}></div>
      <div style={{ position: "absolute", inset: "4% 4% 4% 4%", background: "var(--c-lilac)", border: "2.5px solid var(--line)", boxShadow: "5px 5px 0 0 var(--shadow)", borderRadius: 18 }}></div>

      <div style={{
        position: "absolute", inset: "0 14% 8% 0",
        background: "var(--card)",
        border: "2.5px solid var(--line)", boxShadow: "8px 8px 0 0 var(--shadow)",
        borderRadius: 20, padding: 24,
        display: "flex", flexDirection: "column",
        transition: "transform 400ms cubic-bezier(.7,-0.2,.3,1.4)",
        transform: flipped ? "rotate(-1deg)" : "rotate(1deg)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span className="pill" style={{ background: "var(--c-mint)" }}>{t.card_subject}</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>4 / 18</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", padding: "10px 6px" }}>
          {!flipped ?
          <>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>{t.card_q_label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                {t.card_question[0]}<br />{t.card_question[1]}
              </div>
            </> :
          <>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--c-blue)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>{t.card_a_label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--ink)" }}>{t.card_answer}</div>
              <div style={{ marginTop: 10, fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>{t.card_answer_sub}</div>
            </>
          }
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[
          { label: t.card_rating[0], bg: "var(--c-orange)" },
          { label: t.card_rating[1], bg: "var(--c-yellow)" },
          { label: t.card_rating[2], bg: "var(--c-mint)" }
          ].map((b) =>
          <div key={b.label} style={{
            flex: 1, padding: "10px 0", textAlign: "center",
            border: "2px solid var(--line)", borderRadius: 10,
            background: b.bg, fontWeight: 800, fontSize: 13,
            boxShadow: "2px 2px 0 0 var(--shadow)"
          }}>{b.label}</div>
          )}
        </div>
      </div>

      <div className="nb-sm" style={{
        position: "absolute", bottom: -10, left: -10,
        padding: "10px 14px", background: "var(--accent)", color: "var(--accent-ink)",
        transform: "rotate(-4deg)", display: "flex", alignItems: "center", gap: 8
      }}>
        <Flame size={18} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1 }}>{t.streak_n}</div>
          <div style={{ fontSize: 10, color: "#DCE3FB", fontWeight: 600 }}>{t.streak_label}</div>
        </div>
      </div>
    </div>);
}

// ──────────────────────────────────────────────────────────────────
// Pains
// ──────────────────────────────────────────────────────────────────
function Dores({ t }) {
  const icons = [<Skull />, <Bolt />, <Pixel />];
  const colors = ["var(--c-orange)", "var(--c-yellow)", "var(--c-mint)"];

  return (
    <section id="dores" style={{ padding: "60px 0" }}>
      <div className="wrap">
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ maxWidth: 720 }}>{t.pains_h2}</h2>
        </div>

        <div className="grid-3">
          {t.pains.map((p, i) =>
          <article key={i} className="nb pain-card nb-press">
              <div className="pain-icon" style={{ background: colors[i], color: "var(--ink)" }}>{icons[i]}</div>
              <h3>{p.title}</h3>
              <p style={{ color: "var(--ink)" }}>{p.body}</p>
              <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "2px dashed color-mix(in oklab, var(--ink) 20%, transparent)" }}>
                <p style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic", lineHeight: 1.45 }}>{p.quote}</p>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>);
}

// ──────────────────────────────────────────────────────────────────
// How
// ──────────────────────────────────────────────────────────────────
function Como({ t }) {
  const mocks = [<ImportMock t={t} />, <RhythmMock t={t} />, <ProgressMock t={t} />];
  return (
    <section id="como" style={{ padding: "60px 0", background: "color-mix(in oklab, var(--c-lilac) 50%, var(--bg))", borderTop: "2px solid var(--line)", borderBottom: "2px solid var(--line)" }}>
      <div className="wrap">
        <div style={{ marginBottom: 44 }}>
          <h2 style={{ maxWidth: 720 }}>{t.how_h2}</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {t.steps.map((s, i) =>
          <div key={i} className="grid-2" style={{ alignItems: "center" }}>
              <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
                <div className="step-num">{i + 1}</div>
                <div>
                  <h3 style={{ fontSize: 26, marginBottom: 10, letterSpacing: "-0.02em" }}>{s.title}</h3>
                  <p style={{ fontSize: 17, color: "var(--ink)", maxWidth: 460 }}>{s.body}</p>
                </div>
              </div>
              <div>{mocks[i]}</div>
            </div>
          )}
        </div>
      </div>
    </section>);
}

function ImportMock({ t }) {
  return (
    <div className="nb" style={{ padding: 20, background: "var(--card)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.import_label}</span>
        <span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>medicine_p1.apkg</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, background: "var(--c-pink)", border: "2px solid var(--line)", borderRadius: 8, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 11 }}>.APKG</div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 10, border: "2px solid var(--line)", borderRadius: 6, overflow: "hidden", background: "var(--bg)" }}>
            <div style={{ height: "100%", width: "76%", background: "var(--accent)" }}></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
            <span>{t.import_cards}</span>
            <span>00:23</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {t.import_topics.map((tg) => <span key={tg} className="pill" style={{ background: "var(--bg)" }}>{tg}</span>)}
      </div>
    </div>);
}

function RhythmMock({ t }) {
  const days = [4, 7, 0, 6, 5, 0, 3];
  return (
    <div className="nb" style={{ padding: 20, background: "var(--card)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <span style={{ fontWeight: 800, fontSize: 17 }}>{t.rhythm_title}</span>
        <span className="pill" style={{ background: "var(--c-mint)" }}>
          <Check /> {t.rhythm_pill}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, alignItems: "flex-end", height: 110 }}>
        {days.map((d, i) =>
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
            width: "100%", height: d ? `${20 + d * 10}px` : 8,
            background: d === 0 ? "var(--bg)" : "var(--accent)",
            border: "2px solid var(--line)", borderRadius: 6,
            boxShadow: d ? "2px 2px 0 0 var(--shadow)" : "none"
          }}></div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>{t.rhythm_days[i]}</span>
          </div>
        )}
      </div>
      <p style={{ marginTop: 14, fontSize: 12, color: "var(--muted)" }}>{t.rhythm_caption}</p>
    </div>);
}

function ProgressMock({ t }) {
  const colors = ["var(--c-mint)", "var(--c-yellow)", "var(--c-orange)"];
  return (
    <div className="nb" style={{ padding: 20, background: "var(--card)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontWeight: 800, fontSize: 17 }}>{t.progress_title}</span>
        <span className="mono" style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{t.progress_range}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {t.progress_topics.map((tp, i) =>
        <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{tp.name}</span>
              <span className="mono" style={{ fontWeight: 700, fontSize: 13 }}>{tp.v}%</span>
            </div>
            <div style={{ height: 14, border: "2px solid var(--line)", borderRadius: 6, overflow: "hidden", background: "var(--bg)" }}>
              <div style={{ height: "100%", width: tp.v + "%", background: colors[i], borderRight: "2px solid var(--line)" }}></div>
            </div>
          </div>
        )}
      </div>
    </div>);
}

// ──────────────────────────────────────────────────────────────────
// Social proof
// ──────────────────────────────────────────────────────────────────
function Prova({ t }) {
  const colors = ["var(--c-yellow)", "var(--c-mint)", "var(--c-pink)"];
  return (
    <section id="prova" style={{ padding: "70px 0" }}>
      <div className="wrap">
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ maxWidth: 760 }}>{t.stats_h2}</h2>
        </div>

        <div className="grid-3">
          {t.stats.map((s, i) =>
          <article key={i} className="nb stat-card nb-press" style={{ background: colors[i] }}>
              <div className="stat-num">{s.big}</div>
              <p style={{ fontSize: 16, fontWeight: 700, marginTop: 14, lineHeight: 1.35, maxWidth: 280 }}>{s.label}</p>
              <p style={{ fontSize: 12, color: "rgba(24,25,31,0.82)", marginTop: 10, fontWeight: 600, fontFamily: "JetBrains Mono" }}>{s.sub}</p>
            </article>
          )}
        </div>
      </div>
    </section>);
}

// ──────────────────────────────────────────────────────────────────
// Final CTA
// ──────────────────────────────────────────────────────────────────
function CTA({ t, onSubmit }) {
  return (
    <section id="cta" style={{ padding: "70px 0" }}>
      <div className="wrap">
        <div className="nb-lg" style={{ padding: "56px 40px", background: "var(--accent)", color: "var(--accent-ink)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 18, left: 22, opacity: 0.6 }}><Sparkle /></div>
          <div style={{ position: "absolute", bottom: 22, right: 28, opacity: 0.6 }}><Sparkle size={22} /></div>

          <h2 style={{ marginBottom: 14, fontSize: "clamp(28px, 4.4vw, 52px)" }}>{t.cta_h2}</h2>
          <p style={{ fontSize: 18, maxWidth: 540, margin: "0 auto 30px", opacity: 0.85, fontWeight: 500 }}>{t.cta_p}</p>

          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div className="nb" style={{ padding: 20, background: "var(--card)", color: "var(--ink)" }}>
              <EmailForm t={t} ctaLabel={t.cta_btn} compact onSubmit={onSubmit} />
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 8 }}>
                <span className="check" aria-hidden><Check /></span>
                {t.cta_nospam}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", fontSize: 12, fontWeight: 700 }}>
            {t.cta_dots.map((d, i) => <span key={i} style={{ opacity: 0.85 }}>{d}</span>)}
          </div>
        </div>
      </div>
    </section>);
}

// ──────────────────────────────────────────────────────────────────
// Marquee + Footer
// ──────────────────────────────────────────────────────────────────
function Marquee({ t }) {
  const row = [...t.marquee, ...t.marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((m, i) => <span key={i}>{m} <span className="sep"></span></span>)}
      </div>
    </div>);
}

function Footer() {
  return (
    <footer style={{ padding: "40px 0 60px", borderTop: "2px dashed color-mix(in oklab, var(--ink) 25%, transparent)" }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div className="wordmark" style={{ fontSize: 22 }}>
            <span className="mark" style={{ width: 26, height: 26, fontSize: 14, borderRadius: 6 }}>N</span>
            Nian
          </div>
        </div>
      </div>
    </footer>);
}

// ──────────────────────────────────────────────────────────────────
// App
// ──────────────────────────────────────────────────────────────────
function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("nian-lang") || "pt"; } catch { return "pt"; }
  });
  const [toast, setToast] = useState(null);
  const t = COPY[lang] || COPY.pt;

  useEffect(() => {
    try { localStorage.setItem("nian-lang", lang); } catch {}
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;

    // Keep title and SEO/social meta tags in sync with the active language.
    const metaByLang = {
      pt: {
        title: "Nian — flashcards sem a interface dos anos 90",
        desc: "Flashcards com repetição espaçada, sem a interface dos anos 90 e sem te punir por faltar um dia. Importa do Anki em 30s."
      },
      en: {
        title: "Nian — flashcards without the 90s interface",
        desc: "Spaced repetition flashcards, without the 90s interface and without punishing you for missing a day. Imports from Anki in 30s."
      },
      es: {
        title: "Nian — flashcards sin la interfaz de los 90",
        desc: "Flashcards con repetición espaciada, sin la interfaz de los 90 y sin castigarte por faltar un día. Importa desde Anki en 30s."
      }
    };
    const meta = metaByLang[lang] || metaByLang.pt;

    document.title = meta.title;

    const setMeta = (selector, value) => {
      const el = document.head.querySelector(selector);
      if (el && value) el.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', meta.desc);
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.desc);
    setMeta('meta[name="twitter:title"]', meta.title);
    setMeta('meta[name="twitter:description"]', meta.desc);
  }, [lang]);

  const onSubmit = (email) => {
    setToast(`✓ ${email} ${t.toast_added}`);
    setTimeout(() => setToast(null), 3200);
  };

  return (
    <>
      <main>
        <Hero t={t} onSubmit={onSubmit} lang={lang} setLang={setLang} />
        <Marquee t={t} />
        <Dores t={t} />
        <Como t={t} />
        <Prova t={t} />
        <CTA t={t} onSubmit={onSubmit} />
      </main>
      <Footer />

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </>);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
