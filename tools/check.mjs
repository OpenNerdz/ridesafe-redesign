// End-to-end checks against a running preview: node tools/check.mjs [base=http://127.0.0.1:8702]
// Pages × viewports: script errors, images, broken internal links/anchors, duplicate ids, one h1, tap targets.
// Then behaviour: search ranking, licence finder answers, menus, reviews filter.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? `${process.env.HOME}/projects/weather-showcase/node_modules/playwright-core`);

const base = process.argv[2] ?? 'http://127.0.0.1:8702';
const PAGES = ['/', '/training/', '/training/cbt/', '/training/a1/', '/training/a2/', '/training/das/', '/training/progressive-access/', '/training/refresher/', '/book/', '/find-us/', '/reviews/', '/meet-our-friends/', '/404.html'];
const VIEWPORTS = { phone: { width: 360, height: 740 }, tablet: { width: 820, height: 1180 }, desktop: { width: 1440, height: 900 } };
let failures = 0;
const fail = (msg) => { failures++; console.log(`  FAIL ${msg}`); };
const ok = (msg) => console.log(`  ok   ${msg}`);

const browser = await chromium.launch({ executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
const newPage = async (vp, opts = {}) => {
  const mobile = vp.width < 700;
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, timezoneId: 'Europe/London', ...opts });
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && !/404 \(Not Found\)/.test(m.text()) && page.errors.push(m.text()));
  page.on('requestfailed', (r) => { if (r.url().startsWith(base)) page.errors.push(`request failed ${r.url()}`); });
  return page;
};

// ---------- static checks per page ----------
const anchorsSeen = new Map(); // path -> Set(ids)
const linksToCheck = new Set();
for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  console.log(`\n# pages @ ${vpName} ${vp.width}px`);
  for (const path of PAGES) {
    const page = await newPage(vp);
    const res = await page.goto(base + path, { waitUntil: 'networkidle' });
    if (path !== '/404.html' && res.status() !== 200) fail(`${path} status ${res.status()}`);
    // Load every lazy image so a missing file is caught wherever it sits on the page.
    await page.evaluate(() => Promise.all([...document.images].filter((i) => !i.closest('dialog')).map((i) => {
      i.loading = 'eager';
      return i.complete ? null : new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); setTimeout(r, 8000); });
    })));
    await page.waitForLoadState('networkidle');
    const r = await page.evaluate(() => {
      const visible = (el) => { const b = el.getBoundingClientRect(); const s = getComputedStyle(el); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && !el.closest('dialog:not([open]), [hidden]'); };
      const imgs = [...document.images].filter((i) => !i.closest('dialog'));
      const badImgs = imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
      const noAlt = imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.src);
      const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
      const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
      const h1 = document.querySelectorAll('h1').length;
      const links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
      // Tap targets: standalone controls should be at least 44px tall (WCAG 2.5.5 AAA) and never under 24px (2.5.8 AA).
      const small = [];
      for (const el of document.querySelectorAll('a, button, select, input:not([type=radio]), summary, label.chip')) {
        if (!visible(el) || el.closest('.sr-only')) continue;
        const inline = el.tagName === 'A' && el.closest('p, li, figcaption, td, address, dd') && !el.matches('.btn, .link-arrow, .nav__link, .mega__link, .mega__plain, .actionbar__btn, .ftr__col a, .sheet__courses a, .sheet__links a, .crumbs a, .jump a, .toc a');
        const b = el.getBoundingClientRect();
        const min = inline ? 18 : 40;
        if (b.height < min || b.width < 24) small.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(b.width)}x${Math.round(b.height)}`);
      }
      const overflow = document.documentElement.scrollWidth - innerWidth;
      return { badImgs, noAlt, dupIds, h1, links, ids, small, overflow };
    });
    const label = `${path}`;
    if (page.errors.length) fail(`${label} errors: ${page.errors.join(' | ')}`);
    if (r.badImgs.length) fail(`${label} images not loaded: ${r.badImgs.join(', ')}`);
    if (r.noAlt.length) fail(`${label} images without alt: ${r.noAlt.join(', ')}`);
    if (r.dupIds.length) fail(`${label} duplicate ids: ${r.dupIds.join(', ')}`);
    if (r.h1 !== 1) fail(`${label} has ${r.h1} h1 elements`);
    if (r.overflow > 0) fail(`${label} horizontal overflow ${r.overflow}px`);
    if (r.small.length) fail(`${label} small tap targets: ${r.small.slice(0, 6).join('; ')}${r.small.length > 6 ? ` (+${r.small.length - 6})` : ''}`);
    if (!page.errors.length && !r.badImgs.length && !r.dupIds.length && r.h1 === 1 && !r.overflow && !r.small.length) ok(label);
    anchorsSeen.set(new URL(base + path).pathname, new Set(r.ids));
    r.links.forEach((l) => linksToCheck.add(JSON.stringify([path, l])));
    await page.context().close();
  }
}

// ---------- links ----------
console.log('\n# internal links and anchors');
const statusCache = new Map();
let linkCount = 0;
for (const item of linksToCheck) {
  const [from, href] = JSON.parse(item);
  if (/^(https?:|mailto:|tel:)/.test(href) && !href.startsWith(base)) continue;
  const url = new URL(href, base + from);
  linkCount++;
  if (!statusCache.has(url.pathname)) statusCache.set(url.pathname, (await fetch(url.origin + url.pathname, { redirect: 'manual' })).status);
  const st = statusCache.get(url.pathname);
  if (st !== 200) { fail(`${from} -> ${href} returns ${st}`); continue; }
  if (url.hash) {
    const ids = anchorsSeen.get(url.pathname);
    if (ids && !ids.has(decodeURIComponent(url.hash.slice(1)))) fail(`${from} -> ${href}: no element with id ${url.hash}`);
  }
}
ok(`${linkCount} internal links checked`);

// ---------- search ----------
console.log('\n# search');
const SEARCH = [
  ['cbt', 'CBT'],
  ['book', 'Book a CBT online'],
  ['what to bring cbt', 'What do I need to bring to my CBT?'],
  ['how much is a cbt', 'How much does a CBT cost?'],
  ['price', 'How much does a CBT cost?'],
  ['opening hours', 'Opening hours'],
  ['when are you open', 'When are you open?'],
  ['phone number', 'Call 01274 686886'],
  ['whatsapp', 'Message us on WhatsApp'],
  ['directions', 'Get directions'],
  ['postcode', 'Get directions'],
  ['moped', 'CBT'],
  ['scooter', 'CBT'],
  ['a2', 'A2 licence'],
  ['47bhp', 'A2 licence'],
  ['direct access', 'DAS (Direct Access)'],
  ['big bike', 'DAS (Direct Access)'],
  ['which licence', 'Which licence do I need?'],
  ['theory test', 'Do I need a theory test?'],
  ['element e', 'Book a CBT road ride (Element E)'],
  ['road ride', 'Book a CBT road ride (Element E)'],
  ['progresive', 'Progressive access'],
  ['refresher', 'Refresher course'],
  ['own bike', 'Can I train on my own bike?'],
  ['helmet', 'Do you provide bikes and kit?'],
  ['passenger', null],
  ['mod 2', null],
  ['rick', null],
  ['license', null],
  ['xyzzy', null],
];
{
  const page = await newPage(VIEWPORTS.desktop);
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.keyboard.press('/');
  await page.waitForSelector('#search[open] .sr');
  for (const [q, expect] of SEARCH) {
    await page.fill('#search-input', q);
    const t0 = Date.now();
    const top = await page.evaluate(() => [...document.querySelectorAll('#search-results .sr .sr__title')].slice(0, 3).map((e) => e.textContent));
    const dt = Date.now() - t0;
    if (expect === null) { console.log(`  info "${q}" -> ${top.length ? top.join(' / ') : '(no results)'}`); continue; }
    if (top[0] === expect) ok(`"${q}" -> ${top[0]}`);
    else fail(`"${q}" expected "${expect}", got ${top.map((t) => `"${t}"`).join(', ') || 'nothing'}`);
    if (dt > 150) fail(`"${q}" took ${dt}ms`);
  }
  // Keyboard: arrow down + enter navigates.
  await page.fill('#search-input', 'find us');
  await page.keyboard.press('Enter');
  await page.waitForURL(/find-us/);
  ok(`Enter on "find us" opened ${new URL(page.url()).pathname}`);
  // Same-page anchor result closes the dialog and opens the FAQ.
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.keyboard.press('Control+k');
  await page.fill('#search-input', 'how long does a cbt certificate last');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const faqOpen = await page.evaluate(() => ({ dialog: document.querySelector('#search').open, open: document.querySelector('#faq-cbt-valid').open }));
  if (!faqOpen.dialog && faqOpen.open) ok('FAQ result closes search and opens the answer'); else fail(`FAQ result: ${JSON.stringify(faqOpen)}`);
  // ?q= deep link
  await page.goto(`${base}/?q=a1`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#search[open] .sr');
  const dl = await page.$eval('#search-results .sr .sr__title', (e) => e.textContent);
  if (dl === 'A1 licence') ok('?q=a1 opens search with A1 first'); else fail(`?q=a1 top result ${dl}`);
  if (page.errors.length) fail(`search errors: ${page.errors.join(' | ')}`);
  await page.context().close();
}

// ---------- licence finder ----------
console.log('\n# licence finder');
const FINDER = [
  ['16', 'none', null, 'Start with your CBT'],
  ['16', 'cbt', null, 'You’re set for mopeds'],
  ['17', 'none', null, 'Start with your CBT, then A1'],
  ['17', 'cbt', null, 'A1 licence'],
  ['19', 'none', null, 'Start with your CBT, then A2'],
  ['21', 'cbt', null, 'A2 licence'],
  ['24', 'none', null, 'Start with your CBT, then DAS'],
  ['24', 'cbt', null, 'DAS (Direct Access)'],
  ['17', 'a1', null, 'Build experience on your A1'],
  ['19', 'a1', 'yes', 'Progressive access to A2'],
  ['19', 'a1', 'no', 'A2 licence'],
  ['24', 'a1', 'no', 'DAS (Direct Access)'],
  ['19', 'a2', null, 'Enjoy your A2 for now'],
  ['21', 'a2', 'yes', 'Progressive access to full A'],
  ['21', 'a2', 'no', 'Enjoy your A2 for now'],
  ['24', 'a2', 'no', 'DAS (Direct Access)'],
  ['24', 'a', null, 'A refresher course'],
];
{
  const page = await newPage(VIEWPORTS.phone);
  await page.goto(`${base}/training/`, { waitUntil: 'networkidle' });
  // Tap like a person: bring the chip into the middle of the screen, then tap it.
  const tap = async (sel) => { await page.$eval(sel, (e) => e.scrollIntoView({ block: 'center' })); await page.click(sel); };
  for (const [age, hold, years, expect] of FINDER) {
    await tap(`[data-finder] input[name=age][value="${age}"]`);
    await tap(`[data-finder] input[name=hold][value="${hold}"]`);
    const yearsVisible = await page.isVisible('[data-years]');
    if (!!years !== yearsVisible) fail(`${age}/${hold}: years question visible=${yearsVisible}`);
    if (years) await tap(`[data-finder] input[name=years][value="${years}"]`);
    const got = await page.$eval('[data-result] .rec__title', (e) => e.textContent).catch(() => '(none)');
    if (got === expect) ok(`${age} + ${hold}${years ? ` + ${years}` : ''} -> ${got}`);
    else fail(`${age} + ${hold}${years ? ` + ${years}` : ''} expected "${expect}", got "${got}"`);
  }
  await tap('[data-finder] input[name=age][value="16"]');
  const disabled = await page.$$eval('[data-finder] input[name=hold]:disabled', (els) => els.map((e) => e.value));
  if (disabled.join() === 'a1,a2,a') ok('age 16 rules out A1, A2 and full A'); else fail(`age 16 disabled: ${disabled}`);
  await page.context().close();
}

// ---------- menus, filters, theme ----------
console.log('\n# interactions');
{
  const page = await newPage(VIEWPORTS.phone);
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.click('[data-open-menu]');
  await page.waitForSelector('#menu[open]');
  const n = await page.$$eval('#menu .sheet__courses a', (a) => a.length);
  if (n === 6) ok('phone menu opens with 6 courses'); else fail(`phone menu courses ${n}`);
  await page.keyboard.press('Escape');
  if (!(await page.$eval('#menu', (d) => d.open))) ok('Escape closes the menu'); else fail('menu still open after Escape');
  await page.click('[data-open-menu]');
  await page.click(`#menu a[href="${new URL(base).pathname.replace(/\/$/, '')}/training/#finder"]`);
  await page.waitForURL(/training\/#finder/);
  ok('menu link navigates');
  const bar = await page.$$eval('.actionbar a', (a) => a.map((x) => x.getBoundingClientRect().height));
  if (bar.length === 3 && bar.every((h) => h >= 48)) ok('action bar has 3 large buttons'); else fail(`action bar ${bar}`);
  await page.goto(`${base}/reviews/`, { waitUntil: 'networkidle' });
  await page.click('[data-filter="a2"]');
  const shown = await page.$$eval('[data-reviews] .review:not([hidden])', (l) => l.length);
  if (shown > 0 && shown < 10) ok(`reviews filter A2 shows ${shown}`); else fail(`reviews filter A2 shows ${shown}`);
  if (page.errors.length) fail(`errors: ${page.errors.join(' | ')}`);
  await page.context().close();
}
{
  const page = await newPage(VIEWPORTS.desktop);
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.click('.has-mega button');
  if (await page.isVisible('#courses-menu')) ok('courses menu opens on click'); else fail('courses menu did not open');
  await page.keyboard.press('Escape');
  if (!(await page.isVisible('#courses-menu'))) ok('Escape closes courses menu'); else fail('courses menu stayed open');
  await page.click('.hdr__theme');
  const theme = await page.evaluate(() => [document.documentElement.dataset.theme, localStorage.getItem('theme')]);
  if (theme[0] === 'dark' && theme[1] === 'dark') ok('theme toggle switches to dark and remembers'); else fail(`theme ${theme}`);
  await page.reload({ waitUntil: 'networkidle' });
  if ((await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark') ok('dark theme survives reload'); else fail('theme not kept');
  await page.goto(`${base}/find-us/`, { waitUntil: 'networkidle' });
  const today = await page.$$eval('.hours tr.is-today', (r) => r.length);
  if (today === 1) ok('today is highlighted in opening hours'); else fail(`today rows ${today}`);
  await page.context().close();
}

await browser.close();
console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
process.exit(failures ? 1 : 0);
