/* Ridesafe site script: menus, search, licence finder, live opening hours. No dependencies. */
(() => {
  'use strict';
  const CFG = __CONFIG__;
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wa = (text) => `${CFG.wa}?text=${encodeURIComponent(text)}`;
  const indexUrl = document.currentScript && document.currentScript.dataset.index;

  const svg = (paths) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const I = {
    bike: svg('<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>'),
    file: svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>'),
    info: svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
    phone: svg('<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>'),
    message: svg('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'),
    mail: svg('<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>'),
    pin: svg('<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>'),
    calendar: svg('<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>'),
    quote: svg('<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>'),
    compass: svg('<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>'),
    external: svg('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),
    arrow: svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
  };

  // ---------------- theme ----------------
  const themeQuery = matchMedia('(prefers-color-scheme: dark)');
  const syncThemeLabels = () => {
    const dark = root.dataset.theme === 'dark';
    $$('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme'));
  };
  themeQuery.addEventListener?.('change', (e) => {
    let stored = null;
    try { stored = localStorage.getItem('theme'); } catch { /* private mode */ }
    if (!stored) { root.dataset.theme = e.matches ? 'dark' : 'light'; syncThemeLabels(); }
  });
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-theme-toggle]');
    if (!t) return;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* ignore */ }
    syncThemeLabels();
  });
  syncThemeLabels();

  // ---------------- dialogs ----------------
  const menu = $('#menu');
  const search = $('#search');
  const openDialog = (d) => { if (d && !d.open) d.showModal(); };
  const closeDialog = (d) => { if (d && d.open) d.close(); };
  for (const d of [menu, search]) {
    if (!d) continue;
    d.addEventListener('click', (e) => {
      if (e.target === d || e.target.closest('[data-close]')) closeDialog(d);
    });
  }
  const menuBtn = $('[data-open-menu]');
  menuBtn?.addEventListener('click', () => { openDialog(menu); menuBtn.setAttribute('aria-expanded', 'true'); });
  menu?.addEventListener('close', () => menuBtn?.setAttribute('aria-expanded', 'false'));

  // Links to an anchor on the current page should close whatever overlay they sit in.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const url = new URL(a.href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
      closeDialog(menu);
      closeDialog(search);
      closeMega();
      setTimeout(() => reveal(url.hash), 0);
    }
  });

  // ---------------- mega menu ----------------
  const megaBtn = $('.has-mega button');
  const mega = $('#courses-menu');
  const megaItem = $('.has-mega');
  let megaTimer;
  function openMega() { clearTimeout(megaTimer); if (!mega) return; mega.hidden = false; megaBtn.setAttribute('aria-expanded', 'true'); }
  function closeMega() { clearTimeout(megaTimer); if (!mega || mega.hidden) return; mega.hidden = true; megaBtn.setAttribute('aria-expanded', 'false'); }
  if (megaBtn && mega) {
    megaBtn.addEventListener('click', () => (mega.hidden ? openMega() : closeMega()));
    if (matchMedia('(hover: hover)').matches) {
      megaItem.addEventListener('mouseenter', () => { clearTimeout(megaTimer); megaTimer = setTimeout(openMega, 60); });
      megaItem.addEventListener('mouseleave', () => { clearTimeout(megaTimer); megaTimer = setTimeout(closeMega, 220); });
    }
    megaItem.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mega.hidden) { closeMega(); megaBtn.focus(); }
    });
    megaItem.addEventListener('focusout', (e) => { if (!megaItem.contains(e.relatedTarget)) closeMega(); });
    document.addEventListener('click', (e) => { if (!megaItem.contains(e.target)) closeMega(); });
  }

  // ---------------- hash targets: open FAQ answers, flash the target ----------------
  function reveal(hash) {
    if (!hash || hash.length < 2) return;
    let el;
    try { el = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (!el) return;
    if (el.tagName === 'DETAILS') el.open = true;
    const target = el.querySelector(':scope > figure') || el;
    target.classList.remove('flash');
    void target.offsetWidth;
    target.classList.add('flash');
    setTimeout(() => target.classList.remove('flash'), 2000);
  }
  window.addEventListener('hashchange', () => reveal(location.hash));
  if (location.hash) reveal(location.hash);

  // ---------------- opening hours ----------------
  const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const fmtHour = (h) => (h === 12 ? '12pm' : h > 12 ? `${h - 12}pm` : `${h}am`);
  function londonNow() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    return { day: DAY.indexOf(get('weekday')), mins: (+get('hour') % 24) * 60 + +get('minute') };
  }
  function hoursState() {
    const { days, open, close } = CFG.hours;
    const { day, mins } = londonNow();
    if (days.includes(day) && mins >= open * 60 && mins < close * 60) return { open: true, text: `Open now · until ${fmtHour(close)}` };
    if (days.includes(day) && mins < open * 60) return { open: false, text: `Closed · opens ${fmtHour(open)} today` };
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      if (days.includes(d)) return { open: false, text: `Closed · opens ${i === 1 ? 'tomorrow' : DAY[d]} ${fmtHour(open)}` };
    }
    return { open: false, text: 'Closed' };
  }
  function paintHours() {
    const s = hoursState();
    $$('[data-open-status]').forEach((el) => {
      el.classList.toggle('is-open', s.open);
      el.classList.toggle('is-closed', !s.open);
      $('.status__text', el).textContent = s.text;
    });
    const today = londonNow().day;
    $$('.hours tr[data-day]').forEach((tr) => tr.classList.toggle('is-today', +tr.dataset.day === today));
  }
  paintHours();
  setInterval(paintHours, 60000);

  // ---------------- licence finder ----------------
  const COURSE = {
    cbt: ['CBT', '/training/cbt/'], a1: ['A1 licence', '/training/a1/'], a2: ['A2 licence', '/training/a2/'],
    das: ['DAS (Direct Access)', '/training/das/'], 'progressive-access': ['Progressive access', '/training/progressive-access/'],
    refresher: ['Refresher course', '/training/refresher/'],
  };
  const AGE = { 16: '16', 17: '17 or 18', 19: '19 or 20', 21: '21 to 23', 24: '24 or over' };
  const HOLD = { none: 'don’t have a motorcycle licence yet', cbt: 'have a CBT certificate', a1: 'have an A1 licence', a2: 'have an A2 licence', a: 'have a full A licence' };
  const needsYears = (age, hold) => (hold === 'a1' && age >= 19) || (hold === 'a2' && age >= 21);

  function recommend(age, hold, years) {
    const r = (course, title, text, path, next) => ({ course, title, text, path, next });
    if (hold === 'a') return r('refresher', 'A refresher course', 'You already hold a full licence, so there’s no test to take. A refresher gives you tailored coaching to sharpen up or rebuild your confidence.', [['Full A', 1], ['Refresher', 0]]);
    if (hold === 'none' || hold === 'cbt') {
      const done = hold === 'cbt';
      if (age === 16) {
        return done
          ? r('a1', 'You’re set for mopeds', 'Your CBT covers a moped up to 50cc on L-plates. When you turn 17 you can ride a 125cc and go for your A1 licence.', [['CBT', 1], ['A1 at 17', 0]])
          : r('cbt', 'Start with your CBT', 'At 16 you can do your CBT and ride a moped up to 50cc on L-plates. From 17 you can ride a 125cc and go for your A1 licence.', [['CBT', 0], ['A1 at 17', 0]]);
      }
      const target = age >= 24 ? 'das' : age >= 19 ? 'a2' : 'a1';
      const what = { a1: 'a full 125cc licence: no L-plates and passengers allowed', a2: 'an A2 licence: bikes up to 35 kW (47 bhp)', das: 'the full A licence with Direct Access: any bike, no restrictions' }[target];
      const extra = age === 21 ? ' At 24 you could go straight to the full A licence instead.' : '';
      return done
        ? r(target, COURSE[target][0], `With your CBT done, take the motorcycle theory test, then Mod 1 and Mod 2 for ${what}.${extra}`, [['CBT', 1], ['Theory test', 0], [COURSE[target][0].replace(' licence', ''), 0]])
        : r('cbt', `Start with your CBT, then ${COURSE[target][0].replace(' licence', '').replace(' (Direct Access)', '')}`, `Your CBT comes first and gets you riding on L-plates. Then pass the theory test and Mod 1 and Mod 2 for ${what}.${extra}`, [['CBT', 0], ['Theory test', 0], [COURSE[target][0].replace(' licence', '').replace(' (Direct Access)', ''), 0]], target);
    }
    if (hold === 'a1') {
      if (age < 19) return r('a2', 'Build experience on your A1', 'You can ride any 125cc with no L-plates. From 19 you can step up to A2, or after two years on A1 upgrade by progressive access with no theory test.', [['A1', 1], ['A2 from 19', 0]]);
      if (years === 'yes') return r('progressive-access', 'Progressive access to A2', `You’ve held A1 for two years, so you can upgrade to A2 with just Mod 1 and Mod 2. No theory test.${age >= 24 ? ' At 24 or over you could also go straight to the full A licence with DAS.' : ''}`, [['A1', 1], ['Mod 1 + Mod 2', 0], ['A2', 0]]);
      if (age >= 24) return r('das', 'DAS (Direct Access)', 'At 24 or over you can skip A2 and go straight to the full A licence. You’ll need the theory test, then Mod 1 and Mod 2 on a bigger bike.', [['A1', 1], ['Theory test', 0], ['Full A', 0]]);
      return r('a2', 'A2 licence', 'You can take the A2 tests now: theory test, then Mod 1 and Mod 2. Or wait until you’ve held A1 for two years and upgrade with no theory test.', [['A1', 1], ['Theory test', 0], ['A2', 0]]);
    }
    // hold === 'a2'
    if (age >= 21 && years === 'yes') return r('progressive-access', 'Progressive access to full A', 'You’ve held A2 for two years, so you can upgrade to the full A licence with Mod 1 and Mod 2 on a bigger bike. No theory test.', [['A2', 1], ['Mod 1 + Mod 2', 0], ['Full A', 0]]);
    if (age >= 24) return r('das', 'DAS (Direct Access)', 'At 24 or over you can upgrade to the full A licence through Direct Access now, without waiting for two years on A2.', [['A2', 1], ['Mod 1 + Mod 2', 0], ['Full A', 0]]);
    return r('refresher', 'Enjoy your A2 for now', 'After two years on A2, and from age 21, you can upgrade to the full A licence by progressive access with no theory test. A refresher session is a great way to build skills in the meantime.', [['A2', 1], ['Full A after 2 years', 0]]);
  }

  $$('[data-finder]').forEach((form) => {
    const out = $('[data-result]', form);
    const yearsSet = $('[data-years]', form);
    const placeholder = out.innerHTML;
    const val = (n) => form.elements[n] && form.elements[n].value;
    function update() {
      const age = +val('age') || 0;
      const hold = val('hold');
      // Rule out licences that aren't possible at the chosen age.
      const minAge = { a1: 17, a2: 19, a: 21 };
      $$('input[name="hold"]', form).forEach((inp) => {
        const bad = age && minAge[inp.value] && age < minAge[inp.value];
        inp.disabled = !!bad;
        if (bad && inp.checked) inp.checked = false;
      });
      const holdNow = val('hold');
      const showYears = age && holdNow && needsYears(age, holdNow);
      yearsSet.hidden = !showYears;
      if (showYears) $('legend', yearsSet).lastChild.textContent = `Have you held your ${holdNow.toUpperCase()} licence for two years or more?`;
      const years = showYears ? val('years') : '';
      if (!age || !holdNow || (showYears && !years)) {
        out.innerHTML = !age || !holdNow ? placeholder : `<p class="finder__placeholder">${I.compass}One more question: how long have you held your licence?</p>`;
        return;
      }
      const rec = recommend(age, holdNow, years);
      const [cname, curl] = COURSE[rec.course];
      const bookFirst = rec.course === 'cbt' && holdNow === 'none';
      const msg = `Hi Ridesafe, I’m ${AGE[age]} and ${HOLD[holdNow]}${showYears ? (years === 'yes' ? ' (held for two years or more)' : ' (held for less than two years)') : ''}. Your licence finder suggested: ${rec.title}. Can you tell me about dates and prices?`;
      const primary = bookFirst
        ? `<a class="btn btn--primary" href="${CFG.cbt}">${I.calendar}Book a CBT online<span class="sr-only"> (opens our booking system)</span></a>`
        : `<a class="btn btn--wa" href="${wa(msg)}">${I.message}Ask us on WhatsApp</a>`;
      const nextCourse = rec.next && COURSE[rec.next];
      const secondary = bookFirst
        ? (nextCourse
          ? `<a class="btn btn--ghost" href="${nextCourse[1]}">About ${esc(nextCourse[0])}${I.arrow}</a>`
          : `<a class="btn btn--ghost" href="${wa(msg)}">${I.message}Ask a question</a>`)
        : `<a class="btn btn--ghost" href="${curl}">About ${esc(cname)}${I.arrow}</a>`;
      const firstTodo = rec.path.findIndex(([, done]) => !done);
      out.innerHTML = `
        <p class="rec__label">Recommended for you</p>
        <h3 class="rec__title">${esc(rec.title)}</h3>
        <p class="rec__text">${esc(rec.text)}</p>
        <ol class="rec__steps" aria-label="Your route">${rec.path.map(([t, done], i) => `<li class="${done ? 'is-done' : i === firstTodo ? 'is-now' : ''}"><span>${done ? '✓ ' : ''}${esc(t)}${done ? '<span class="sr-only"> (done)</span>' : ''}</span></li>`).join('')}</ol>
        <div class="btn-row">${primary}${secondary}</div>
        ${bookFirst ? `<p class="muted" style="margin-top:12px">${esc(CFG.price)} standard day · <a href="${curl}">What happens on a CBT</a></p>` : ''}`;
      out.classList.remove('is-fresh');
      void out.offsetWidth;
      out.classList.add('is-fresh');
    }
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => e.preventDefault());
    update();
  });

  // ---------------- reviews filter ----------------
  const reviewList = $('[data-reviews]');
  if (reviewList) {
    const status = $('[data-reviews-status]');
    $$('[data-filter]').forEach((btn) => btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      $$('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      let n = 0;
      $$('.review', reviewList).forEach((li) => {
        const show = f === 'all' || li.dataset.tags.split(' ').includes(f);
        li.hidden = !show;
        if (show) n++;
      });
      status.textContent = `Showing ${n} review${n === 1 ? '' : 's'}`;
    }));
  }

  // ---------------- find us: map + copy address ----------------
  $$('.map[data-map]').forEach((map) => {
    const btn = $('.map__load', map);
    btn?.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = map.dataset.map;
      f.title = 'Interactive map showing Ridesafe Motorcycle School';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.allowFullscreen = true;
      map.appendChild(f);
      map.classList.add('is-live');
      f.focus();
    });
  });
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try { await navigator.clipboard.writeText(text); } catch {
      const t = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
    }
    const old = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => { btn.textContent = old; }, 1800);
  }));

  // ---------------- book page enquiry picker ----------------
  const enquire = $('#enquire-course');
  if (enquire) {
    const sync = () => {
      const v = enquire.value;
      const text = v === 'training' ? 'Hi Ridesafe, I’d like some help choosing a course.' : `Hi Ridesafe, I’m interested in ${v}. What dates do you have?`;
      $('[data-enquire-wa]').href = wa(text);
      $('[data-enquire-mail]').href = `mailto:${CFG.email}?subject=${encodeURIComponent(v === 'training' ? 'Training enquiry' : `${v} enquiry`)}`;
    };
    enquire.addEventListener('change', sync);
    sync();
  }

  // ---------------- course page: highlight the section in view ----------------
  const tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(tocLinks.map((a) => [a.hash.slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        tocLinks.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(en.target.id)?.setAttribute('aria-current', 'true');
      }
    }, { rootMargin: '-25% 0px -65% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  // ================= search =================
  const input = $('#search-input');
  const list = $('#search-results');
  const hint = $('#search-hint');
  const live = $('#search-status');
  let INDEX = null;
  let loading = null;
  let results = [];
  let active = -1;

  const TYPE_W = { a: 1.15, c: 1.25, p: 1, s: 0.95, f: 1, r: 0.55 };
  const STOP = new Set('the a an to of for and or do i my me is are can what how you your with on in at it be does we our im get about there any if need want will would should this that from by'.split(' '));
  const GROUPS = [
    'motorbike motorcycle bike motorbikes motorcycles bikes',
    'price prices cost costs fee fees pricing',
    'hours opening open times time',
    'phone call telephone number ring',
    'address location postcode where directions map',
    'passenger passengers pillion',
    'licence licences',
    'whatsapp message text chat',
    'test tests exam',
    'helmet kit gear clothing jacket gloves',
    'beginner beginners new learner learners first start',
    'refresher returning return confidence',
    'book booking reserve',
  ].map((g) => g.split(' '));
  const SYN = new Map();
  for (const g of GROUPS) for (const w of g) SYN.set(w, g.filter((x) => x !== w));

  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/['’]/g, '')
      .replace(/\blicen[cs]e/g, 'licence')
      .replace(/\bmodule\b/g, 'mod')
      .replace(/\bmod(\d)/g, 'mod $1')
      .replace(/\bl-?plates?\b/g, 'l plates')
      .replace(/(\d+)\s*(cc|kw|bhp)\b/g, '$1$2')
      .replace(/\bwhats app\b/g, 'whatsapp')
      .replace(/[^a-z0-9£]+/g, ' ')
      .trim();
  }
  const words = (s) => [...new Set(norm(s).split(' ').filter(Boolean))];

  // Optimal string alignment distance, bailing out once it exceeds max.
  function within(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return false;
    const m = a.length, n = b.length;
    let prev2 = null, prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      let rowMin = i;
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
        cur[j] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return false;
      prev2 = prev; prev = cur;
    }
    return prev[n] <= max;
  }

  // fuzzy: allow typo matches. Only used for words that match nothing directly, so exact hits always win.
  function tokScore(q, ws, minPrefix, fuzzy) {
    let best = 0;
    for (const w of ws) {
      if (w === q) return 1;
      if (q.length >= minPrefix && w.startsWith(q)) best = Math.max(best, 0.82 - Math.min(0.22, (w.length - q.length) * 0.03));
      else if (w.length >= 4 && q.startsWith(w) && q.length - w.length <= 2) best = Math.max(best, 0.72);
      else if (fuzzy && best < 0.5 && q.length >= 4 && !/\d/.test(q) && within(q, w, q.length >= 8 ? 2 : 1)) best = 0.5;
    }
    return best;
  }
  const fuzzyCache = new Map();
  function needsFuzzy(t) {
    if (!fuzzyCache.has(t)) {
      fuzzyCache.set(t, !INDEX.some((e) => tokScore(t, e.tw, 1) || tokScore(t, e.kw, 1) || tokScore(t, e.bw, 3)));
    }
    return fuzzyCache.get(t);
  }

  function prepare(raw) {
    return raw.map((e) => ({
      ...e,
      tw: words(e.t), kw: words(`${e.k} ${e.c}`), bw: words(e.b),
      nt: norm(e.t), nb: norm(e.b),
    }));
  }

  function loadIndex() {
    if (INDEX || loading || !indexUrl) return loading;
    loading = fetch(indexUrl).then((r) => r.json()).then((raw) => { INDEX = prepare(raw); return INDEX; }).catch(() => { loading = null; });
    return loading;
  }

  function query(q) {
    const nq = norm(q);
    let toks = nq.split(' ').filter(Boolean);
    const content = toks.filter((t) => !STOP.has(t));
    if (content.length) toks = content;
    if (!toks.length) return { exact: true, items: [] };
    const scored = [];
    for (const e of INDEX) {
      let total = 0, hits = 0;
      for (const t of toks) {
        const fz = needsFuzzy(t);
        let s = Math.max(10 * tokScore(t, e.tw, 1, fz), 6 * tokScore(t, e.kw, 1, fz), 2 * tokScore(t, e.bw, 3, fz));
        // Synonyms only count as whole words, so "cost" finds "price" but not "feel" via "fee".
        for (const a of SYN.get(t) || []) {
          s = Math.max(s, 0.85 * Math.max(e.tw.includes(a) ? 10 : 0, e.kw.includes(a) ? 6 : 0, e.bw.includes(a) ? 2 : 0));
        }
        if (s > 0) hits++;
        total += s;
      }
      if (!hits) continue;
      if (nq.length > 2) {
        if (e.nt.startsWith(nq)) total += 12;
        else if (e.nt.includes(nq)) total += 8;
        else if (toks.length > 1 && e.nb.includes(nq)) total += 4;
      }
      total *= TYPE_W[e.y] || 1;
      scored.push({ e, total, all: hits === toks.length, hits });
    }
    const exact = scored.filter((s) => s.all);
    const pool = exact.length ? exact : scored.sort((a, b) => b.hits - a.hits || b.total - a.total).slice(0, 8);
    pool.sort((a, b) => b.total - a.total || a.e.t.length - b.e.t.length);
    // One result per URL keeps the list tidy.
    const seen = new Set();
    const items = [];
    for (const s of pool) { if (seen.has(s.e.u)) continue; seen.add(s.e.u); items.push(s.e); if (items.length >= 12) break; }
    return { exact: !!exact.length, items, toks };
  }

  function highlight(text, toks) {
    if (!toks || !toks.length) return esc(text);
    const re = new RegExp(`(^|[^a-z0-9])(${toks.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})([a-z0-9]*)`, 'gi');
    let out = '', last = 0, m;
    while ((m = re.exec(text))) {
      const start = m.index + m[1].length;
      out += esc(text.slice(last, start)) + `<mark>${esc(m[2] + m[3])}</mark>`;
      last = start + m[2].length + m[3].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    return out + esc(text.slice(last));
  }

  function snippet(text, toks) {
    if (!toks || !toks.length) return text.length > 130 ? `${text.slice(0, 128)}…` : text;
    const re = new RegExp(`(^|[^a-z0-9])(${toks.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'i');
    const m = re.exec(text);
    if (!m || m.index < 60) return text.length > 150 ? `${text.slice(0, 148)}…` : text;
    const start = text.lastIndexOf(' ', m.index - 40) + 1;
    const s = text.slice(start, start + 150);
    return `…${s}${start + 150 < text.length ? '…' : ''}`;
  }

  function iconFor(e) {
    if (e.y === 'c') return I.bike;
    if (e.y === 's') return I.file;
    if (e.y === 'f') return I.info;
    if (e.y === 'r') return I.quote;
    if (e.u.startsWith('tel:')) return I.phone;
    if (e.u.includes('wa.me')) return I.message;
    if (e.u.startsWith('mailto:')) return I.mail;
    if (e.u.includes('google.com/maps') || e.u.includes('find-us')) return I.pin;
    if (e.u.includes('bookcbtnow') || e.u.includes('/book/')) return I.calendar;
    if (/^https?:/.test(e.u)) return I.external;
    return I.compass;
  }

  const SUGGEST = ['Book a CBT online', 'Which licence do I need?', 'What to bring', 'Opening hours', 'How much does a CBT cost?', 'Get directions', 'Message us on WhatsApp', 'Compare courses'];

  function render(q) {
    if (!INDEX) { hint.textContent = 'Loading…'; list.innerHTML = ''; return; }
    let items, toks, exact = true;
    if (!q.trim()) {
      items = SUGGEST.map((t) => INDEX.find((e) => e.t === t && (t !== 'What to bring' || e.c === 'CBT'))).filter(Boolean);
      hint.textContent = 'Popular';
    } else {
      ({ items, toks, exact } = query(q));
      hint.textContent = items.length ? (exact ? '' : 'No exact match. Closest results') : '';
    }
    results = items;
    active = items.length ? 0 : -1;
    if (!items.length) {
      list.innerHTML = `<li class="search__empty" role="presentation"><p>No results for <strong>“${esc(q.trim())}”</strong>.</p><p>Try “CBT”, “A2” or “opening hours”, or <a href="${wa(`Hi Ridesafe, I was looking for: ${q.trim()}`)}">ask us on WhatsApp</a>.</p></li>`;
      input.removeAttribute('aria-activedescendant');
      live.textContent = 'No results';
      return;
    }
    list.innerHTML = items.map((e, i) => `
      <li class="sr" role="option" id="sr-${i}" aria-selected="${i === active}">
        <a href="${esc(e.u)}" tabindex="-1">
          <span class="sr__icon">${iconFor(e)}</span>
          <span class="sr__title">${highlight(e.t, toks)}</span>
          <span class="sr__type">${esc(e.c)}</span>
          <span class="sr__snip">${highlight(snippet(e.b, toks), toks)}</span>
        </a>
      </li>`).join('');
    input.setAttribute('aria-activedescendant', 'sr-0');
    live.textContent = `${items.length} result${items.length === 1 ? '' : 's'}`;
  }

  function setActive(i) {
    if (!results.length) return;
    active = (i + results.length) % results.length;
    $$('.sr', list).forEach((li, j) => li.setAttribute('aria-selected', String(j === active)));
    const el = $(`#sr-${active}`);
    input.setAttribute('aria-activedescendant', `sr-${active}`);
    el?.scrollIntoView({ block: 'nearest' });
  }

  function go(i) {
    const e = results[i];
    if (!e) return;
    const url = new URL(e.u, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
      closeDialog(search);
      if (location.hash === url.hash) { document.querySelector(url.hash)?.scrollIntoView(); reveal(url.hash); } else location.hash = url.hash;
      return;
    }
    location.href = e.u;
  }

  function openSearch(prefill) {
    if (!search) return;
    closeDialog(menu);
    closeMega();
    openDialog(search);
    input.setAttribute('aria-expanded', 'true');
    if (typeof prefill === 'string') input.value = prefill;
    input.focus();
    input.select();
    render(input.value);
    loadIndex()?.then(() => render(input.value));
  }

  if (search && input) {
    $$('[data-open-search]').forEach((b) => {
      b.addEventListener('click', () => openSearch());
      b.addEventListener('pointerenter', loadIndex, { once: true });
      b.addEventListener('focus', loadIndex, { once: true });
    });
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); go(active < 0 ? 0 : active); }
    });
    list.addEventListener('mousemove', (e) => {
      const li = e.target.closest('.sr');
      if (li) { const i = +li.id.slice(3); if (i !== active) setActive(i); }
    });
    search.addEventListener('close', () => input.setAttribute('aria-expanded', 'false'));
    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if ((e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        openSearch();
      }
    });
    const q = new URLSearchParams(location.search).get('q');
    if (q) openSearch(q);
    // Warm the index once the page is idle so the first search is instant.
    (window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(() => loadIndex());
  }
})();
