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
    primary: 'AI Engineer · Quantitative Researcher',
    secondary: 'Multi-Agent LLM Systems & Statistical Modeling',
    tagline: 'Two hats, one method. Eval-first discipline.',
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
    github: 'https://github.com/christianmacion',
    ojp: 'https://www.onlinejobs.ph/jobseekers/info/...', // user to fill
  },
  availability: {
    hours: '20 hrs/wk',
    mode: 'remote',
  },
  stats: {
    certCount: '102',
    locCount: '0',
    ageMonths: '11', // 102 certs in 11 months
    aiAgentCount: '11', // orchestrator + workers
    locPython: '76.5k', // ~76,500 LOC
    evalGates: '31', // 31-gate evaluation harness
  },
} as const;
