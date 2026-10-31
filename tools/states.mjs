// Screenshots of interactive states: node tools/states.mjs [base] [outdir]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? `${process.env.HOME}/projects/weather-showcase/node_modules/playwright-core`);

const base = process.argv[2] ?? 'http://127.0.0.1:8702';
const out = process.argv[3] ?? '.cache/shots';
const browser = await chromium.launch({ executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
const phone = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const desk = { viewport: { width: 1440, height: 900 } };

async function shot(name, ctxOpts, url, act) {
  const ctx = await browser.newContext({ timezoneId: 'Europe/London', ...ctxOpts });
  const page = await ctx.newPage();
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await act(page);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/state-${name}.png`, animations: 'disabled' });
  console.log(name);
  await ctx.close();
}

await shot('search-desk', desk, '/', async (p) => { await p.keyboard.press('/'); await p.waitForSelector('.sr'); await p.fill('#search-input', 'what to bring'); });
await shot('search-phone', phone, '/', async (p) => { await p.click('.search-btn'); await p.waitForSelector('.sr'); await p.fill('#search-input', 'cbt cost'); });
await shot('search-empty-phone', phone, '/', async (p) => { await p.click('.search-btn'); await p.waitForSelector('.sr'); });
await shot('menu-phone', phone, '/training/a2/', async (p) => { await p.click('[data-open-menu]'); });
await shot('mega-desk', desk, '/', async (p) => { await p.click('.has-mega button'); });
await shot('finder-phone', phone, '/training/', async (p) => {
  for (const s of ['input[name=age][value="21"]', 'input[name=hold][value="a2"]', 'input[name=years][value="yes"]']) {
    await p.$eval(`[data-finder] ${s}`, (e) => e.scrollIntoView({ block: 'center' }));
    await p.click(`[data-finder] ${s}`);
  }
  await p.$eval('[data-result]', (e) => e.scrollIntoView({ block: 'end' }));
  await p.evaluate(() => scrollBy(0, 90));
});
await shot('finder-desk', desk, '/', async (p) => {
  await p.click('[data-finder] input[name=age][value="17"]');
  await p.click('[data-finder] input[name=hold][value="none"]');
  await p.$eval('#finder', (e) => e.scrollIntoView({ block: 'center' }));
});
await shot('dark-home-desk', { ...desk, colorScheme: 'dark' }, '/', async () => {});
await shot('dark-courses-desk', { ...desk, colorScheme: 'dark' }, '/', async (p) => { await p.$eval('#courses', (e) => e.scrollIntoView()); });
await shot('dark-cbt-phone', { ...phone, colorScheme: 'dark' }, '/training/cbt/', async (p) => { await p.evaluate(() => scrollTo(0, 1400)); });
await shot('cbt-phone-top', phone, '/training/cbt/', async () => {});
await shot('book-phone', phone, '/book/', async () => {});
await browser.close();
