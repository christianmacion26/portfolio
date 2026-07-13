/**
 * profile.ts — single source of truth for the site's owner identity.
 * NDA-safe values only. Editing here propagates to nav, footer,
 * schema.org JSON-LD, and the resume download link.
 */

export const profile = {
  fullName: 'Christian T. Macion, CTA®',
  shortName: 'Christian Macion',
  initials: 'CM',
  titles: {
    primary: 'Quantitative Researcher · AI Engineer',
    secondary:
      'Christian T. Macion, CTA® — Quant Researcher and AI Engineer. 11-agent research platform, 31-gate statistical eval harness, 76.5k LOC Python, 102 professional certifications. NDA-safe by construction.',
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
    '102 certificates (2024-12 → 2026-05)',
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
  stats: {
    certCount: '102',
    ageMonths: '11', // 102 certs in 11 months
    aiAgentCount: '11', // orchestrator + workers
    locPython: '76.5k', // ~76,500 LOC
    evalGates: '31', // 31-gate evaluation harness
    pagesBuilt: '84', // built pages — update on route add/remove
  },
} as const;
