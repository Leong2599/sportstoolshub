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

/**
 * Footer bottom line. The sitemap is a generated file rather than a route, so
 * it stays a plain anchor instead of a Docusaurus link.
 */
export function buildFooterCopyright(year: number = new Date().getFullYear()): string {
  return `&copy; ${year} ${SITE_BRAND.title}. All rights reserved. | <a href="/sitemap.xml">Sitemap</a>`;
}
