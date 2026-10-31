// Static site build: node build.mjs  ->  dist/
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, courses, faqs, reviews } from './src/content.mjs';
import { layout, stripTags } from './src/layout.mjs';
import * as P from './src/pages.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const cacheImg = join(root, '.cache', 'img');
if (!existsSync(cacheImg)) throw new Error('Run python3 tools/images.py first (or ./build.sh)');

// Hosting under a sub-path (GitHub Pages project site):
//   BASE=/ridesafe-redesign      prefixes every root-relative URL in the output
//   SITE_URL=https://x.github.io/ridesafe-redesign   absolute URLs (canonical, og:image, JSON-LD)
//   NOINDEX=1                    marks every page noindex (preview copies)
const BASE = (process.env.BASE ?? '').replace(/\/+$/, '');
if (process.env.SITE_URL) site.url = process.env.SITE_URL.replace(/\/+$/, '');
site.noindex = Boolean(process.env.NOINDEX);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);
const rebase = (rel, s) => {
  if (!BASE) return s;
  if (rel.endsWith('.css')) return s.replace(/url\(\//g, `url(${BASE}/`);
  if (rel.endsWith('.js')) return s.replace(/(['"`])\/(?=[a-z])/g, `$1${BASE}/`);
  if (rel.endsWith('.json')) return s.replace(/"u":"\//g, `"u":"${BASE}/`);
  if (rel.endsWith('.html')) {
    return s
      .replace(/(\s(?:href|src|srcset|imagesrcset|action|data-index)=")([^"]*)"/g,
        (m, attr, v) => `${attr}${v.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASE}/`)}"`)
      .replace(/url=\//g, `url=${BASE}/`);
  }
  return s;
};
const write = (rel, content) => {
  const f = join(dist, rel);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, rebase(rel, content));
};

// ---- static assets ----
const css = readFileSync(join(root, 'src/site.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s+/gm, '')
  .replace(/\n{2,}/g, '\n');
const config = {
  wa: site.whatsappHref, cbt: site.booking.cbt, email: site.email, price: site.cbtPrice,
  hours: { days: site.hours.days, open: site.hours.open, close: site.hours.close },
};
const js = readFileSync(join(root, 'src/site.js'), 'utf8').replace('__CONFIG__', JSON.stringify(config));
write('css/site.css', css);
write('js/site.js', js);
cpSync(cacheImg, join(dist, 'img'), { recursive: true });
cpSync(join(root, 'assets/map.webp'), join(dist, 'img/map.webp'));
cpSync(join(root, 'assets/fonts'), join(dist, 'fonts'), { recursive: true });
cpSync(join(root, 'assets/source/favicon.ico'), join(dist, 'favicon.ico'));
const assets = { css: hash(css), js: hash(js) };

// ---- search index ----
// type: a = action, c = course, p = page, s = course section, f = FAQ, r = review
const text = (s) => stripTags(s).replace(/\s+/g, ' ').trim();
const sectionText = (s) => text([
  ...(s.body ?? []), s.intro ?? '', ...(s.list ?? []), ...(s.checklist ?? []),
  ...(s.steps ?? []).flat(), ...(s.cards ?? []).flat(), s.after ?? '',
].join(' '));

const idx = [
  { y: 'a', t: 'Book a CBT online', c: 'Booking', u: site.booking.cbt, k: `book booking cbt date dates online reserve ${site.cbtPrice} price cost`, b: `Pick a date for your CBT. ${site.cbtPrice} standard day, bank holidays cost more.` },
  { y: 'a', t: 'Book a CBT road ride (Element E)', c: 'Booking', u: site.booking.roadRide, k: 'book booking road ride element e finish complete cbt', b: 'Only for riders who have already done the rest of their CBT with us. This does not book a full CBT.' },
  { y: 'a', t: `Call ${site.phone}`, c: 'Contact', u: site.phoneHref, k: 'call phone ring telephone number contact talk', b: `Phone us on ${site.phone}. Open ${site.hours.label}.` },
  { y: 'a', t: 'Message us on WhatsApp', c: 'Contact', u: site.whatsappHref, k: `whatsapp message chat text contact ${site.whatsapp}`, b: `WhatsApp ${site.whatsapp}. Ask about any course.` },
  { y: 'a', t: `Email ${site.email}`, c: 'Contact', u: `mailto:${site.email}`, k: 'email mail contact enquiry', b: 'Send us an email about training.' },
  { y: 'a', t: 'Get directions', c: 'Contact', u: site.maps.google, k: 'directions map route sat nav google maps apple maps waze address location postcode where', b: `${site.address.street}, ${site.address.town} ${site.address.postcode}` },
  { y: 'p', t: 'Which licence do I need?', c: 'Licence finder', u: '/training/#finder', k: 'licence finder which course choose quiz age recommend what do i need help decide', b: 'Answer two quick questions about your age and the licence you hold, and we will recommend the right course.' },
  { y: 'p', t: 'Compare courses', c: 'Courses', u: '/training/#compare', k: 'compare comparison table all courses differences ages', b: 'Minimum age, what you can ride, L-plates, passengers, motorways and theory test for every course.' },
  { y: 'p', t: 'Your licence journey', c: 'Courses', u: '/training/#pathway', k: 'pathway route steps journey progression order cbt a1 a2 full a', b: 'CBT, then A1 from 17, A2 from 19, full A from 24 or 21 after two years on A2.' },
  { y: 'p', t: 'All courses', c: 'Courses', u: '/training/', k: 'courses training lessons overview', b: 'CBT, A1, A2, DAS, progressive access and refresher courses.' },
  { y: 'p', t: 'Book online', c: 'Booking', u: '/book/', k: 'book booking enquire enquiry reserve', b: 'Book a CBT or a CBT road ride online, or enquire about licence and refresher training.' },
  { y: 'p', t: 'Opening hours', c: 'Find us', u: '/find-us/#hours', k: 'opening hours times open closed monday weekend sunday saturday when', b: `${site.hours.label}. Closed on Mondays. ${site.appointmentNote}` },
  { y: 'p', t: 'Contact and find us', c: 'Find us', u: '/find-us/', k: 'contact find us address location map postcode where bradford directions', b: `${site.address.street}, ${site.address.town} ${site.address.postcode}. ${site.appointmentNote}` },
  { y: 'p', t: 'Reviews', c: 'Reviews', u: '/reviews/', k: 'reviews testimonials feedback ratings stars', b: `${reviews.length} reviews from riders who trained with us.` },
  { y: 'p', t: 'Our friends', c: 'Community', u: '/meet-our-friends/', k: 'friends partners my moto leeds super good bikers for autism bundled bytes community', b: 'Local organisations we support and work alongside.' },
  { y: 'p', t: 'Instagram', c: 'Social', u: site.instagram, k: 'instagram social photos follow', b: 'Follow Ridesafe on Instagram.' },
  { y: 'p', t: 'Facebook', c: 'Social', u: site.facebook, k: 'facebook social follow', b: 'Follow Ridesafe on Facebook.' },
];
for (const c of courses) {
  idx.push({ y: 'c', t: c.name, c: c.long, u: `/training/${c.slug}/`, k: `${c.keywords} ${c.menu} ${c.age}`, b: `${c.summary} ${c.lede} Age: ${c.ageNote}.` });
  for (const s of c.sections) {
    idx.push({ y: 's', t: s.title.includes(c.name.split(' ')[0]) ? s.title : `${s.title}`, c: c.name, u: `/training/${c.slug}/#${s.id}`, k: `${c.menu} ${c.slug.replace(/-/g, ' ')}`, b: sectionText(s) });
  }
}
for (const f of faqs) idx.push({ y: 'f', t: f.q, c: 'FAQ', u: `/#faq-${f.id}`, k: f.k, b: f.a });
for (const r of reviews) idx.push({ y: 'r', t: `Review from ${r.name}`, c: 'Reviews', u: `/reviews/#${r.id}`, k: r.tags.join(' '), b: r.text });
const idxJson = JSON.stringify(idx);
write('js/search-index.json', idxJson);
assets.idx = hash(idxJson);

// ---- structured data ----
const business = {
  '@context': 'https://schema.org',
  '@type': 'DrivingSchool',
  '@id': `${site.url}/#school`,
  name: site.fullName,
  url: site.url,
  image: `${site.url}/img/og.jpg`,
  logo: `${site.url}/img/logo-640.webp`,
  telephone: '+441274686886',
  email: site.email,
  address: {
    '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.town,
    addressRegion: site.address.region, postalCode: site.address.postcode, addressCountry: 'GB',
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  areaServed: site.areas.map((a) => ({ '@type': 'City', name: a })),
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00', closes: '17:00',
  }],
  sameAs: [site.instagram, site.facebook],
};
const website = {
  '@context': 'https://schema.org', '@type': 'WebSite', url: site.url, name: site.fullName,
  potentialAction: { '@type': 'SearchAction', target: `${site.url}/?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
};
const crumbs = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: site.url + path })),
});

// ---- pages ----
const pages = [
  {
    path: '/', key: 'home', section: 'home', body: P.home(),
    title: 'Ridesafe Motorcycle School Bradford | CBT and motorcycle licence training',
    ogTitle: 'Ridesafe Motorcycle School, Bradford',
    desc: 'DVSA approved motorcycle training in Bradford with 30 years’ experience. Book your CBT online, or train for your A1, A2 or full DAS licence. Serving Bradford, Leeds, Halifax and Keighley.',
    preload: { href: '/img/hero-lane-1024.webp', srcset: '/img/hero-lane-640.webp 640w, /img/hero-lane-1024.webp 1024w, /img/hero-lane-1600.webp 1600w, /img/hero-lane-2400.webp 2400w', sizes: '100vw' },
    jsonld: [business, website],
  },
  {
    path: '/training/', key: 'training', section: 'training', body: P.training(),
    title: 'Motorcycle training courses: CBT, A1, A2, DAS | Ridesafe Bradford',
    desc: 'Compare CBT, A1, A2, DAS, progressive access and refresher courses, and find out which motorcycle licence you need with our two-question licence finder.',
    jsonld: [crumbs([['Home', '/'], ['Courses', '/training/']])],
  },
  ...courses.map((c) => ({
    path: `/training/${c.slug}/`, key: 'course', section: 'training', body: P.course(c),
    title: `${c.name} training in Bradford | Ridesafe Motorcycle School`,
    desc: `${c.summary} ${c.lede}`.slice(0, 300),
    waText: `Hi Ridesafe, I’m interested in ${c.long}. What dates do you have?`,
    jsonld: [
      crumbs([['Home', '/'], ['Courses', '/training/'], [c.name, `/training/${c.slug}/`]]),
      { '@context': 'https://schema.org', '@type': 'Course', name: `${c.name} motorcycle training`, description: c.summary, provider: { '@id': `${site.url}/#school` } },
    ],
  })),
  {
    path: '/book/', key: 'book', section: 'book', body: P.book(),
    title: 'Book motorcycle training online | Ridesafe Bradford',
    desc: `Book your CBT online (${site.cbtPrice} standard day), book a CBT road ride, or enquire about A1, A2, DAS, progressive access and refresher training.`,
  },
  {
    path: '/find-us/', key: 'find-us', section: 'find-us', body: P.findUs(),
    title: 'Contact and find us | Ridesafe Motorcycle School Bradford',
    desc: `Ridesafe is at ${site.address.street}, ${site.address.town} ${site.address.postcode}. Open ${site.hours.label}. Call ${site.phone} or message us on WhatsApp.`,
    jsonld: [business],
  },
  {
    path: '/reviews/', key: 'reviews', section: 'reviews', body: P.reviewsPage(),
    title: 'Reviews from our riders | Ridesafe Motorcycle School Bradford',
    desc: `Read ${reviews.length} reviews from riders who did their CBT, A2 and full licence training with Ridesafe in Bradford.`,
  },
  {
    path: '/meet-our-friends/', key: 'friends', section: 'friends', body: P.friendsPage(),
    title: 'Our friends | Ridesafe Motorcycle School Bradford',
    desc: 'Local organisations we support and work alongside, including My Moto Leeds and Super Good Bikers for Autism.',
  },
];

for (const p of pages) write(join(p.path, 'index.html'), layout(p, p.body, assets));
write('404.html', layout({ path: '/404.html', key: 'notfound', section: '', noindex: true, title: 'Page not found | Ridesafe', desc: 'This page could not be found.' }, P.notFound(), assets));

// Old address kept working: /home -> /
write('home/index.html', `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ridesafe</title><link rel="canonical" href="${site.url}/"><meta http-equiv="refresh" content="0; url=/"><meta name="robots" content="noindex"></head><body><a href="/">Continue to Ridesafe</a></body></html>`);
write('_redirects', '/home  /  301\n/home/  /  301\n');

if (site.noindex) write('robots.txt', 'User-agent: *\nDisallow: /\n');
else write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
if (!site.noindex) write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${site.url}${p.path}</loc></url>`).join('\n')}\n</urlset>\n`);


console.log(`built ${pages.length + 1} pages, ${idx.length} search entries, css ${(css.length / 1024).toFixed(1)} KB, js ${(js.length / 1024).toFixed(1)} KB`);
