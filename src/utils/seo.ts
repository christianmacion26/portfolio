/**
 * seo.ts — meta / JSON-LD helpers
 *
 * Canonical URLs use Astro.url which already includes the configured `base`,
 * so we never manually prepend it. SITE_URL is the deployment root (without
 * base) so combining it with Astro.url.pathname produces the full public URL.
 */

export interface SEO {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  pathname?: string;
}

const SITE_NAME = 'Christian T. Macion';
export const SITE_URL = 'https://christianmacion26.github.io';

export function buildMeta({ title, description, image, type = 'website', pathname = '/' }: SEO) {
  const fullTitle = title === SITE_NAME ? title : `${title} · ${SITE_NAME}`;
  const canonical = new URL(pathname, SITE_URL).toString();
  const imageUrl = image ? new URL(image, SITE_URL).toString() : undefined;
  return {
    title: fullTitle,
    description,
    canonical,
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: canonical,
      site_name: SITE_NAME,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export interface PersonInfo {
  fullName: string;
  titles: { primary: string; secondary: string };
  location: { city: string; province: string; country: string };
  contact: {
    email: string;
    linkedin: string;
    github: string;
    medium?: string;
  };
  knowsAbout?: string[];
  alumniOf?: string[];
  awards?: string[];
}

export function personJsonLd(p: PersonInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.fullName,
    jobTitle: p.titles.primary,
    description: p.titles.secondary,
    url: SITE_URL,
    image: new URL('/og-image.jpg', SITE_URL).toString(),
    address: {
      '@type': 'PostalAddress',
      addressLocality: p.location.city,
      addressRegion: p.location.province,
      addressCountry: p.location.country,
    },
    email: p.contact.email,
    sameAs: [p.contact.linkedin, p.contact.github, p.contact.medium].filter(Boolean),
    knowsAbout: p.knowsAbout ?? [],
    alumniOf: (p.alumniOf ?? []).map((name) => ({
      '@type': 'EducationalOrganization',
      name,
    })),
    award: p.awards ?? [],
  };
}

/**
 * WebSite JSON-LD with SearchAction. Allows Google's site-links search box.
 */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Portfolio of Christian T. Macion — Quant Researcher · AI Engineer.',
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/projects/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * ItemList JSON-LD for a list of CreativeWork (projects). Helps Google render
 * rich project carousels if the page qualifies for one.
 */
export function projectListJsonLd(
  projects: Array<{
    slug: string;
    title: string;
    summary: string;
    role: 'ai' | 'quant';
    sourceLink?: string;
    date?: Date | string;
  }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: projects.map((p, idx) => {
      const url = `${SITE_URL}/projects/${p.slug}/`;
      return {
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'CreativeWork',
          name: p.title,
          description: p.summary,
          url,
          codeRepository: p.sourceLink,
          dateCreated: p.date ? new Date(p.date).toISOString().slice(0, 10) : undefined,
          author: {
            '@type': 'Person',
            name: SITE_NAME,
            url: SITE_URL,
          },
          genre: p.role === 'ai' ? 'Artificial Intelligence' : 'Quantitative Finance',
        },
      };
    }),
  };
}
