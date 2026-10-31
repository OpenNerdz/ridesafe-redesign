// Screenshots with the phone's system Chromium (playwright-core borrowed from another project).
// node tools/shot.mjs <base> <outdir> <tag> /path1,/path2   env: SIZES=phone,tab,desk THEME=light|dark FOLD=1
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? `${process.env.HOME}/projects/weather-showcase/node_modules/playwright-core`);

const [base, out, tag, pathsArg] = process.argv.slice(2);
const sizes = (process.env.SIZES ?? 'phone,desk').split(',');
const vp = { phone: { width: 390, height: 844 }, small: { width: 360, height: 740 }, tab: { width: 820, height: 1180 }, desk: { width: 1440, height: 900 } };
const browser = await chromium.launch({ executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
for (const p of pathsArg.split(',')) {
  for (const s of sizes) {
    const mobile = s === 'phone' || s === 'small';
    const ctx = await browser.newContext({ viewport: vp[s], deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, colorScheme: process.env.THEME ?? 'light', timezoneId: process.env.TZ_ID ?? 'Europe/London' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(base + p, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => errors.push(`goto ${e.message}`));
    if (!process.env.FOLD) {
      // Load lazy images up front so the full-page picture shows them.
      await page.evaluate(() => Promise.all([...document.images].map((i) => {
        i.loading = 'eager';
        return i.complete ? null : new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); setTimeout(r, 8000); });
      })));
      await page.waitForLoadState('networkidle').catch(() => {});
      // Full-page captures misplace sticky/fixed bars; put them in normal flow for the picture.
      await page.addStyleTag({ content: '.hdr{position:relative!important}.actionbar{position:static!important}' });
    }
    await page.waitForTimeout(Number(process.env.WAIT ?? 600));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    const name = `${tag}${p.replace(/\//g, '_') || '_root'}-${s}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: !process.env.FOLD, animations: 'disabled' });
    console.log(name, 'height', h, 'overflow', overflow, errors.length ? `ERR ${errors.slice(0, 3).join(' | ')}` : '');
    await ctx.close();
  }
}
await browser.close();
