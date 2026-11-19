import {
  TOOL_CATEGORIES,
  TOOL_CATEGORY_LABELS,
  tools,
  type Tool,
  type ToolCategory,
} from './tools';

/**
 * Chrome (navbar + footer) is derived from the tool catalog so that adding or
 * removing a catalog entry changes the site chrome without any markup edit.
 *
 * The module is pure and framework-free on purpose: it is consumed by
 * `docusaurus.config.ts` (build time) and by the unit tests.
 */

export const SITE_BRAND = {
  title: 'Sports Tools Hub',
  tagline: 'Complete Sports & Fitness Resource Directory',
  description:
    'Your comprehensive resource for sports calculators, fitness trackers, training guides, and expert insights.',
} as const;

/**
 * Anchor ids of the catalog sections on the home page. The source site points
 * its "Tools" dropdown at these anchors; ST-24 rebuilds the home page and has
 * to keep rendering them.
 */
export const TOOLS_ANCHOR = 'tools';

export const CATEGORY_ANCHORS: Record<ToolCategory, string> = {
  fitness: 'fitness-calculators',
  performance: 'performance-trackers',
  nutrition: 'nutrition-tools',
};

export type ChromeCategory = {
  category: ToolCategory;
  label: string;
  anchor: string;
  tools: Tool[];
};

/**
 * Catalog categories that actually hold tools, in catalog order.
 */
export function buildCategories(catalog: readonly Tool[] = tools): ChromeCategory[] {
  return TOOL_CATEGORIES.filter((category) =>
    catalog.some((tool) => tool.category === category),
  ).map((category) => ({
    category,
    label: TOOL_CATEGORY_LABELS[category],
    anchor: CATEGORY_ANCHORS[category],
    tools: catalog.filter((tool) => tool.category === category),
  }));
}

export type ChromeNavbarLink = {
  label: string;
  to: string;
};

export type ChromeNavbarItem =
  | {type?: undefined; label: string; to: string; position: 'left' | 'right'}
  | {
      type: 'dropdown';
      label: string;
      position: 'left' | 'right';
      items: ChromeNavbarLink[];
    };

/**
 * Navbar items: Home, Tools (one dropdown entry per catalog category), Blog and
 * About. The order is the one agreed for the migration; the source page put
 * About before Tools.
 */
export function buildNavbarItems(
  catalog: readonly Tool[] = tools,
): ChromeNavbarItem[] {
  const categories = buildCategories(catalog);

  return [
    {label: 'Home', to: '/', position: 'left'},
    {
      type: 'dropdown',
      label: 'Tools',
      position: 'left',
      items: categories.map((category) => ({
        label: category.label,
        to: `/#${category.anchor}`,
      })),
    },
    {label: 'Blog', to: '/blog', position: 'left'},
    {label: 'About', to: '/about', position: 'left'},
  ];
}

export type ChromeFooterLink = {
  label: string;
  to: string;
};

export type ChromeFooterColumn = {
  title: string;
  items: ChromeFooterLink[];
};

/**
 * One footer column per catalog category. The source page split the
 * performance tools over two identically titled "Performance Trackers"
 * columns; here the heading appears exactly once.
 */
export function buildFooterColumns(
  catalog: readonly Tool[] = tools,
): ChromeFooterColumn[] {
  return buildCategories(catalog).map((category) => ({
    title: category.label,
    items: category.tools.map((tool) => ({
      label: tool.title,
      to: `/tools/${tool.slug}`,
    })),
  }));
}

/**
 * Leading footer column: the brand block of the source footer, which carries a
 * description instead of links.
 */
export const FOOTER_BRAND_COLUMN = {
  title: SITE_BRAND.title,
  items: [
    {
      html: `<p class="sth-footer__brand-text">${SITE_BRAND.description}</p>`,
    },
  ],
};

export type FeaturedBadge = {
  href: string;
  label: string;
  image?: {
    src: string;
    width?: number;
    height?: number;
  };
};

/**
 * Directory badges listed under the source page's footer, in source order.
 * `label` doubles as the image alt text (or the visible text for text-only
 * badges), so every badge has an accessible name.
 */
export const FEATURED_BADGES: readonly FeaturedBadge[] = [
  {
    href: 'https://findly.tools/sports-tools-hub?utm_source=sports-tools-hub',
    label: 'Featured on findly.tools',
    image: {src: 'https://findly.tools/badges/findly-tools-badge-light.svg', width: 150},
  },
  {
    href: 'https://dofollow.tools',
    label: 'Featured on Dofollow.Tools',
    image: {src: 'https://dofollow.tools/badge/badge_light.svg', width: 200, height: 54},
  },
  {
    href: 'https://twelve.tools',
    label: 'Featured on Twelve Tools',
    image: {src: 'https://twelve.tools/badge0-light.svg', width: 200, height: 54},
  },
  {
    href: 'https://www.siteswebdirectory.com/Health_Medical/Dentistry/',
    label: 'Dentists Marketing',
  },
  {
    href: 'https://startupbenchmarks.com',
    label: 'Startup Benchmarks',
    image: {src: 'https://startupbenchmarks.com/assets/images/badge.png', height: 54},
  },
  {
    href: 'https://mylaunchstash.com',
    label: 'My Launch Stash',
    image: {src: 'https://mylaunchstash.com/assets/images/badge.png', height: 54},
  },
  {
    href: 'https://www.justsimple.tools',
    label: 'Listed on JustSimple Tools',
    image: {src: 'https://www.justsimple.tools/badge.svg', width: 150},
  },
  {
    href: 'https://acidtools.com',
    label: 'Acid Tools',
    image: {src: 'https://acidtools.com/assets/images/badge.png', height: 54},
  },
  {
    href: 'https://firstlook.tools',
    label: 'Featured on First Look',
    image: {src: 'https://firstlook.tools/badge/badge_light.svg', width: 200},
  },
  {
    href: 'https://ufind.best/products/tytyai?utm_source=ufind.best',
    label: 'Featured on ufind.best',
    image: {src: 'https://ufind.best/badges/ufind-best-badge-light.svg', width: 150},
  },
  {
    href: 'https://www.showmysites.com',
    label: 'ShowMySites Badge',
    image: {src: 'https://www.showmysites.com/static/backlink/gray_border.webp', width: 200},
  },
  // {
  //   href: 'https://www.seewhatnewai.com',
  //   label: '[SeeWhatNewAI]',
  //   image: {src: '', width: 200},
  // },
  {
    href: 'https://uno.directory',
    label: 'Listed on Uno Directory',
    image: {src: 'https://uno.directory/uno-directory.svg', width: 120},
  },
];

/**
 * Footer bottom line. The sitemap is a generated file rather than a route, so
 * it stays a plain anchor instead of a Docusaurus link.
 */
export function buildFooterCopyright(year: number = new Date().getFullYear()): string {
  return `&copy; ${year} ${SITE_BRAND.title}. All rights reserved. 
  | <a href="https://pruneseo.com">PruneSEO</a>
  | <a href="/sitemap.xml">Sitemap</a>`;
}
