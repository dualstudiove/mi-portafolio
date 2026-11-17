/* ==========================================================================
   Portfolio app: tiny hash router + HTML templates.
   Content comes from data.js.
   ========================================================================== */

/* ---------- Helpers ---------- */

const $ = (sel) => document.querySelector(sel);
const app = $('#app');

const ARROW = '<span class="ar">→</span>';
const EYE_ICON =
  '<span class="hid-i"><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg></b></span>';

const img = (name) => `images/${name}.jpg`;
const num = (n) => n.toLocaleString('en-US');
const usd = (n) => '$' + num(Math.round(n));
const usdK = (n) => (n >= 1000 ? '$' + (n / 1000).toFixed(n >= 1e5 ? 0 : 1) + 'K' : usd(n));
const times = (n) => n.toFixed(2) + 'x';
const roas = (ad) => ad.rev / ad.spend;

/** Totals for the given SkinUp campaign groups. */
function skinupTotals(groups) {
  const ads = SKINUP_ADS.filter((a) => groups.includes(a.g));
  const spend = ads.reduce((s, a) => s + a.spend, 0);
  const rev = ads.reduce((s, a) => s + a.rev, 0);
  const buys = ads.reduce((s, a) => s + a.buys, 0);
  return { spend, rev, buys, roas: rev / spend };
}

function toast(message) {
  const t = $('#toast');
  t.textContent = message;
  t.classList.add('on');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ---------- Components ---------- */

/** Generated placeholder ad (for projects without real creative). */
const SHAPES = ['orb', 'arch', 'ring', 'bars'];
const LAYOUTS = ['a', 'b', 'c'];

function placeholderAd(o) {
  const [bg, fg, a1, a2] = PALETTES[o.p || 0];
  return `<div class="ad l-${o.l || 'a'} s-${o.s || 'orb'}" style="--bg:${bg};--fg:${fg};--a1:${a1};--a2:${a2};aspect-ratio:4/5" role="img" aria-label="Placeholder ad: ${o.h}"><span class="ad-brand">${o.b}</span><i class="ad-shape"></i><span class="ad-hl">${o.h}</span><span class="ad-cta">${o.c || 'Shop now'}</span></div>`;
}

/** Three variations of a placeholder ad, for a project folder. */
const placeholderSet = (o) =>
  [1, 0, 2].map((k) =>
    placeholderAd({
      ...o,
      p: (o.p + 3 * k) % 9,
      s: SHAPES[(SHAPES.indexOf(o.s) + k) % 4],
      l: LAYOUTS[(LAYOUTS.indexOf(o.l) + k) % 3],
    })
  );

const hiddenAd = (id) => `<span class="hid"><img src="${img(id)}" alt="Hidden SkinUp ad (NDA)">${EYE_ICON}</span>`;
const openAd = (id) => `<img src="${img(id)}" alt="" style="object-position:50% 22%">`;

/** Ads shown in a case folder (SkinUp is blurred). */
const folderAds = (caseId) => FOLDER_ADS[caseId].map(caseId === 'skinup' ? hiddenAd : openAd);

function folder(flag, ads, extra = '') {
  return `<div class="fdw"><div class="fold">${extra}<span class="fold-back"></span>
    <div class="fold-ads">${ads.map((h, i) => `<div class="fa a${i + 1}">${h}</div>`).join('')}</div>
    <div class="fold-front"><span class="fold-flag">${flag}</span></div></div></div>`;
}

function laptop(extra, cover, alt) {
  return `<div class="fdw"><div class="fold lap">${extra}<div class="lap-lid"><div class="lap-scr"><img class="lap-cover" src="${img(cover)}" alt="${alt}"></div></div><span class="lap-base"></span></div></div>`;
}

function phone(extra, cover, alt) {
  return `<div class="fdw"><div class="fold lap">${extra}<div class="ph-body"><div class="ph-scr"><img class="lap-cover" src="${img(cover)}" alt="${alt}"><i class="ph-isl"></i></div></div></div></div>`;
}

function chipRow(list, current, attr, count) {
  return `<div class="chips" role="group" aria-label="Filter">${list
    .map((c) => `<button class="chip" ${attr}="${c}" aria-pressed="${c === current}">${c}<em>${count(c)}</em></button>`)
    .join('')}</div>`;
}

const emojiChips = (list) => list.map(([e, label]) => `<span class="ind"><span class="e">${e}</span>${label}</span>`).join('');

const ctaBlock = () => `<div class="eyebrow">Let's talk</div><h2 class="h-lg">Sounds like a good fit? <em class="pkem">Say hello.</em></h2>
    <p class="lead mute">Tell me about your brand and where your ads are stuck. I reply within one business day.</p>
    <div class="actions"><a class="btn primary" href="#contact">Contact me ${ARROW}</a></div>`;

/* ---------- Gallery (shared by the gallery page and case studies) ---------- */

/** Every ad in one list: SkinUp (by purchases) interleaved with the other brands. */
function galleryItems() {
  const skinup = [...SKINUP_ADS]
    .sort((a, b) => b.buys - a.buys)
    .map((a) => {
      const type = a.type || 'Offer';
      return { brand: 'SkinUp', name: a.name, img: a.id, ratio: '4/5', hidden: true, type, ind: BRANDS.SkinUp.industry };
    });
  const others = OTHER_ADS.map((a) => ({ brand: a.b, name: a.n, img: a.f, ratio: a.r, type: a.t, ind: BRANDS[a.b].industry }));

  const out = [];
  for (let i = 0; i < Math.max(skinup.length, others.length); i++) {
    if (skinup[i]) out.push(skinup[i]);
    if (others[i]) out.push(others[i]);
  }
  return out;
}

function galleryCard(a) {
  const alt = a.hidden ? 'Hidden SkinUp ad (NDA)' : `${a.brand} ad: ${a.name}`;
  return `<figure class="gc"><div class="gc-img" style="aspect-ratio:${a.ratio}"><img src="${img(a.img)}" alt="${alt}" loading="lazy">${a.hidden ? EYE_ICON : ''}</div>
  <figcaption><b class="gc-n">${a.name}</b><span class="gc-g">${BRANDS[a.brand].flag} ${a.brand} · ${a.type}</span></figcaption></figure>`;
}

const masonryColumns = () => (innerWidth > 1100 ? 4 : innerWidth > 760 ? 3 : 2);
let lastColumns = 0;

/** Distributes cards into columns, always adding to the shortest one. */
function masonry(items) {
  lastColumns = masonryColumns();
  const cols = Array.from({ length: lastColumns }, () => ({ h: 0, html: '' }));
  items.forEach((a) => {
    const [w, h] = a.ratio.split('/').map(Number);
    const col = cols.reduce((min, c) => (c.h < min.h ? c : min), cols[0]);
    col.h += (250 * h) / w + 64 + 16;
    col.html += galleryCard(a);
  });
  return cols.map((c) => `<div class="mcol">${c.html}</div>`).join('');
}

/* ---------- Page state ---------- */

const state = { work: 'All', galMode: 'type', galValue: 'All' };

/* ---------- Views ---------- */

function viewHome() {
  const t = skinupTotals(['hs', 'bf']);
  const stats = [
    [usdK(t.spend), 'Ad spend', 'behind my designs'],
    [(t.buys / 1000).toFixed(1) + 'K', 'Purchases', 'from ads I designed'],
    [times(t.roas), 'ROAS', 'held at that scale'],
  ];
  const heroAds = HERO_ADS.map(
    (a) =>
      `<span class="hf" style="left:${a.left};top:${a.top}px;--r:${a.r}deg;--dp:${a.dp};--d:${a.d}ms"><span class="hfi"><img src="${img(a.img)}" alt="">${a.hidden ? EYE_ICON : ''}</span></span>`
  ).join('');
  const otherCases = [
    ['FitBee', '🇺🇸', 'fitbee'],
    ['Wellwear Socks', '🇬🇧', 'wellwear'],
  ];

  return `
  <section class="hero2"><div class="wrap">
    <p class="hello"><span>Hello</span><b class="av" role="img" aria-label="Photo placeholder">DF</b><span>I'm Dariela</span></p>
    <h1 class="h-xl hl" aria-label="I design static ads that turn scrolls into sales.">I design static ads that turn scrolls into&nbsp;<em>sales</em>.</h1>
    <p class="sub">Performance creative designer for <b>DTC brands</b> across <b>LATAM, the US and the UK</b>.</p>
    <span class="avail"><i></i>Available for remote work · LATAM time zone</span>
    <div class="actions"><a class="btn primary" href="#work">See the work ${ARROW}</a></div>
  </div>
  <div class="hads" aria-hidden="true">${heroAds}</div></section>

  <section class="sec dark home-bring"><div class="wrap">
    <div class="shead"><div><div class="eyebrow">What I bring</div><h2 class="h-lg">Results first, then the&nbsp;pixels.</h2></div></div>
    <div class="stats3">${stats.map(([n, label, sub]) => `<div class="st3"><b>${n}</b><strong>${label}</strong><span>${sub}</span></div>`).join('')}</div>
    <div class="svc"><span class="svc-t">What I do</span>${emojiChips(SERVICES)}</div>
    <a class="link story-link" href="#about">Read the full story ${ARROW}</a>
  </div></section>

  <section class="sec home-proof"><div class="wrap">
    <div class="shead"><div><div class="eyebrow">The proof</div><h2 class="h-lg">Where it got real.</h2></div><a class="link" href="#work">All work</a></div>
    <div class="fcards">
      <a class="fcard" href="#case-skinup">${folder('🇲🇽', folderAds('skinup'))}
        <h3>SkinUp México</h3>
        <p class="fc-sub"><span><b class="pk">${times(t.roas)}</b> ROAS</span><span><b>${usdK(t.spend)}</b> spend</span><span><b>${num(t.buys)}</b> purchases</span></p></a>
      ${otherCases
        .map(
          ([name, flag, id]) => `
      <a class="fcard" href="#case-${id}">${folder(flag, folderAds(id))}
        <h3>${name}</h3><p class="fc-sub">Static ads · Case study</p></a>`
        )
        .join('')}
    </div>
  </div></section>

  <section class="sec dark"><div class="wrap">
    <div class="shead"><div><div class="eyebrow">How I think</div><h2 class="h-lg">How a number becomes a better ad.</h2></div></div>
    <div class="flow">${PROCESS.map(([icon, title, text], i) => `<div class="fnode"><div class="fico">${icon}</div><span class="n">0${i + 1}</span><h3>${title}</h3><p>${text}</p></div>`).join('')}</div>
    <div class="floop"></div><p class="floop-t">↻ Every result feeds the next round</p>
    <div class="proc-note"><i></i><p>Media buying stays with your team. I turn the numbers into creative decisions.</p></div>
  </div></section>

  <section class="sec tm-sec"><div class="wrap">
    <div class="tms">${REVIEWS.map(
      (r) =>
        `<figure class="tm${r.q ? '' : ' tm-empty'}"><span class="tm-q">“</span><blockquote>${r.q || 'Your client’s words go here: one or two lines about what changed after working with you.'}</blockquote><figcaption><span class="tm-av">${r.who.charAt(0)}</span><span><b>${r.who}</b><small>${r.role}</small></span></figcaption>${r.q ? '' : '<span class="tm-ph">Placeholder</span>'}</figure>`
    ).join('')}</div>
    <p class="tm-more">More kind words from people I’ve worked with. <a class="link" href="${CONTACT.linkedin}" target="_blank" rel="noopener">Read them on LinkedIn ↗</a></p>
    <div class="cta-home">${ctaBlock()}</div>
  </div></section>`;
}

function viewAbout() {
  const projects = (x) =>
    x.proj
      ? `<div class="xproj">${x.proj
          .map((p) => `<a class="xp" href="${p.href}"><span class="rimg-wrap"><img src="${img(p.img)}" alt="">${p.hidden ? EYE_ICON : ''}</span><span><b>${p.label}</b><small>${p.sub} →</small></span></a>`)
          .join('')}</div>`
      : '';
  const timeline = EXPERIENCE.map((x) => {
    const [from, to] = x.when.split(' – ');
    return `<div class="tli${x.current ? ' now' : ''}"><div class="tl-when"><b>${from}</b><span>${to}</span></div><div class="tl-rail"><i></i></div><article class="chap"><div class="chead"><span class="xkind">${x.kind}</span></div>
      <p class="xlead">${x.lead}</p><h3>${x.role}</h3><p class="xco">${x.co}</p><ul class="xul">${x.pts.map((p) => `<li>${p}</li>`).join('')}</ul>
      <div class="xtags">${x.tags.map((t) => `<span class="pill">${t}</span>`).join('')}</div>${projects(x)}</article></div>`;
  }).join('');

  return `<section class="pagehead"><div class="wrap"><div class="eyebrow">About</div><h1 class="h-xl">I started with pixels.<br>Now I design for <em class="pkem">results</em>.</h1>
    <p class="lead mute wide">Hi, I'm Dariela, a Performance Creative Designer with 5+ years across social media, UX/UI and paid ads. I'm proactive, detail-oriented and happy to lead the creative work, remote-first from LATAM.</p>
    <div class="inds glance">${emojiChips([['🗓️', '5+ years designing'], ['🌎', 'Brands in 🇲🇽 🇺🇸 🇬🇧'], ['⏱️', 'Remote · UTC−5']])}</div></div></section>

  <section class="sec dark"><div class="wrap"><div class="shead"><div><div class="eyebrow">The story so far</div><h2 class="h-lg">Five roles, five lessons.</h2></div></div>
    <div class="tline">${timeline}</div>
    <p class="tl-sub">Along the way <span>Where the foundations come from</span></p>
    <div class="edgrid">
      <article class="edc big"><span class="edi">🎓</span><small>Education</small><h3>Bachelor's degree, Graphic Design</h3><p class="edsch">Universidad Rafael Belloso Chacín</p>
        <div class="edtl"><b>2019</b><span><i></i></span><b>2023</b></div>
        <p class="edtx">Foundations in branding and advertising design, plus UX/UI principles for web and mobile platforms.</p>
        <p class="edlinks"><a class="chipl" href="https://www.urbe.edu" target="_blank" rel="noopener">🌐 Website ↗</a><a class="chipl" href="https://www.instagram.com/infourbe" target="_blank" rel="noopener">📸 Instagram ↗</a></p></article>
      <article class="edc"><span class="edi">🏅</span><small>Certification</small><h3>English as a Foreign Language</h3><p class="edsch">CEVAZ</p>
        <div class="badge"><b>✓</b><span>Certified<br><em>February 2026</em></span></div></article>
      <article class="edc"><span class="edi">🗣️</span><small>Languages</small><h3>I work in both.</h3>
        <div class="langs"><div class="lang"><span class="lf">🇪🇸</span><b>Spanish</b><em>Native</em></div><div class="lang"><span class="lf">🇺🇸</span><b>English</b><em>Certified</em></div></div></article>
    </div>
  </div></section>

  <section class="sec soft"><div class="wrap"><div class="shead"><div><div class="eyebrow">The toolbox</div><h2 class="h-lg">What I reach for.</h2></div></div>
    <p class="lead mute">Figma and Photoshop for the craft. AI for speed, data analysis and a second pair of eyes on copy.</p>
    <p class="tl">Main tools</p>
    <div class="tgrid">${MAIN_TOOLS.map(
      ([icon, name, text, tags]) =>
        `<div class="tool"><span class="te">${icon}</span><b>${name}</b><span>${text}</span>${tags ? `<div class="ttags">${tags.map((n) => `<i>${n}</i>`).join('')}</div>` : ''}</div>`
    ).join('')}</div>
    <p class="tl">Also work with</p><div class="inds">${emojiChips(OTHER_TOOLS)}</div>
    <p class="tl">Project management &amp; communication</p><div class="inds">${emojiChips(TEAM_TOOLS)}</div>
    <p class="tl">Skills</p><div class="inds">${SKILLS.map((k) => `<span class="ind">${k}</span>`).join('')}</div>
  </div></section>

  <section class="sec dark cta-end"><div class="wrap">${ctaBlock()}</div></section>`;
}

const workCount = (cat) => PROJECTS.filter((p) => cat === 'All' || p.cat === cat).length;

function workGrid() {
  return PROJECTS.filter((p) => state.work === 'All' || p.cat === state.work)
    .sort((a, b) => (b.feat ? 1 : 0) - (a.feat ? 1 : 0))
    .map((p) => {
      const sub = [p.flag ? `${p.flag} ${p.cty}` : '', p.cat, p.ind].filter(Boolean).join(' • ');
      const tags =
        p.feat || p.nda
          ? `<div class="ttag">${p.feat ? '<span class="feat">Featured</span>' : ''}${p.nda ? '<span class="nda-tag">NDA</span>' : ''}</div>`
          : '';
      const href = p.case ? `#case-${p.case}` : '#work';
      const soon = p.case ? '' : ' data-soon="Case study not included in this prototype"';

      let visual;
      if (p.device === 'phone') visual = phone(tags, p.cover, `${p.t} app`);
      else if (p.cover) visual = laptop(tags, p.cover, `${p.t} interface`);
      else visual = folder('', p.case ? folderAds(p.case) : placeholderSet(p.o), tags);

      return `<a class="fcard" href="${href}"${soon}>${visual}<h3>${p.t}</h3><p class="fc-sub">${sub}</p></a>`;
    })
    .join('');
}

function viewWork() {
  return `<section class="pagehead"><div class="wrap"><div class="eyebrow">Work</div><h1 class="h-xl">Selected projects</h1><p class="lead mute">Paid ads are the core of my work. Social media, UX/UI and graphic design show how I got here.</p></div></section>
  <section class="wsec"><div class="wrap"><div id="wchips">${chipRow(WORK_CATEGORIES, state.work, 'data-wf', workCount)}</div><p class="cnt" id="wcnt">${workCount(state.work)} projects</p><div class="wgrid" id="wgrid">${workGrid()}</div></div></section>`;
}

function galleryChips() {
  const all = galleryItems();
  const byType = state.galMode === 'type';
  const list = byType ? GALLERY_TYPES : GALLERY_INDUSTRIES;
  const key = byType ? 'type' : 'ind';
  return `<div class="gmode" role="group" aria-label="Filter by"><span class="fl">Filter by</span><button class="gm" data-gm="type" aria-pressed="${byType}">Type</button><button class="gm" data-gm="ind" aria-pressed="${!byType}">Industry</button></div>
  ${chipRow(list, state.galValue, 'data-gv', (c) => all.filter((a) => c === 'All' || a[key] === c).length)}`;
}

function galleryGrid() {
  const key = state.galMode === 'type' ? 'type' : 'ind';
  const items = galleryItems().filter((a) => state.galValue === 'All' || a[key] === state.galValue);
  return items.length ? masonry(items) : '<p class="gempty">No ads here yet.</p>';
}

function viewGallery() {
  return `<section class="pagehead"><div class="wrap"><div class="eyebrow">Ad Gallery</div><h1 class="h-xl">Ads that make you stop <em class="pkem">scrolling</em>.</h1><p class="lead mute wide">A visual archive of the static ads I've designed for SkinUp México, FitBee and Wellwear. Browse by type or by industry. SkinUp's creative stays hidden under NDA; the numbers live in its case study.</p></div></section>
  <section class="wsec"><div class="wrap"><div id="gchips">${galleryChips()}</div><div class="masonry" id="gmas">${galleryGrid()}</div></div></section>`;
}

const caseNav = (id, name) =>
  `<div class="cs-nav"><a href="#work"><small>← Back</small><strong>All work</strong></a><a href="#case-${id}"><small>Next case →</small><strong>${name}</strong></a></div>
    <div class="cs-end"></div>`;

function viewCaseSimple(id) {
  const c = CASES[id];
  return `<section class="cs-hero"><div class="wrap">
    <a class="crumb" href="#work">← Back to work</a>
    <div class="pills">${c.pills.map((p) => `<span class="pill">${p}</span>`).join('')}</div>
    <h1 class="h-xl">${c.name}</h1>
    <p class="lead">${c.lead}</p>
    <dl class="meta">${c.meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
  </div></section>
  <div class="wrap">
    <section class="sk-sec intro"><div class="eyebrow">01 The brief</div><h2>What the ads had to do</h2><p class="sk-sub">${c.brief}</p></section>
    <section class="sk-sec"><div class="eyebrow">02 The angles</div><h2>${c.angles.length} ways to say it</h2>
      <ul class="ulist">${c.angles.map(([k, v]) => `<li><span><b>${k}.</b> ${v}</span></li>`).join('')}</ul></section>
    <section class="sk-sec"><div class="eyebrow">03 The ads</div><h2>${c.flag} ${c.brand} static ads</h2>
      <div class="masonry" id="cmas" data-brand="${c.brand}">${masonry(galleryItems().filter((a) => a.brand === c.brand))}</div></section>
    ${caseNav(...c.next)}
  </div>`;
}

function viewCaseSkinup() {
  const hs = skinupTotals(['hs']);
  const bf = skinupTotals(['bf']);
  const hsAds = SKINUP_ADS.filter((a) => a.g === 'hs');
  const bfAds = SKINUP_ADS.filter((a) => a.g === 'bf');
  const ranked = [...hsAds, ...bfAds].sort((a, b) => roas(b) - roas(a));
  const best = roas(ranked[0]);

  const mini = (a) =>
    `<figure class="gc"><div class="gc-img" style="aspect-ratio:4/5"><img src="${img(a.id)}" alt="Hidden SkinUp ad (NDA)" loading="lazy">${EYE_ICON}</div><figcaption><b class="gc-n">${a.name}</b>${a.mine ? '<span class="mine">My own concept</span>' : ''}<span class="gc-m"><span>${num(a.buys)} <small>purchases</small></span><span class="rx">${times(roas(a))} <small>ROAS</small></span></span></figcaption></figure>`;

  const bars = ranked
    .map((a) => `<div class="rb"><span class="rb-t"><img src="${img(a.id)}" alt=""></span><span class="rb-n">${a.name}</span><span class="rb-bar"><i class="${a.g}" style="width:${((roas(a) / best) * 100).toFixed(1)}%"></i></span><b>${times(roas(a))}</b></div>`)
    .join('');

  const resultCol = (label, t, note, cls = '') =>
    `<div class="rcol ${cls}"><small>${label}</small><b class="big">${times(t.roas)}</b><em>ROAS</em><div class="rst"><span><b>${num(t.buys)}</b> purchases</span><span><b>${usdK(t.spend)}</b> spend</span></div><p>${note}</p></div>`;

  return `<section class="cs-hero"><div class="wrap">
    <a class="crumb" href="#work">← Back to work</a>
    <div class="pills"><span class="pill">Paid Ads</span><span class="pill">Beauty</span><span class="pill">Mexico · LATAM</span><span class="pill nda">Creative hidden (NDA)</span></div>
    <h1 class="h-xl">SkinUp México</h1>
    <p class="lead narrow">Loose brief in Hot Sale, structured brief in Buen Fin. I designed the ads that convert in both.</p>
    <dl class="meta"><div><dt>My role</dt><dd>Performance Creative Designer</dd></div><div><dt>What I did</dt><dd>Exploration, structure and design</dd></div><div><dt>Period</dt><dd>May to November 2026</dd></div></dl>
  </div></section>
  <div class="wrap">
    <div class="resx">
      <div class="resx-h"><span class="eyebrow">The result</span><span class="resx-n">Cumulative data to Nov 15, 2026</span></div>
      <div class="resx-g">
        ${resultCol('Hot Sale · May 2026', hs, 'Best concepts shown')}
        <span class="rarrow" aria-hidden="true">→</span>
        ${resultCol('Buen Fin · Nov 2026 <i>Still running</i>', bf, 'Built on a structured brief', 'pk')}
      </div>
    </div>
    <section class="sk-sec after-result"><div class="eyebrow">My part</div><h2>What I did</h2>
      <div class="did">${SKINUP_STEPS.map(([title, text], n) => `<div class="dc"><span class="dn">0${n + 1}</span><b>${title}</b><p>${text}</p></div>`).join('')}</div>
      <p class="dnote">Media buying stayed with the brand's team. I turned the numbers into creative decisions.</p></section>
    <section class="sk-sec"><div class="eyebrow">Round 1 · Hot Sale</div><h2>Testing everything, one May</h2>
      <p class="sk-sub">The brand’s brief was open, so I gathered references from everywhere and tested many different ideas. These are the best performers.</p>
      <div class="cgrid">${hsAds.map(mini).join('')}</div></section>
    <section class="sk-sec"><div class="eyebrow">Round 2 · Buen Fin</div><h2>From a structured brief to design</h2>
      <p class="sk-sub">Their creative strategist analyzed Hot Sale and sent a structured brief with hooks and key info. I decided the structures, visuals and supporting copy, sometimes bending the brief, and added a concept of my own.</p>
      <div class="cgrid">${bfAds.map(mini).join('')}</div></section>
    <section class="sk-sec"><div class="eyebrow">Ad by ad</div><h2>Return on ad spend</h2>
      <p class="sk-sub">Buen Fin is still early data. <span class="lg"><i class="hs"></i>Hot Sale</span> <span class="lg"><i class="bf"></i>Buen Fin</span></p>
      <div class="rbars">${bars}</div></section>
    <section class="sk-sec"><div class="eyebrow">Your store</div><h2>Now picture it with your ecommerce</h2>
      <div class="learn">${SKINUP_FOR_YOU.map(([icon, title, text]) => `<div class="lc"><span>${icon}</span><b>${title}</b><p>${text}</p></div>`).join('')}</div>
      <p class="cs-cta"><a class="btn primary" href="#contact">Talk about your store ${ARROW}</a></p>
      <div class="nextbox"><b>Data note</b><p>Hot Sale figures are cumulative. Buen Fin is still live and its spend is a fraction of Hot Sale, so numbers will move. Creative is hidden under NDA.</p></div>
    </section>
    ${caseNav('wellwear', 'Wellwear Socks')}
  </div>`;
}

function viewCase(id) {
  if (CASES[id]) return viewCaseSimple(id);
  if (id === 'skinup') return viewCaseSkinup();
  return viewHome();
}

function viewContact() {
  return `<section class="sec" id="contact-sec"><div class="wrap cwrap1">
    <div class="chead2"><div class="eyebrow">Contact</div>
      <h1 class="h-lg">Your next ad could be your best one.</h1>
      <p class="lead mute">Tell me about your brand and where your ads are stuck.</p></div>
    <div class="cform"><span class="cstk">Say hello 👋</span><div id="cwrap"><form class="cf" id="cform">
      <div class="row2"><div class="fld"><label for="f-name">Name</label><input id="f-name" name="name" required autocomplete="name"></div><div class="fld"><label for="f-email">Email</label><input id="f-email" name="email" type="email" required autocomplete="email"></div></div>
      <div class="fld"><label for="f-co">Company</label><input id="f-co" name="company" autocomplete="organization"></div>
      <div class="fld"><label for="f-msg">Message</label><textarea id="f-msg" name="message" required></textarea></div>
      <div class="frow"><button class="btn primary" type="submit">Send message ${ARROW}</button><span class="fnote"><i></i>I reply within one business day</span></div>
    </form></div></div>
    <div class="cstrip">
      <a class="cs" href="mailto:${CONTACT.email}"><span class="cci">📧</span><span><small>Email</small><b>${CONTACT.email}</b></span></a>
      <a class="cs" href="${CONTACT.linkedin}" target="_blank" rel="noopener"><span class="cci">💼</span><span><small>LinkedIn</small><b>${CONTACT.linkedinLabel}</b></span></a>
      <div class="cs"><span class="cci">🌎</span><span><small>Availability</small><b>${CONTACT.availability}</b></span></div>
    </div>
  </div></section>`;
}

/* ---------- Router ---------- */

const VIEWS = { home: viewHome, about: viewAbout, work: viewWork, gallery: viewGallery, contact: viewContact };

function route() {
  if (location.hash === '#cv') history.replaceState(null, '', '#about');
  const page = (location.hash || '#home').slice(1);

  let html, nav;
  if (page.startsWith('case-')) {
    html = viewCase(page.slice(5));
    nav = 'work';
  } else {
    html = (VIEWS[page] || viewHome)();
    nav = VIEWS[page] ? page : 'home';
  }

  app.innerHTML = `<div class="page">${html}</div>`;
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === nav));
  closeMenu();
  window.scrollTo(0, 0);
}

/* ---------- Mobile menu ---------- */

function closeMenu() {
  $('#mainnav').classList.remove('open');
  $('#burger').setAttribute('aria-expanded', 'false');
}

$('#burger').addEventListener('click', () => {
  const open = $('#mainnav').classList.toggle('open');
  $('#burger').setAttribute('aria-expanded', open);
});

/* ---------- Events ---------- */

window.addEventListener('hashchange', route);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* Hero ads follow the mouse a little */
document.addEventListener('mousemove', (e) => {
  const hero = $('.hero2');
  if (!hero) return;
  const r = hero.getBoundingClientRect();
  if (e.clientY < r.top || e.clientY > r.bottom) return;
  const x = (e.clientX / innerWidth - 0.5) * 2;
  const y = ((e.clientY - r.top) / r.height) * 2 - 1;
  hero.querySelectorAll('.hf').forEach((f) => {
    const depth = +getComputedStyle(f).getPropertyValue('--dp') || 0.6;
    const inner = f.firstElementChild;
    inner.style.setProperty('--mx', (x * depth * 38).toFixed(1) + 'px');
    inner.style.setProperty('--my', (y * depth * 26).toFixed(1) + 'px');
  });
});

document.addEventListener('mouseleave', () => {
  document.querySelectorAll('.hfi').forEach((i) => {
    i.style.setProperty('--mx', '0px');
    i.style.setProperty('--my', '0px');
  });
});

/* Re-flow masonry grids when the column count changes */
window.addEventListener('resize', () => {
  if (masonryColumns() === lastColumns) return;
  const gallery = $('#gmas');
  if (gallery) gallery.innerHTML = galleryGrid();
  const caseGrid = $('#cmas');
  if (caseGrid) caseGrid.innerHTML = masonry(galleryItems().filter((a) => a.brand === caseGrid.dataset.brand));
});

document.addEventListener('click', (e) => {
  const t = e.target.closest('button, a');
  if (!t) return;

  if (t.matches('nav.main a.nl')) closeMenu();

  if (t.dataset.soon !== undefined) {
    e.preventDefault();
    toast(t.dataset.soon);
    return;
  }

  if (t.dataset.wf) {
    state.work = t.dataset.wf;
    $('#wchips').innerHTML = chipRow(WORK_CATEGORIES, state.work, 'data-wf', workCount);
    $('#wgrid').innerHTML = workGrid();
    $('#wcnt').textContent = workCount(state.work) + ' projects';
    return;
  }

  if (t.dataset.gm || t.dataset.gv) {
    if (t.dataset.gm) {
      state.galMode = t.dataset.gm;
      state.galValue = 'All';
    } else {
      state.galValue = t.dataset.gv;
    }
    $('#gchips').innerHTML = galleryChips();
    $('#gmas').innerHTML = galleryGrid();
  }
});

/* Contact form (prototype: nothing is sent) */
document.addEventListener('submit', (e) => {
  if (e.target.id !== 'cform') return;
  e.preventDefault();
  $('#cwrap').innerHTML =
    '<div class="thanks"><h3>Message received.</h3><p class="mute">Thanks for reaching out. This is a prototype, so nothing was sent. In the live site, you\'d hear back within one business day.</p></div>';
});

route();
