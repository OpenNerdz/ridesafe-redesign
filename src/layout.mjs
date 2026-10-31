import { site, courses, waLink } from './content.mjs';
import { icon } from './icons.mjs';

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const stripTags = (s) => String(s).replace(/<[^>]+>/g, '');

const SIZES = {
  'hero-lane': [640, 1024, 1600, 2400],
  wales: [640, 1080, 1600],
  logo: [320, 640],
};
const sizesFor = (base) => SIZES[base] ?? (base.startsWith('course-') ? [240, 480, 800, 1200] : null);

// Responsive <img>. `w`/`h` are the intrinsic ratio so the browser reserves space before load.
export function img({ base, alt, w, h, sizes = '100vw', cls = '', eager = false, focus, style = '' }) {
  const ws = sizesFor(base);
  const srcset = ws.map((x) => `/img/${base}-${x}.webp ${x}w`).join(', ');
  const mid = ws.find((x) => x >= 640) ?? ws[ws.length - 1];
  const pos = focus ? `object-position:${focus};` : '';
  const st = pos + style ? ` style="${pos}${style}"` : '';
  return `<img${cls ? ` class="${cls}"` : ''} src="/img/${base}-${mid}.webp" srcset="${srcset}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${st}>`;
}

export const ext = (label = 'opens in a new tab') => `<span class="sr-only"> (${label})</span>`;

export function hoursStatus(cls = '') {
  return `<span class="status${cls ? ' ' + cls : ''}" data-open-status><span class="status__dot" aria-hidden="true"></span><span class="status__text">${esc(site.hours.short)}</span></span>`;
}

// Width descriptors so a 2x phone showing a 138px logo takes the 320px file, not the 640px one.
function logo(eager, sizes = '(min-width: 960px) 160px, 138px') {
  return `<img class="logo" src="/img/logo-320.webp" srcset="/img/logo-320.webp 320w, /img/logo-640.webp 640w" sizes="${sizes}" width="160" height="38" alt="Ridesafe Motorcycle School Bradford"${eager ? '' : ' loading="lazy"'} decoding="async">`;
}

const coursesMenu = () => `
  <div class="mega" id="courses-menu" hidden>
    <div class="mega__grid">
      <ul class="mega__list" role="list">
        ${courses.map((c) => `
        <li><a class="mega__link" href="/training/${c.slug}/">
          <span class="badge${c.slug === 'cbt' ? ' badge--learner' : ''}">${esc(c.age)}</span>
          <span class="mega__text"><strong>${esc(c.menu)}</strong><span>${esc(c.summary)}</span></span>
        </a></li>`).join('')}
      </ul>
      <div class="mega__side">
        <a class="mega__feature" href="/training/#finder">
          ${icon('compass')}
          <span><strong>Which licence do I need?</strong><span>Two quick questions and we’ll point you to the right course.</span></span>
        </a>
        <a class="mega__plain" href="/training/#compare">${icon('file')} Compare all courses</a>
        <a class="mega__plain" href="/training/">${icon('bike')} Courses overview</a>
        <a class="btn btn--primary btn--block" href="${site.booking.cbt}">Book a CBT online${icon('arrow')}</a>
      </div>
    </div>
  </div>`;

function header(page) {
  const cur = (k) => (page.section === k ? ' aria-current="page"' : '');
  return `
<a class="skip" href="#main">Skip to content</a>
<header class="hdr">
  <div class="wrap hdr__in">
    <a class="hdr__logo" href="/"${page.key === 'home' ? ' aria-current="page"' : ''}>${logo(true)}</a>
    <nav class="nav" aria-label="Main">
      <ul class="nav__list" role="list">
        <li class="nav__item has-mega">
          <a class="nav__link nojs-only" href="/training/"${cur('training')}>Courses</a>
          <button class="nav__link js-only" type="button" aria-expanded="false" aria-controls="courses-menu"${page.section === 'training' ? ' data-current' : ''}>Courses${icon('chevron', 'nav__chev')}</button>
          ${coursesMenu()}
        </li>
        <li class="nav__item"><a class="nav__link" href="/reviews/"${cur('reviews')}>Reviews</a></li>
        <li class="nav__item"><a class="nav__link" href="/find-us/"${cur('find-us')}>Find us</a></li>
        <li class="nav__item"><a class="nav__link" href="/meet-our-friends/"${cur('friends')}>Our friends</a></li>
      </ul>
    </nav>
    <div class="hdr__actions">
      <button class="search-btn js-only" type="button" data-open-search aria-haspopup="dialog" aria-label="Search the site">
        ${icon('search')}<span class="search-btn__label">Search</span><kbd class="search-btn__kbd">/</kbd>
      </button>
      <button class="icon-btn hdr__theme js-only" type="button" data-theme-toggle aria-label="Switch to dark theme">${icon('moon', 'i-moon')}${icon('sun', 'i-sun')}</button>
      <a class="hdr__phone" href="${site.phoneHref}">${icon('phone')}<span>${site.phone}</span></a>
      <a class="btn btn--primary btn--sm hdr__book" href="/book/"${cur('book')}>Book now</a>
      <button class="icon-btn hdr__menu js-only" type="button" data-open-menu aria-haspopup="dialog" aria-label="Open menu">${icon('menu')}</button>
      <a class="icon-btn hdr__menu nojs-only" href="#footer" aria-label="Menu">${icon('menu')}</a>
    </div>
  </div>
</header>`;
}

function menuSheet(page) {
  return `
<dialog class="sheet" id="menu" aria-label="Menu">
  <div class="sheet__panel">
    <div class="sheet__head">
      <a class="hdr__logo" href="/">${logo(false)}</a>
      <button class="icon-btn icon-btn--light" type="button" data-close aria-label="Close menu">${icon('x')}</button>
    </div>
    <div class="sheet__body">
      <button class="sheet__search" type="button" data-open-search>${icon('search')}<span>Search courses, FAQs, hours…</span></button>
      <p class="sheet__label">Courses</p>
      <ul class="sheet__courses" role="list">
        ${courses.map((c) => `<li><a href="/training/${c.slug}/"${page.path === `/training/${c.slug}/` ? ' aria-current="page"' : ''}><span class="badge${c.slug === 'cbt' ? ' badge--learner' : ''}">${esc(c.age)}</span><span>${esc(c.menu)}</span>${icon('chevronRight', 'sheet__chev')}</a></li>`).join('')}
      </ul>
      <a class="sheet__finder" href="/training/#finder">${icon('compass')}<span><strong>Which licence do I need?</strong><span>Answer two questions</span></span>${icon('chevronRight', 'sheet__chev')}</a>
      <ul class="sheet__links" role="list">
        <li><a href="/"${page.key === 'home' ? ' aria-current="page"' : ''}>Home</a></li>
        <li><a href="/training/"${page.path === '/training/' ? ' aria-current="page"' : ''}>Compare courses</a></li>
        <li><a href="/book/"${page.section === 'book' ? ' aria-current="page"' : ''}>Book online</a></li>
        <li><a href="/reviews/"${page.section === 'reviews' ? ' aria-current="page"' : ''}>Reviews</a></li>
        <li><a href="/find-us/"${page.section === 'find-us' ? ' aria-current="page"' : ''}>Find us</a></li>
        <li><a href="/meet-our-friends/"${page.section === 'friends' ? ' aria-current="page"' : ''}>Our friends</a></li>
      </ul>
      <div class="sheet__contact">
        ${hoursStatus('status--on-dark')}
        <div class="sheet__btns">
          <a class="btn btn--light" href="${site.phoneHref}">${icon('phone')}Call</a>
          <a class="btn btn--light" href="${waLink('Hi Ridesafe, I have a question about training.')}">${icon('whatsapp', 'i-wa')}WhatsApp</a>
          <a class="btn btn--light" href="mailto:${site.email}">${icon('mail')}Email</a>
        </div>
        <button class="sheet__theme" type="button" data-theme-toggle aria-label="Switch to dark theme">${icon('moon', 'i-moon')}${icon('sun', 'i-sun')}<span class="i-moon-label">Dark theme</span><span class="i-sun-label">Light theme</span></button>
      </div>
    </div>
  </div>
</dialog>`;
}

const searchDialog = () => `
<dialog class="search" id="search" aria-label="Search">
  <div class="search__panel">
    <div class="search__bar">
      ${icon('search', 'search__icon')}
      <input class="search__input" id="search-input" type="search" role="combobox" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list" aria-label="Search the site" placeholder="Search courses, FAQs, hours…" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go">
      <button class="search__close" type="button" data-close aria-label="Close search"><span class="search__esc">Esc</span>${icon('x', 'search__x')}</button>
    </div>
    <div class="search__body">
      <p class="search__hint" id="search-hint"></p>
      <ul class="search__results" id="search-results" role="listbox" aria-label="Search results"></ul>
      <p class="sr-only" id="search-status" role="status" aria-live="polite"></p>
    </div>
    <div class="search__foot" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
  </div>
</dialog>`;

function actionbar(page) {
  const msg = page.waText ?? 'Hi Ridesafe, I have a question about training.';
  return `
<nav class="actionbar" aria-label="Quick contact">
  <a class="actionbar__btn" href="${site.phoneHref}">${icon('phone')}<span>Call</span></a>
  <a class="actionbar__btn" href="${waLink(msg)}">${icon('whatsapp', 'i-wa')}<span>WhatsApp</span></a>
  <a class="actionbar__btn actionbar__btn--primary" href="/book/">${icon('calendar')}<span>Book</span></a>
</nav>`;
}

function footer() {
  return `
<footer class="ftr" id="footer">
  <div class="wrap ftr__grid">
    <div class="ftr__brand">
      <a class="hdr__logo" href="/">${logo(false, '170px')}</a>
      <p>DVSA approved motorcycle training in Bradford, with 30 years’ experience and both male and female instructors.</p>
      <div class="social">
        <a class="icon-btn icon-btn--light" href="${site.whatsappHref}" aria-label="WhatsApp">${icon('whatsapp')}</a>
        <a class="icon-btn icon-btn--light" href="${site.instagram}" aria-label="Instagram">${icon('instagram')}</a>
        <a class="icon-btn icon-btn--light" href="${site.facebook}" aria-label="Facebook">${icon('facebook')}</a>
      </div>
    </div>
    <nav class="ftr__col" aria-label="Courses">
      <p class="ftr__title">Courses</p>
      <ul role="list">
        ${courses.map((c) => `<li><a href="/training/${c.slug}/">${esc(c.menu)}</a></li>`).join('')}
        <li><a href="/training/#finder">Which licence do I need?</a></li>
      </ul>
    </nav>
    <nav class="ftr__col" aria-label="School">
      <p class="ftr__title">School</p>
      <ul role="list">
        <li><a href="/book/">Book online</a></li>
        <li><a href="/training/#compare">Compare courses</a></li>
        <li><a href="/reviews/">Reviews</a></li>
        <li><a href="/find-us/">Find us</a></li>
        <li><a href="/meet-our-friends/">Our friends</a></li>
        <li><a href="/#faq">FAQs</a></li>
      </ul>
    </nav>
    <div class="ftr__col ftr__contact">
      <p class="ftr__title">Contact</p>
      <ul role="list">
        <li><a href="${site.phoneHref}">${icon('phone')}${site.phone}</a></li>
        <li><a href="${site.whatsappHref}">${icon('whatsapp')}WhatsApp ${site.whatsapp}</a></li>
        <li><a href="mailto:${site.email}">${icon('mail')}${site.email}</a></li>
        <li><a href="/find-us/">${icon('pin')}${site.address.street}, ${site.address.town} ${site.address.postcode}</a></li>
        <li class="ftr__hours">${icon('clock')}<span>${site.hours.label}<br>${hoursStatus('status--on-dark')}</span></li>
      </ul>
    </div>
  </div>
  <div class="wrap ftr__base">
    <p>© ${new Date().getFullYear()} ${site.fullName}. All rights reserved.</p>
    <p>${site.address.street}, ${site.address.town}, ${site.address.region} ${site.address.postcode}</p>
  </div>
</footer>`;
}

// Runs before first paint: picks the stored theme, else the system one, so there is no flash.
const themeBoot = `(function(){var d=document.documentElement,t=null;d.classList.add('js');try{t=localStorage.getItem('theme');}catch(e){}if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.dataset.theme=t;})();`;

export function layout(page, body, assets) {
  const url = site.url + page.path;
  const preload = page.preload
    ? `<link rel="preload" as="image" href="${page.preload.href}" imagesrcset="${page.preload.srcset}" imagesizes="${page.preload.sizes}" fetchpriority="high">`
    : '';
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.desc)}">
${page.noindex || site.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#0c110e">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.fullName}">
<meta property="og:title" content="${esc(page.ogTitle ?? page.title)}">
<meta property="og:description" content="${esc(page.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.url}/img/og.jpg">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="16x16">
<link rel="preload" href="/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
${preload}
<link rel="stylesheet" href="/css/site.css?v=${assets.css}">
<script>${themeBoot}</script>
<script src="/js/site.js?v=${assets.js}" data-index="/js/search-index.json?v=${assets.idx}" defer></script>
${(page.jsonld ?? []).map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body class="page-${page.key}">
${header(page)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
${actionbar(page)}
${menuSheet(page)}
${searchDialog()}
</body>
</html>
`;
}
