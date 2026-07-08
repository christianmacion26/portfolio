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

export function personJsonLd(p: {
  fullName: string;
  titles: { primary: string; secondary: string };
  location: { city: string; province: string; country: string };
  contact: { email: string; linkedin: string; github: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.fullName,
    jobTitle: p.titles.primary,
    description: p.titles.secondary,
    address: {
      '@type': 'PostalAddress',
      addressLocality: p.location.city,
      addressRegion: p.location.province,
      addressCountry: p.location.country,
    },
    email: p.contact.email,
    sameAs: [p.contact.linkedin, p.contact.github],
  };
}