/* ==========================================================================
   Portfolio content
   Everything the pages show lives here, so copy and numbers can be edited
   without touching the rendering code in app.js.
   ========================================================================== */

/* Placeholder ad palettes: [background, foreground, accent 1, accent 2] */
const PALETTES = [
  ['#F3D9D2', '#2A1A18', '#E8A598', '#C9695A'],
  ['#DDE5D3', '#14231A', '#8DB088', '#2F5D3E'],
  ['#0F0F10', '#F4F1EA', '#8E8E93', '#3A3A3D'],
  ['#EFE6D8', '#231A12', '#D39B57', '#8A5A2B'],
  ['#DCE8F2', '#0F2236', '#8DBBE0', '#2D6DA8'],
  ['#1B2A49', '#F2EFE8', '#F2B84B', '#E07B39'],
  ['#E4DDF1', '#1E1630', '#B3A2DC', '#6B4FB3'],
  ['#F6EFC8', '#2A2A0E', '#E8C93A', '#B79A00'],
  ['#F4F4F2', '#0B0B0C', '#0B0B0C', '#B9B9BD'],
];

/* SkinUp México: real campaign data, cumulative to Nov 15, 2026 (USD).
   Creative is pre-blurred because of the NDA.
   g = campaign group (see CAMPAIGNS), top = top performer badge. */
const SKINUP_ADS = [
  { id: 'hs-gifts',        g: 'hs', name: 'Free Gifts Bundle',          date: 'May 8',  spend: 36274.28, rev: 145884.99, buys: 1436, top: true },
  { id: 'hs-installments', g: 'hs', name: 'Pay-in-Installments Bundle', date: 'May 9',  spend: 83417.01, rev: 143070.18, buys: 1426 },
  { id: 'hs-basket',       g: 'hs', name: 'Routine Basket Offer',       date: 'May 9',  spend: 16407.63, rev: 35438.98,  buys: 351 },
  { id: 'hs-lowest-price', g: 'hs', name: 'Lowest Price of the Year',   date: 'May 24', spend: 21313.21, rev: 46919.43,  buys: 434 },
  { id: 'hs-65-code',      g: 'hs', name: '65% Off · Promo Code',       date: 'May 26', spend: 47413.96, rev: 109275.19, buys: 1031 },
  { id: 'hs-65-colors',    g: 'hs', name: '65% Off · All Colors',       date: 'May 26', spend: 45750.23, rev: 101178.06, buys: 970 },
  { id: 'bf-routine',      g: 'bf', name: 'Pro Routine + 4 Gifts',      date: 'Nov 6',  spend: 2648.96,  rev: 13025.44,  buys: 116, top: true },
  { id: 'bf-holiday',      g: 'bf', name: 'Holiday Gift · Best Price',  date: 'Nov 6',  spend: 326.0,    rev: 2011.11,   buys: 17 },
  { id: 'bf-60-gifts',     g: 'bf', name: '60% Off + 4 Gifts',          date: 'Nov 13', spend: 892.67,   rev: 3364.15,   buys: 31, mine: true },
  { id: 'on-weekly-65',    g: 'on', name: 'Limited-Week Offer',         date: 'May 9',  spend: 12882.33, rev: 34291.91,  buys: 330 },
  { id: 'on-facial',       g: 'on', name: 'Facial Hair Confidence',     date: 'Oct 22', spend: 549.06,   rev: 1198.46,   buys: 10, type: 'Benefits' },
];
const CAMPAIGNS = { hs: 'Hot Sale', bf: 'Buen Fin', on: 'Always-on' };

/* Ads for other brands (shown unblurred). r = aspect ratio. */
const OTHER_ADS = [
  { b: 'Wellwear', f: 'ww-compression',     t: 'Benefits',     n: 'Daily Compression, No Tight Fit', r: '9/16' },
  { b: 'Wellwear', f: 'ww-not-medical',     t: 'Myth-busting', n: 'Not Medical Socks',               r: '9/16' },
  { b: 'Wellwear', f: 'ww-travel-tight',    t: 'Myth-busting', n: 'Light Compression for Travel',    r: '9/16' },
  { b: 'Wellwear', f: 'ww-travel-normally', t: 'Us vs. Them',  n: 'Travel Normally vs. Comfortably', r: '9/16' },
  { b: 'Wellwear', f: 'ww-notes',           t: 'Native style', n: 'Notes App Reminders',             r: '9/16' },
  { b: 'Wellwear', f: 'ww-ordinary',        t: 'Us vs. Them',  n: 'Ordinary Socks vs. Wellwear',     r: '9/16' },
  { b: 'Wellwear', f: 'ww-3-reasons',       t: 'Benefits',     n: '3 Reasons Your Legs Ache',        r: '9/16' },
  { b: 'FitBee',   f: 'fb-tracker',         t: 'Us vs. Them',  n: 'A Tracker Without the Bells',     r: '4/5' },
  { b: 'FitBee',   f: 'fb-no-label',        t: 'Benefits',     n: 'No Label? Snap a Photo',          r: '4/5' },
  { b: 'FitBee',   f: 'fb-logging',         t: 'Benefits',     n: 'Logging Faster Than Eating',      r: '4/5' },
  { b: 'FitBee',   f: 'fb-other-trackers',  t: 'Us vs. Them',  n: 'Other Trackers vs. FitBee',       r: '4/5' },
  { b: 'FitBee',   f: 'fb-paywalls',        t: 'Benefits',     n: 'Free Barcode Scanning',           r: '9/16' },
  { b: 'FitBee',   f: 'fb-ugly',            t: 'Native style', n: 'The "Ugly Ad"',                   r: '4/5' },
];
const BRANDS = {
  SkinUp:   { flag: '🇲🇽', industry: 'Beauty' },
  FitBee:   { flag: '🇺🇸', industry: 'Health & Fitness' },
  Wellwear: { flag: '🇬🇧', industry: 'Apparel' },
};

/* Three ads shown in each project folder */
const FOLDER_ADS = {
  skinup:   ['hs-65-colors', 'bf-routine', 'hs-gifts'],
  fitbee:   ['fb-tracker', 'fb-ugly', 'fb-no-label'],
  wellwear: ['ww-compression', 'ww-3-reasons', 'ww-travel-tight'],
};

/* Floating ads in the home hero. dp = mouse-parallax depth, d = entry delay. */
const HERO_ADS = [
  { img: 'ww-compression', left: '2%',  top: 44, r: -7, dp: 0.5,  d: 0 },
  { img: 'fb-tracker',     left: '17%', top: 6,  r: 5,  dp: -0.7, d: 70 },
  { img: 'hs-gifts',       left: '32%', top: 58, r: -4, dp: 0.9,  d: 140, hidden: true },
  { img: 'ww-3-reasons',   left: '45%', top: 0,  r: 3,  dp: -0.5, d: 210 },
  { img: 'fb-ugly',        left: '58%', top: 62, r: -6, dp: 0.8,  d: 280 },
  { img: 'bf-routine',     left: '71%', top: 10, r: 6,  dp: -0.9, d: 350, hidden: true },
  { img: 'ww-travel-tight', left: '84%', top: 52, r: -3, dp: 0.6, d: 420 },
];

/* Work page. Projects with `o` get generated placeholder ads. */
const WORK_CATEGORIES = ['All', 'Paid Ads', 'Social Media', 'UX/UI', 'Graphic Design'];
const PROJECTS = [
  { t: 'SkinUp México', cat: 'Paid Ads', feat: true, nda: true, flag: '🇲🇽', cty: 'MX', ind: 'Beauty', case: 'skinup' },
  { t: 'FitBee', cat: 'Paid Ads', flag: '🇺🇸', cty: 'US', ind: 'Health & Fitness', case: 'fitbee' },
  { t: 'Wellwear Socks', cat: 'Paid Ads', flag: '🇬🇧', cty: 'UK', ind: 'Apparel', case: 'wellwear' },
  { t: 'Bloom & Co. Content System', cat: 'Social Media', ind: 'Beauty', o: { b: 'Bloom & Co.', h: 'Plan. Post. Repeat.', p: 6, s: 'orb', l: 'a', c: 'Learn more' } },
  { t: 'Fresh Market Weekly Carousels', cat: 'Social Media', ind: 'E-commerce', o: { b: 'Fresh Market', h: 'This week: peaches.', p: 7, s: 'ring', l: 'b', c: 'See the menu' } },
  { t: 'MobiliHD', cat: 'UX/UI', ind: 'SaaS · Help desk', cover: 'mobilihd-cover' },
  { t: 'HomeList', cat: 'UX/UI', ind: 'SaaS · Real estate', cover: 'homelist-cover' },
  { t: 'Anótalo', cat: 'UX/UI', ind: 'Mobile app', cover: 'anotalo-cover', device: 'phone' },
  { t: 'Mosaic Coffee Identity', cat: 'Graphic Design', ind: 'Food & Beverage', o: { b: 'Mosaic', h: 'Slow mornings.', p: 3, s: 'arch', l: 'a', c: 'Visit us' } },
  { t: 'Terra Festival Poster Series', cat: 'Graphic Design', ind: 'Events', o: { b: 'Terra Fest', h: 'Open air. Three days.', p: 2, s: 'ring', l: 'b', c: 'Get tickets' } },
];

/* Simple case studies (SkinUp has its own richer layout in app.js) */
const CASES = {
  wellwear: {
    name: 'Wellwear Socks', brand: 'Wellwear', flag: '🇬🇧',
    pills: ['Paid Ads', 'Apparel', 'United Kingdom'],
    lead: 'Static Meta ads for a sock brand that wants compression to feel like comfort, not a prescription.',
    meta: [['Role', 'Static ad design'], ['Market', 'United Kingdom'], ['Period', 'Nov 2025 – Apr 2026']],
    brief: 'Compression socks usually mean tight, medical and a little sad. Wellwear offers light support, merino comfort and a wider fit. The ads had to say that at a glance, in a feed full of noise.',
    angles: [
      ['Benefits', 'Light support, no digging in, all-day wear, said in plain words.'],
      ['Myth-busting', 'Tackling the “medical sock” idea head on.'],
      ['Us vs. Them', 'Ordinary socks next to Wellwear, so the difference is visible.'],
      ['Native style', 'A Notes-app reminder that looks like it belongs in the feed.'],
    ],
    next: ['fitbee', 'FitBee'],
  },
  fitbee: {
    name: 'FitBee', brand: 'FitBee', flag: '🇺🇸',
    pills: ['Paid Ads', 'Health & Fitness', 'United States'],
    lead: 'Static ads for an iPhone calorie tracker that wins by doing less: no paywalls, no ads, no clutter.',
    meta: [['Role', 'Static ads & ASO graphics'], ['Market', 'United States'], ['Period', 'Nov 2025 – Apr 2026']],
    brief: 'Calorie trackers are crowded and often paywalled. FitBee’s edge is the opposite: free barcode scanning, AI photo logging and a clean, ad-free app. The ads had to make that contrast obvious, fast.',
    angles: [
      ['Us vs. Them', 'Other trackers against FitBee, and a before and after of the same screen.'],
      ['Benefits', 'Barcode scanning, photo logging and a verified food database, one idea per ad.'],
      ['Native style', '“This is an ugly ad.” Plain and honest, like the app’s no-bloat pitch.'],
    ],
    next: ['skinup', 'SkinUp México'],
  },
};

/* Gallery filters */
const GALLERY_TYPES = ['All', 'Offer', 'Us vs. Them', 'Benefits', 'Myth-busting', 'Native style'];
const GALLERY_INDUSTRIES = ['All', 'Beauty', 'Health & Fitness', 'Apparel'];

/* Home page */
const PROCESS = [
  ['📊', 'Data', 'Read what ran and where attention dropped.'],
  ['💡', 'Insight', 'Turn patterns into one creative question.'],
  ['✍️', 'Copy', 'Write hooks and claims as testable variations.'],
  ['🎨', 'Design', 'Build static ads that stop the scroll.'],
  ['🔁', 'Test & Iterate', 'Read results, keep the learning, brief the next round.'],
];
const SERVICES = [
  ['🎯', 'Hooks & angles'], ['🖼️', 'Static ads'], ['✍️', 'Ad copy'], ['🧪', 'Creative testing'],
  ['📊', 'Reading results'], ['🎨', 'Brand design'], ['📱', 'ASO graphics'],
];
/* Leave q empty to show the placeholder text */
const REVIEWS = [
  { q: '', who: 'Client name', role: 'Role · Brand' },
  { q: '', who: 'Client name', role: 'Role · Brand' },
  { q: '', who: 'Client name', role: 'Role · Brand' },
];

/* SkinUp case study */
const SKINUP_STEPS = [
  ['Explored and tested', 'Hot Sale brief was loose: references everywhere, many concepts.'],
  ['Got a structured brief', 'Buen Fin: their strategist analyzed Hot Sale and sent hooks and key info.'],
  ['Chose the structure', 'Layouts, visuals and supporting copy were mine, even when it meant bending the brief.'],
  ['Built on what worked', 'Hot Sale results guided the design, plus new ideas.'],
  ['Added my own concept', '60% Off + 4 Gifts, to keep testing.'],
];
const SKINUP_FOR_YOU = [
  ['📤', 'You bring the hooks and info', 'A rough idea or a full brief, both work.'],
  ['🧭', 'I decide how it looks and reads', 'Structure, visuals and supporting copy that fit your offer.'],
  ['🎨', 'You get ads built to convert', 'Ready for your team to launch and easy to keep testing.'],
];

/* About page */
const EXPERIENCE = [
  {
    when: 'Jan 2026 – Now', kind: 'Independent · Remote', role: 'Performance Creative Designer', co: 'Upper Media LLC',
    lead: 'I learned to read results.', current: true,
    pts: [
      'Static ads for SkinUp México, a DTC brand in at-home laser hair removal.',
      'Tested many concepts in Hot Sale, then turned a structured brief into Buen Fin design.',
    ],
    tags: ['Static ads', 'Copywriting', 'Figma'],
    proj: [{ img: 'hs-gifts', label: 'SkinUp México', sub: 'Case study', href: '#case-skinup', hidden: true }],
  },
  {
    when: 'Apr 2022 – Now', kind: 'Co-founder · Hybrid', role: 'Co-Founder & Creative Director', co: 'Dual Studio',
    lead: 'I learned to lead, not just execute.', current: true,
    pts: ['Creative strategy for client companies, plus a quality check on every piece.'],
    tags: ['Creative direction', 'Brand strategy'],
  },
  {
    when: 'Nov 2025 – Apr 2026', kind: 'Freelance · Remote', role: 'Graphic Designer', co: 'Freelance',
    lead: 'I learned the DTC playbook, one founder at a time.',
    pts: ['Static Meta ads, ASO graphics and product imagery for international founders.'],
    tags: ['Meta ads', 'ASO graphics', 'Photoshop'],
    proj: [
      { img: 'ww-compression', label: 'Wellwear Socks', sub: 'Paid ads', href: '#work' },
      { img: 'fb-tracker', label: 'FitBee', sub: 'Paid ads', href: '#work' },
    ],
  },
  {
    when: 'Apr 2024 – Jul 2025', kind: 'Full-time · Remote', role: 'UX/UI Designer', co: 'Joonik',
    lead: 'I learned to think in flows.',
    pts: [
      'Lead designer on two SaaS products: MobiliHD and HomeList.',
      'Identities, flows and Figma prototypes, presented to stakeholders.',
    ],
    tags: ['UX/UI', 'Prototyping', 'Visual identity'],
  },
  {
    when: 'Sep 2021 – Apr 2022', kind: 'Full-time · Remote', role: 'Lead Social Media Designer', co: 'Uno Zero Marketing',
    lead: 'I learned consistency.',
    pts: [
      'Four Instagram accounts, one community manager, each brand kept consistent.',
      'Identities, banners and highlights.',
    ],
    tags: ['Social media', 'Instagram', 'Illustrator'],
  },
];
const MAIN_TOOLS = [
  ['🎨', 'Figma', 'UI design, prototypes and ad layouts'],
  ['🖼️', 'Photoshop', 'Ad creative and photo retouching'],
  ['✨', 'AI tools', 'Image generation, data analysis and copywriting support', ['Gemini', 'Google Flow', 'Claude']],
];
const OTHER_TOOLS = [['✒️', 'Illustrator'], ['📷', 'Lightroom'], ['🧊', 'Blender'], ['🎬', 'Premiere'], ['📱', 'CapCut'], ['🔍', 'Google Workspace']];
const TEAM_TOOLS = [['📌', 'Asana'], ['🗂️', 'Trello'], ['⚡', 'ClickUp'], ['💬', 'Slack'], ['✉️', 'Email'], ['👥', 'Teams']];
const SKILLS = [
  'Performance ad creative', 'Static ads (Meta)', 'Copywriting', 'UX/UI design', 'Web & app design',
  'Visual identity', 'Social media design', 'Photo retouching', 'Video editing', 'Creative direction',
];

/* Contact */
const CONTACT = {
  email: 'hello@darielafuenmayor.design',
  linkedin: 'https://www.linkedin.com/',
  linkedinLabel: 'in/darielafuenmayor',
  availability: 'Remote · UTC−5',
};
