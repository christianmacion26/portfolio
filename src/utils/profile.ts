/**
 * profile.ts — single source of truth for the site's owner identity.
 * NDA-safe values only. Editing here propagates to nav, footer,
 * schema.org JSON-LD, and the resume download link.
 */

// Stats are the canonical source for site-wide numerics. titles.secondary
// derives its 4 chrome figures (aiAgentCount / evalGates / locPython /
// certCount) from these values — so flipping any stat propagates to the
// default <meta description> + JSON-LD description + OG/Twitter card
// description simultaneously. No developer grep required.
const stats = {
  certCount: '102',
  ageMonths: '11', // 102 certs in 11 months
  aiAgentCount: '11', // orchestrator + workers
  locPython: '76.5k', // ~76,500 LOC
  evalGates: '31', // 31-gate evaluation harness
  pagesBuilt: '84', // built pages — update on route add/remove
  // v6.11.13 — derived chrome counts. /positions had hardcoded
  // "15 repos" / "Five seats" / "Three seat types" that contradicted
  // other pages and silently drifted when role-cards were added/removed.
  repoCount: '25', // GitHub public repos (api.github.com/users/christianmacion26 → public_repos=25)
  targetSeats: '5', // /positions conversation cards (lines 248-374)
  offTableSeats: '3', // /positions "off the table" bullets (lines 388-392)
  strategyCount: '9', // /projects quant files (01-…mdx) — update on strategy add/remove
  positionsStartDate: '2026-04-21', // /positions paper-trading series start (BTC/USDT 1d klines)
  // v6.11.33 — resume variants count. Drives /resume, /for-recruiters, /contact chrome.
  resumeCount: '3', // unified / AI-only / Quant one-pager (resumes[] in resume.astro)
} as const;

export const profile = {
  fullName: 'Christian T. Macion, CTA®',
  shortName: 'Christian Macion',
  initials: 'CM',
  titles: {
    primary: 'Quantitative Researcher · AI Engineer',
    // v6.10.47 — compact form for the Nav brand slot (36px logo). Uses
    // 'Quant' (not 'Quantitative') so the word fits the available width
    // without ellipsis at the smallest desktop breakpoint. Kept distinct
    // from `primary` so the visual hierarchy at H1 size still reads
    // 'Quantitative Researcher' in full.
    short: 'Quant Researcher · AI Engineer',
    secondary: `Christian T. Macion, CTA® — Quant Researcher and AI Engineer. ${stats.aiAgentCount}-agent research platform, ${stats.evalGates}-gate statistical eval harness, ${stats.locPython} LOC Python, ${stats.certCount} professional certifications. NDA-safe by construction.`,
    tagline: 'I do solutions. Eval-first. NDA-clean.',
  },
  headshot: {
    src: '/headshot.jpg',
    alt: 'Christian T. Macion, dark blazer over graphic tee, three-quarter view, neutral background. Photographed February 2026.',
    credit: 'Photo · Feb 2026',
  },
  location: {
    city: 'Digos City',
    province: 'Davao del Sur',
    country: 'Philippines',
    timezone: 'UTC+8',
    display: 'Digos City, Davao del Sur, Philippines (UTC+8)',
  },
  contact: {
    email: 'christianmacion26@gmail.com',
    phone: '+63-991-616-2630',
    phoneDisplay: '+63 991 616 2630',
    linkedin: 'https://www.linkedin.com/in/christianmacion',
    github: 'https://github.com/christianmacion26',
    medium: 'https://medium.com/@christianmacion',
    ojp: 'https://v2.onlinejobs.ph/jobseekers/info/4760383',
    upwork: 'https://www.upwork.com/freelancers/~01785a76c001e4acd8',
  },
  knowsAbout: [
    'Multi-Agent LLM Systems',
    'LLM Evaluation',
    'RAG',
    'Structured Outputs',
    'MCP (Model Context Protocol)',
    'Deflated Sharpe Ratio',
    'Walk-Forward Validation',
    'Block-Bootstrap',
    'Cointegration',
    'Variance Risk Premium',
    'Crypto Derivatives',
    'Python',
    'KaTeX',
    'OSINT (Open-Source Intelligence)',
    'AI Architecture Auditing',
  ],
  alumniOf: [
    'University of Mindanao (UM)',
    'Southern Technical Academy (STA)',
    'Philippine Science High School — Southern Mindanao Campus (PSHS-SMC)',
    'University of Southeastern Philippines (USeP) — units',
  ],
  awards: [
    // [VERIFY] date-range-mismatch with ageMonths: stats.ageMonths is '11'
    // (derived into /solutions, /about, /index chrome) but this award
    // bracket spans 17 months (Dec 2024 → May 2026). Two interpretations
    // resolve to consistent chrome:
    //   A. ageMonths='11' is the OWNER's "active research arc" (e.g. since
    //      v2 push), separate from the full cert history
    //   B. ageMonths should be '17' to match the bracket on this line
    // Awaiting OWNER verdict. For now, keep both as-is and let OWNER
    // reconcile. See chrome-honesty memory: portfolio-chrome-unification
    // for the rest of the v6.11.x chrome-derivation pattern.
    `${stats.certCount} certificates (2024-12 → 2026-05)`,
    'CTA® (Certified Technical Analyst, Society of Technical Analysts · cert #260197 · Jan 2026)',
    'Galactic Problem Solver · NASA Space Apps Challenge 2024 (Zurich cohort)',
    'AI for the Modern Workforce · Ateneo de Davao + US Embassy · Nov 8 2025',
    'AIccelerate 2025 · BIDA × Bayan Academy × Meta · Nov 12–21 2025',
    'Blockchain4Youth B4Y-2026-000701 · Bitget · 2026',
  ],
  availability: {
    hours: '30 hrs/wk',
    mode: 'remote',
  },
  stats,
} as const;
