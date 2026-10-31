import {
  site, waLink, trust, courses, courseBySlug, factRows, faqs, reviews, reviewFilters, featuredReviews, friends,
} from './content.mjs';
import { icon, lPlate } from './icons.mjs';
import { esc, img, ext, hoursStatus } from './layout.mjs';

const bookingNote = ext('opens our booking system');

// ---------- shared pieces ----------

function courseCard(c, { compact = false } = {}) {
  return `
  <li class="ccard${compact ? ' ccard--compact' : ''}">
    <div class="ccard__media">
      ${img({ base: `course-${c.slug}`, alt: '', w: 480, h: 640, sizes: '(min-width: 960px) 380px, (min-width: 560px) 46vw, 112px', focus: c.focus })}
      <span class="badge badge--float${c.slug === 'cbt' ? ' badge--learner' : ''}">${c.slug === 'cbt' ? lPlate : ''}${esc(c.age)}</span>
    </div>
    <div class="ccard__body">
      <h3 class="ccard__title"><a href="/training/${c.slug}/">${esc(c.name)}</a></h3>
      <p class="ccard__meta">${esc(c.ageNote)}</p>
      <p class="ccard__text">${esc(c.summary)}</p>
      <span class="ccard__more" aria-hidden="true">View course${icon('arrow')}</span>
    </div>
  </li>`;
}

export const courseGrid = (list = courses) => `<ul class="cgrid" role="list">${list.map((c) => courseCard(c)).join('')}</ul>`;

const stars = `<span class="stars" role="img" aria-label="5 out of 5 stars">${icon('star').repeat(5)}</span>`;

function reviewCard(r, { clamp = false } = {}) {
  return `
  <li class="review" id="${r.id}" data-tags="${r.tags.join(' ')}">
    <figure>
      ${stars}
      <blockquote class="review__text${clamp ? ' review__text--clamp' : ''}"><p>${esc(r.text)}</p></blockquote>
      <figcaption class="review__by"><span class="review__avatar" aria-hidden="true">${esc(r.name[0])}</span>${esc(r.name)}</figcaption>
    </figure>
  </li>`;
}

function faqList(list) {
  return `<div class="faq">${list.map((f) => `
    <details class="faq__item" id="faq-${f.id}">
      <summary><span>${esc(f.q)}</span>${icon('chevron', 'faq__chev')}</summary>
      <div class="faq__a"><p>${esc(f.a)}${f.id === 'which' ? ' <a href="/training/#finder">Open the licence finder</a>.' : ''}${f.id === 'road-ride' ? ` <a href="${site.booking.roadRide}">Book the road ride${bookingNote}</a>.` : ''}${f.id === 'cbt-cost' ? ` <a href="${site.booking.cbt}">See CBT dates${bookingNote}</a>.` : ''}</p></div>
    </details>`).join('')}
  </div>`;
}

function contactButtons(waText, { primaryWa = true } = {}) {
  return `
    <a class="btn ${primaryWa ? 'btn--wa' : 'btn--ghost'}" href="${waLink(waText)}">${icon('whatsapp')}Message on WhatsApp</a>
    <a class="btn btn--ghost" href="${site.phoneHref}">${icon('phone')}Call ${site.phone}</a>`;
}

function ctaBand({ title = 'Ready to ride?', text = 'Book your CBT online in a couple of minutes, or message us and we’ll help you pick the right course.', waText } = {}) {
  return `
  <section class="cta-band" aria-labelledby="cta-title">
    ${img({ base: 'wales', alt: '', w: 640, h: 991, sizes: '100vw', cls: 'cta-band__img', focus: '50% 62%' })}
    <div class="wrap cta-band__in">
      <h2 id="cta-title">${esc(title)}</h2>
      <p>${esc(text)}</p>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="${site.booking.cbt}">Book a CBT online${icon('arrow')}${bookingNote}</a>
        <a class="btn btn--light btn--lg" href="${waLink(waText ?? 'Hi Ridesafe, I’d like some help choosing a course.')}">${icon('whatsapp', 'i-wa')}Ask us on WhatsApp</a>
      </div>
    </div>
  </section>`;
}

function pageHead({ eyebrow, title, lede, crumbs, extra = '' }) {
  return `
  <section class="phead">
    <div class="wrap">
      ${crumbs ? breadcrumbs(crumbs) : ''}
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
      <h1>${title}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ''}
      ${extra}
    </div>
  </section>`;
}

function breadcrumbs(items) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol role="list">${items.map(([label, href], i) => (i === items.length - 1
    ? `<li><span aria-current="page">${esc(label)}</span></li>`
    : `<li><a href="${href}">${esc(label)}</a>${icon('chevronRight')}</li>`)).join('')}</ol></nav>`;
}

// Licence finder. Logic lives in site.js; this is the form and a no-JS fallback.
export function finder({ headingLevel = 2 } = {}) {
  const h = `h${headingLevel}`;
  const ages = [['16', '16'], ['17', '17–18'], ['19', '19–20'], ['21', '21–23'], ['24', '24+']];
  const holds = [['none', 'Nothing yet', 'or just a car licence'], ['cbt', 'CBT certificate', ''], ['a1', 'A1 licence', '125cc'], ['a2', 'A2 licence', 'up to 35 kW'], ['a', 'Full A licence', 'any bike']];
  return `
  <section class="finder" id="finder" aria-labelledby="finder-title">
    <div class="finder__intro">
      <p class="eyebrow eyebrow--on-dark">Licence finder</p>
      <${h} id="finder-title">Which licence do I need?</${h}>
      <p>Answer two quick questions and we’ll show you the right course and what comes next. It follows DVSA rules, and we’ll confirm everything when you get in touch.</p>
    </div>
    <form class="finder__form" data-finder novalidate>
      <fieldset class="finder__q">
        <legend><span class="finder__n">1</span>How old are you?</legend>
        <div class="chips">${ages.map(([v, l]) => `<label class="chip"><input type="radio" name="age" value="${v}"><span>${l}</span></label>`).join('')}</div>
      </fieldset>
      <fieldset class="finder__q">
        <legend><span class="finder__n">2</span>What do you hold now?</legend>
        <div class="chips chips--stack">${holds.map(([v, l, s]) => `<label class="chip"><input type="radio" name="hold" value="${v}"><span>${l}${s ? `<small>${s}</small>` : ''}</span></label>`).join('')}</div>
      </fieldset>
      <fieldset class="finder__q" data-years hidden>
        <legend><span class="finder__n">3</span>Have you held it for two years or more?</legend>
        <div class="chips">${[['yes', 'Yes'], ['no', 'Not yet']].map(([v, l]) => `<label class="chip"><input type="radio" name="years" value="${v}"><span>${l}</span></label>`).join('')}</div>
      </fieldset>
      <div class="finder__result" data-result aria-live="polite">
        <p class="finder__placeholder">${icon('compass')}Your recommendation will appear here.</p>
        <noscript><p>Not sure? <a href="/training/#compare">Compare all courses</a> or <a href="${site.phoneHref}">call ${site.phone}</a>.</p></noscript>
      </div>
    </form>
  </section>`;
}

function pathway() {
  const steps = [
    ['cbt', 'CBT', '16+ moped, 17+ 125cc', 'Ride on L-plates'],
    ['a1', 'A1', '17+', '125cc, no L-plates'],
    ['a2', 'A2', '19+', 'Up to 35 kW (47 bhp)'],
    ['das', 'Full A', '24+ via DAS, or 21+ after 2 years on A2', 'Any motorcycle'],
  ];
  return `
  <section class="section" id="pathway" aria-labelledby="pathway-title">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">How licences work</p>
        <h2 id="pathway-title">Your licence journey</h2>
        <p class="lede">Everyone starts with CBT. After that, your age decides how far you can go in one step.</p>
      </div>
      <ol class="path" role="list">
        ${steps.map(([slug, t, age, ride], i) => `
        <li class="path__step">
          <a href="/training/${slug}/">
            <span class="path__num">${i + 1}</span>
            <span class="path__name">${t}</span>
            <span class="path__age">${age}</span>
            <span class="path__ride">${ride}</span>
          </a>
        </li>`).join('')}
      </ol>
      <div class="path__notes">
        <p>${icon('refresh')}<span><strong>Progressive access:</strong> after two years on A1 you can upgrade to A2, and after two years on A2 to full A, with no theory test. <a href="/training/progressive-access/">How it works</a></span></p>
        <p>${icon('helmet')}<span><strong>Already licensed?</strong> A <a href="/training/refresher/">refresher course</a> gets your confidence back after a break.</span></p>
      </div>
    </div>
  </section>`;
}

function yesNo(v) {
  if (v === 'Yes') return `<span class="yn yn--yes">${icon('check')}Yes</span>`;
  if (v === 'No') return `<span class="yn yn--no">${icon('x')}No</span>`;
  return esc(v);
}

function compareTable() {
  return `
  <section class="section section--alt" id="compare" aria-labelledby="compare-title">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">Side by side</p>
        <h2 id="compare-title">Compare courses</h2>
      </div>
      <div class="table-scroll" tabindex="0" role="region" aria-labelledby="compare-title">
        <table class="compare">
          <thead><tr><th scope="col"><span class="sr-only">Detail</span></th>${courses.map((c) => `<th scope="col"><a href="/training/${c.slug}/">${esc(c.menu)}</a></th>`).join('')}</tr></thead>
          <tbody>
            ${factRows.map(([k, label]) => `<tr><th scope="row">${label}</th>${courses.map((c) => `<td>${yesNo(c.facts[k])}</td>`).join('')}</tr>`).join('')}
            <tr><th scope="row">How to book</th>${courses.map((c) => `<td>${c.book === 'online'
              ? `<a class="btn btn--primary btn--sm" href="${site.booking.cbt}">Book online${bookingNote}</a>`
              : `<a class="btn btn--ghost btn--sm" href="${waLink(`Hi Ridesafe, I’m interested in ${c.long}.`)}">${icon('whatsapp', 'i-wa')}Enquire</a>`}</td>`).join('')}</tr>
          </tbody>
        </table>
      </div>
      <p class="table-hint">${icon('arrow')}Swipe the table to see every course</p>
    </div>
  </section>`;
}

function trustGrid() {
  return `<ul class="trust" role="list">${trust.map((t) => `
    <li class="trust__item">${icon(t.icon)}<div><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div></li>`).join('')}
  </ul>`;
}

// ---------- pages ----------

export function home() {
  const featured = featuredReviews.map((n) => reviews.find((r) => r.name === n));
  const homeFaqs = faqs;
  return `
  <section class="hero">
    ${img({ base: 'hero-lane', alt: 'A rider on a motorcycle coming down a quiet country lane', w: 2400, h: 1357, sizes: '100vw', cls: 'hero__img', eager: true, focus: '66% 42%' })}
    <div class="wrap hero__in">
      <p class="eyebrow eyebrow--on-dark">${icon('shield')}DVSA approved · Bradford</p>
      <h1>Your first step to freedom.</h1>
      <p class="hero__lede">Expert instructors and flexible courses, from your first CBT to a full licence. Serving Bradford, Leeds, Halifax and Keighley.</p>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="${site.booking.cbt}">Book a CBT<span class="btn__sub">${site.cbtPrice}</span>${bookingNote}</a>
        <a class="btn btn--light btn--lg" href="#finder">${icon('compass')}Find my course</a>
      </div>
      <ul class="hero__points" role="list">
        <li>${icon('check')}30 years’ experience</li>
        <li>${icon('check')}Male and female instructors</li>
        <li>${icon('check')}Bikes, helmets and jackets provided</li>
      </ul>
    </div>
  </section>

  <section class="section" id="courses" aria-labelledby="courses-title">
    <div class="wrap">
      <div class="section__head section__head--split">
        <div>
          <p class="eyebrow">Courses</p>
          <h2 id="courses-title">Choose your course</h2>
          <p class="lede">From your very first ride to an unrestricted licence.</p>
        </div>
        <a class="link-arrow" href="/training/#compare">Compare all courses${icon('arrow')}</a>
      </div>
      ${courseGrid()}
    </div>
  </section>

  <div class="wrap">${finder()}</div>

  <section class="section" aria-labelledby="why-title">
    <div class="wrap why">
      <div class="why__media">
        ${img({ base: 'wales', alt: 'A group of motorcyclists riding a winding road through green hills', w: 640, h: 991, sizes: '(min-width: 900px) 40vw, 100vw', focus: '50% 60%' })}
      </div>
      <div class="why__body">
        <p class="eyebrow">Why Ridesafe</p>
        <h2 id="why-title">Yorkshire’s most loved motorcycle school</h2>
        ${site.about.map((p) => `<p class="lede">${esc(p)}</p>`).join('')}
        ${trustGrid()}
      </div>
    </div>
  </section>

  <section class="section section--alt" aria-labelledby="reviews-title">
    <div class="wrap">
      <div class="section__head section__head--split">
        <div>
          <p class="eyebrow">Reviews</p>
          <h2 id="reviews-title">What our riders say</h2>
        </div>
        <a class="link-arrow" href="/reviews/">Read all ${reviews.length} reviews${icon('arrow')}</a>
      </div>
      <ul class="reviews reviews--home" role="list">${featured.map((r) => reviewCard(r)).join('')}</ul>
    </div>
  </section>

  <section class="section" aria-labelledby="steps-title">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">Booking</p>
        <h2 id="steps-title">Booking a CBT takes two minutes</h2>
      </div>
      <ol class="steps" role="list">
        <li><span class="steps__n">1</span><h3>Pick a date online</h3><p>See every available day and choose the one that suits you.</p></li>
        <li><span class="steps__n">2</span><h3>Confirm by email</h3><p>Enter your email, type in the six-digit code we send you, and you’re booked.</p></li>
        <li><span class="steps__n">3</span><h3>Turn up and ride</h3><p>Bring your licence and sturdy boots. We provide the bike, helmet and jacket.</p></li>
      </ol>
      <div class="btn-row btn-row--center">
        <a class="btn btn--primary btn--lg" href="${site.booking.cbt}">Book a CBT online${icon('arrow')}${bookingNote}</a>
        <a class="btn btn--ghost btn--lg" href="/book/">Booking something else?</a>
      </div>
    </div>
  </section>

  <section class="section section--alt" id="faq" aria-labelledby="faq-title">
    <div class="wrap faq-wrap">
      <div class="section__head">
        <p class="eyebrow">FAQs</p>
        <h2 id="faq-title">Questions riders ask</h2>
        <p class="lede">Can’t see yours? <a href="${waLink('Hi Ridesafe, I have a question.')}">Message us on WhatsApp</a> or call ${site.phone}.</p>
      </div>
      ${faqList(homeFaqs)}
    </div>
  </section>

  ${visitBand()}`;
}

function visitBand() {
  return `
  <section class="visit" aria-labelledby="visit-title">
    <div class="wrap visit__in">
      <div>
        <p class="eyebrow eyebrow--on-dark">Visit</p>
        <h2 id="visit-title">Find us in Bradford</h2>
        <address class="visit__addr">${site.address.street}<br>${site.address.town} ${site.address.postcode}</address>
        <p class="visit__hours">${icon('clock')}<span>${site.hours.label}<br>${hoursStatus('status--on-dark')}</span></p>
        <p class="visit__note">${site.appointmentNote}</p>
      </div>
      <div class="visit__actions">
        <a class="btn btn--light btn--lg" href="${site.maps.google}">${icon('route')}Get directions</a>
        <a class="btn btn--light btn--lg" href="${site.phoneHref}">${icon('phone')}Call ${site.phone}</a>
        <a class="btn btn--light btn--lg" href="${site.whatsappHref}">${icon('whatsapp', 'i-wa')}WhatsApp us</a>
        <a class="link-arrow link-arrow--on-dark" href="/find-us/">Map and opening hours${icon('arrow')}</a>
      </div>
    </div>
  </section>`;
}

export function training() {
  return `
  ${pageHead({
    crumbs: [['Home', '/'], ['Courses', '/training/']],
    eyebrow: 'Motorcycle training',
    title: 'Find the right course',
    lede: 'Not sure which training you need? Use the licence finder, see how licences fit together, or compare every course side by side.',
    extra: `<div class="btn-row"><a class="btn btn--primary" href="#finder">${icon('compass')}Which licence do I need?</a><a class="btn btn--ghost" href="#compare">Compare courses</a></div>`,
  })}
  <section class="section section--tight" aria-label="All courses">
    <div class="wrap">${courseGrid()}</div>
  </section>
  <div class="wrap">${finder()}</div>
  ${pathway()}
  ${compareTable()}
  ${ctaBand()}`;
}

function sectionBlock(s) {
  let html = '';
  for (const p of s.body ?? []) html += `<p>${p}</p>`;
  if (s.intro) html += `<p>${s.intro}</p>`;
  if (s.list) html += `<ul class="bullets">${s.list.map((li) => `<li>${li}</li>`).join('')}</ul>`;
  if (s.checklist) html += `<ul class="checklist" role="list">${s.checklist.map((li) => `<li>${icon('check')}<span>${li}</span></li>`).join('')}</ul>`;
  if (s.steps) html += `<ol class="timeline" role="list">${s.steps.map(([t, d], i) => `<li><span class="timeline__n">${i + 1}</span><div><h3>${t}</h3>${d ? `<p>${d}</p>` : ''}</div></li>`).join('')}</ol>`;
  if (s.cards) html += `<ul class="mini-cards" role="list">${s.cards.map(([t, d]) => `<li><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>`;
  if (s.after) html += `<p class="note">${icon('info')}<span>${s.after}</span></p>`;
  return `<section class="csec" id="${s.id}" aria-labelledby="${s.id}-title"><h2 id="${s.id}-title">${s.title}</h2>${html}</section>`;
}

function bookCard(c) {
  const wa = `Hi Ridesafe, I’m interested in ${c.long}. What dates do you have?`;
  if (c.book === 'online') {
    return `
    <div class="bookcard">
      <p class="bookcard__label">Book your CBT</p>
      <p class="bookcard__price">${site.cbtPrice}<span>${site.cbtPriceNote}</span></p>
      <a class="btn btn--primary btn--block btn--lg" href="${site.booking.cbt}">Choose a date${icon('arrow')}${bookingNote}</a>
      <p class="bookcard__small">Takes about two minutes. You confirm with a code sent to your email.</p>
      <a class="bookcard__alt" href="${site.booking.roadRide}">Only need the road ride (Element E)? Book it here${bookingNote}</a>
      <hr>
      <p class="bookcard__label">Questions first?</p>
      <div class="bookcard__btns">
        <a class="btn btn--ghost btn--block" href="${waLink(`Hi Ridesafe, I have a question about the CBT.`)}">${icon('whatsapp', 'i-wa')}WhatsApp</a>
        <a class="btn btn--ghost btn--block" href="${site.phoneHref}">${icon('phone')}Call</a>
      </div>
      ${hoursStatus()}
    </div>`;
  }
  return `
    <div class="bookcard">
      <p class="bookcard__label">Start your ${esc(c.menu)}</p>
      <p class="bookcard__lead">Tell us when suits you and we’ll come back with dates and prices.</p>
      <a class="btn btn--wa btn--block btn--lg" href="${waLink(wa)}">${icon('whatsapp')}Message on WhatsApp</a>
      <div class="bookcard__btns">
        <a class="btn btn--ghost btn--block" href="${site.phoneHref}">${icon('phone')}Call</a>
        <a class="btn btn--ghost btn--block" href="mailto:${site.email}?subject=${encodeURIComponent(`${c.long} enquiry`)}">${icon('mail')}Email</a>
      </div>
      ${hoursStatus()}
    </div>`;
}

export function course(c) {
  const wa = `Hi Ridesafe, I’m interested in ${c.long}. What dates do you have?`;
  const related = reviews.filter((r) => (c.slug === 'cbt' ? r.tags.includes('cbt') : c.slug === 'a2' ? r.tags.includes('a2') : r.tags.includes('full'))).slice(0, 3);
  const glance = factRows.map(([k, label]) => `<div><dt>${label}</dt><dd>${yesNo(c.facts[k])}</dd></div>`).join('');
  const toc = [['glance', 'At a glance'], ...c.sections.map((s) => [s.id, s.title])];
  const primary = c.book === 'online'
    ? `<a class="btn btn--primary btn--lg" href="${site.booking.cbt}">Book a CBT<span class="btn__sub">${site.cbtPrice}</span>${bookingNote}</a>`
    : `<a class="btn btn--wa btn--lg" href="${waLink(wa)}">${icon('whatsapp')}Enquire on WhatsApp</a>`;
  return `
  <section class="chero">
    <div class="wrap chero__in">
      <div class="chero__text">
        ${breadcrumbs([['Home', '/'], ['Courses', '/training/'], [c.name, `/training/${c.slug}/`]])}
        <p class="eyebrow">${c.slug === 'cbt' ? lPlate : ''}${esc(c.long)}</p>
        <h1>${esc(c.name)}</h1>
        <p class="lede">${esc(c.lede)}</p>
        <ul class="facts" role="list">
          <li><span>Age</span><strong>${esc(c.ageNote)}</strong></li>
          <li><span>L-plates</span><strong>${esc(c.facts.lPlates === '—' ? 'n/a' : c.facts.lPlates)}</strong></li>
          <li><span>Passengers</span><strong>${esc(c.facts.passenger === '—' ? 'n/a' : c.facts.passenger)}</strong></li>
        </ul>
        <div class="btn-row">
          ${primary}
          <a class="btn btn--ghost btn--lg" href="${site.phoneHref}">${icon('phone')}${site.phone}</a>
        </div>
      </div>
      <div class="chero__media">
        ${img({ base: `course-${c.slug}`, alt: `Ridesafe ${c.name} training`, w: 1200, h: 1600, sizes: '(min-width: 900px) 40vw, 100vw', eager: true, focus: c.focus })}
      </div>
    </div>
  </section>

  <nav class="jump" aria-label="On this page">
    <div class="wrap"><ul role="list">${toc.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul></div>
  </nav>

  <div class="wrap clayout">
    <article class="cbody">
      <section class="csec" id="glance" aria-labelledby="glance-title">
        <h2 id="glance-title">At a glance</h2>
        <dl class="glance">${glance}</dl>
      </section>
      ${c.sections.map(sectionBlock).join('')}
      ${related.length ? `
      <section class="csec" aria-labelledby="creviews-title">
        <h2 id="creviews-title">From riders who did it</h2>
        <ul class="reviews reviews--stack" role="list">${related.map((r) => reviewCard(r)).join('')}</ul>
        <a class="link-arrow" href="/reviews/">Read all reviews${icon('arrow')}</a>
      </section>` : ''}
    </article>
    <aside class="caside" aria-label="Booking">
      <div class="caside__sticky">
        ${bookCard(c)}
        <nav class="toc" aria-label="Sections">
          <p class="toc__title">On this page</p>
          <ul role="list">${toc.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul>
        </nav>
      </div>
    </aside>
  </div>

  <section class="section section--alt" aria-labelledby="next-title">
    <div class="wrap">
      <div class="section__head section__head--split">
        <div><p class="eyebrow">Where next</p><h2 id="next-title">${c.slug === 'refresher' ? 'Other courses' : 'Your next step'}</h2></div>
        <a class="link-arrow" href="/training/">All courses${icon('arrow')}</a>
      </div>
      ${courseGrid(c.next.map((s) => courseBySlug[s]))}
    </div>
  </section>`;
}

export function book() {
  const others = courses.filter((c) => c.book !== 'online');
  return `
  ${pageHead({
    crumbs: [['Home', '/'], ['Book', '/book/']],
    eyebrow: 'Book online',
    title: 'What would you like to book?',
    lede: 'CBT days and CBT road rides are booked online. For everything else, send us a message and we’ll reply with dates and prices.',
  })}
  <section class="section section--tight">
    <div class="wrap">
      <ul class="options" role="list">
        <li class="option option--main">
          <div class="option__head">
            <span class="option__icon">${lPlate}</span>
            <div><h2>CBT (full day)</h2><p class="option__meta">Age 16+ · ${site.cbtPrice} standard day</p></div>
          </div>
          <p>Your first step: one day of training, and you leave able to ride on L-plates. Bikes, helmets and jackets are provided.</p>
          <ul class="checklist checklist--tight" role="list">
            <li>${icon('check')}<span>Pick a date from every available day</span></li>
            <li>${icon('check')}<span>Confirm with a six-digit code sent to your email</span></li>
          </ul>
          <p class="muted option__fine">${esc(site.cbtPriceNote)}</p>
          <div class="btn-row">
            <a class="btn btn--primary btn--lg" href="${site.booking.cbt}">Book a CBT online${icon('arrow')}${bookingNote}</a>
            <a class="link-arrow" href="/training/cbt/">About the CBT${icon('arrow')}</a>
          </div>
        </li>
        <li class="option">
          <div class="option__head">
            <span class="option__icon">${icon('route')}</span>
            <div><h2>CBT road ride only (Element E)</h2><p class="option__meta">For riders finishing a CBT with us</p></div>
          </div>
          <p>Done the rest of your CBT with us but still need the road ride? Book just that part here. <strong>This doesn’t book a full CBT.</strong></p>
          <div class="btn-row">
            <a class="btn btn--dark" href="${site.booking.roadRide}">Book a road ride${icon('arrow')}${bookingNote}</a>
          </div>
        </li>
        <li class="option">
          <div class="option__head">
            <span class="option__icon">${icon('bike')}</span>
            <div><h2>Licence and refresher training</h2><p class="option__meta">A1, A2, DAS, progressive access, refresher</p></div>
          </div>
          <p>Tell us which course and when suits you. We’ll check what you need and reply with dates and prices.</p>
          <div class="enquire" data-enquire>
            <label for="enquire-course">Course</label>
            <div class="select">
              <select id="enquire-course">
                ${others.map((c) => `<option value="${esc(c.long)}">${esc(c.menu)}</option>`).join('')}
                <option value="training">Not sure yet</option>
              </select>
              ${icon('chevron')}
            </div>
          </div>
          <div class="btn-row">
            <a class="btn btn--wa" data-enquire-wa href="${waLink('Hi Ridesafe, I’m interested in licence training. What dates do you have?')}">${icon('whatsapp')}Message on WhatsApp</a>
            <a class="btn btn--ghost" href="${site.phoneHref}">${icon('phone')}Call ${site.phone}</a>
            <a class="btn btn--ghost" data-enquire-mail href="mailto:${site.email}?subject=Training%20enquiry">${icon('mail')}Email</a>
          </div>
        </li>
      </ul>
      <p class="help">${icon('compass')}<span>Not sure which course is right? <a href="/training/#finder">Use the licence finder</a>. We’re open ${site.hours.label}. ${hoursStatus()}</span></p>
    </div>
  </section>`;
}

export function findUs() {
  const days = [['Monday', 1], ['Tuesday', 2], ['Wednesday', 3], ['Thursday', 4], ['Friday', 5], ['Saturday', 6], ['Sunday', 0]];
  return `
  ${pageHead({
    crumbs: [['Home', '/'], ['Find us', '/find-us/']],
    eyebrow: 'Contact',
    title: 'Contact and find us',
    lede: `Get in touch to find out which course suits you. ${site.appointmentNote}`,
  })}
  <section class="section section--tight">
    <div class="wrap findus">
      <div class="findus__contact">
        <div class="panel">
          <h2>Talk to us</h2>
          <p>Message us on WhatsApp, give us a call or send an email. Our instructors are happy to help you get started.</p>
          <div class="stack">
            <a class="btn btn--wa btn--lg btn--block" href="${waLink('Hi Ridesafe, I have a question about training.')}">${icon('whatsapp')}Message on WhatsApp</a>
            <a class="btn btn--ghost btn--lg btn--block" href="${site.phoneHref}">${icon('phone')}Call ${site.phone}</a>
            <a class="btn btn--ghost btn--lg btn--block" href="mailto:${site.email}">${icon('mail')}${site.email}</a>
          </div>
        </div>
        <div class="panel" id="hours">
          <h2>Opening hours</h2>
          <p>${hoursStatus()}</p>
          <table class="hours">
            <tbody>${days.map(([d, n]) => `<tr data-day="${n}"><th scope="row">${d}</th><td>${site.hours.days.includes(n) ? '8am – 5pm' : 'Closed'}</td></tr>`).join('')}</tbody>
          </table>
          <p class="muted">${site.appointmentNote}</p>
        </div>
        <div class="panel">
          <h2>Follow us</h2>
          <div class="social social--dark">
            <a class="btn btn--ghost" href="${site.instagram}">${icon('instagram')}Instagram</a>
            <a class="btn btn--ghost" href="${site.facebook}">${icon('facebook')}Facebook</a>
          </div>
        </div>
      </div>
      <div class="findus__map">
        <div class="panel panel--flush">
          <div class="map" data-map="${site.maps.embed}">
            <img class="map__img" src="/img/map.webp" width="800" height="520" alt="Street map showing Ridesafe at 148 Broadstone Way, Bradford" loading="lazy" decoding="async">
            <span class="map__pin" aria-hidden="true">${icon('pin')}</span>
            <button class="btn btn--light btn--sm map__load js-only" type="button">Show interactive map</button>
            <span class="map__credit">© OpenStreetMap contributors</span>
          </div>
          <div class="map__info">
            <address><strong>${site.fullName}</strong><br>${site.address.street}, ${site.address.town}<br>${site.address.region} ${site.address.postcode}</address>
            <button class="btn btn--ghost btn--sm js-only" type="button" data-copy="${site.address.street}, ${site.address.town} ${site.address.postcode}">Copy address</button>
          </div>
          <div class="dirs">
            <a class="btn btn--ghost" href="${site.maps.google}">${icon('googlemaps')}Google Maps</a>
            <a class="btn btn--ghost" href="${site.maps.apple}">${icon('apple')}Apple Maps</a>
            <a class="btn btn--ghost" href="${site.maps.waze}">${icon('waze')}Waze</a>
          </div>
        </div>
        <div class="panel">
          <h2>Areas we cover</h2>
          <p>We train riders from across West Yorkshire, including:</p>
          <ul class="areas" role="list">${site.areas.map((a) => `<li>${icon('pin')}${a}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
  </section>`;
}

export function reviewsPage() {
  const count = (tag) => (tag === 'all' ? reviews.length : reviews.filter((r) => r.tags.includes(tag)).length);
  return `
  ${pageHead({
    crumbs: [['Home', '/'], ['Reviews', '/reviews/']],
    eyebrow: 'Reviews',
    title: 'What our riders say',
    lede: 'Real words from riders who trained with Big Steve, Susi, Rick, Pete, Cliff and the team.',
  })}
  <section class="section section--tight">
    <div class="wrap">
      <div class="filters js-only" role="group" aria-label="Filter reviews">
        ${reviewFilters.map(([v, l], i) => `<button class="filter" type="button" data-filter="${v}" aria-pressed="${i === 0}">${l}<span>${count(v)}</span></button>`).join('')}
      </div>
      <ul class="reviews" role="list" data-reviews>${reviews.map((r) => reviewCard(r)).join('')}</ul>
      <p class="sr-only" role="status" aria-live="polite" data-reviews-status></p>
    </div>
  </section>
  ${ctaBand({ title: 'Join them', text: 'Book your CBT online, or message us about A1, A2, DAS and refresher training.' })}`;
}

export function friendsPage() {
  return `
  ${pageHead({
    crumbs: [['Home', '/'], ['Our friends', '/meet-our-friends/']],
    eyebrow: 'Community',
    title: 'Our friends',
    lede: 'We’re proud to support and work alongside great local organisations.',
  })}
  <section class="section section--tight">
    <div class="wrap">
      <ul class="friends" role="list">${friends.map((f) => `
        <li class="friend">
          <div class="friend__logo"><img src="/img/${f.img}.webp" width="${f.w}" height="${f.h}" alt="" loading="lazy" decoding="async"></div>
          <div class="friend__body">
            <h2><a href="${f.url}">${esc(f.name)}</a></h2>
            <p>${esc(f.text)}</p>
            <span class="ccard__more" aria-hidden="true">${f.url.startsWith('mailto:') ? 'Get in touch' : 'Visit website'}${icon('external')}</span>
          </div>
        </li>`).join('')}
      </ul>
    </div>
  </section>`;
}

export function notFound() {
  return `
  <section class="phead phead--center">
    <div class="wrap">
      <p class="eyebrow">Error 404</p>
      <h1>We can’t find that page</h1>
      <p class="lede">It may have moved. Try a search, or pick up from one of these.</p>
      <div class="btn-row btn-row--center">
        <button class="btn btn--primary js-only" type="button" data-open-search>${icon('search')}Search the site</button>
        <a class="btn btn--ghost" href="/">Home</a>
        <a class="btn btn--ghost" href="/training/">Courses</a>
        <a class="btn btn--ghost" href="/book/">Book</a>
      </div>
    </div>
  </section>`;
}
