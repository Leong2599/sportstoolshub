import {describe, expect, it} from 'vitest';
import {
  buildCategories,
  buildFooterColumns,
  buildFooterCopyright,
  buildNavbarItems,
  CATEGORY_ANCHORS,
  FEATURED_BADGES,
  FOOTER_BRAND_COLUMN,
  SITE_BRAND,
  TOOLS_ANCHOR,
} from './chrome';
import {TOOL_CATEGORIES, TOOL_CATEGORY_LABELS, tools, type Tool} from './tools';

const performanceTitle = 'Performance Trackers';

function toolLinkTargets(columns: ReturnType<typeof buildFooterColumns>): string[] {
  return columns.flatMap((column) => column.items.map((item) => item.to));
}

describe('site chrome derived from the tool catalog', () => {
  it('exposes Home, Tools, Blog and About in the agreed order', () => {
    const items = buildNavbarItems();

    expect(items.map((item) => item.label)).toEqual([
      'Home',
      'Tools',
      'Blog',
      'About',
    ]);
    expect(items.every((item) => item.position === 'left')).toBe(true);

    const home = items[0];
    expect(home).toMatchObject({to: '/'});

    const blog = items[2];
    expect(blog).toMatchObject({to: '/blog'});

    const about = items[3];
    expect(about).toMatchObject({to: '/about'});
  });

  it('turns Tools into a dropdown with one entry per catalog category', () => {
    const toolsDropdown = buildNavbarItems()[1];

    expect(toolsDropdown.type).toBe('dropdown');
    expect(toolsDropdown.type === 'dropdown' && toolsDropdown.items).toHaveLength(3);
    expect(
      toolsDropdown.type === 'dropdown'
        ? toolsDropdown.items.map((item) => item.label)
        : [],
    ).toEqual(['Fitness Calculators', 'Performance Trackers', 'Nutrition Tools']);
    expect(
      toolsDropdown.type === 'dropdown'
        ? toolsDropdown.items.map((item) => item.to)
        : [],
    ).toEqual([
      `/#${CATEGORY_ANCHORS.fitness}`,
      `/#${CATEGORY_ANCHORS.performance}`,
      `/#${CATEGORY_ANCHORS.nutrition}`,
    ]);
  });

  it('builds one footer column per category with a single Performance Trackers heading', () => {
    const columns = buildFooterColumns();

    expect(columns.map((column) => column.title)).toEqual([
      'Fitness Calculators',
      'Performance Trackers',
      'Nutrition Tools',
    ]);
    expect(
      columns.filter((column) => column.title === performanceTitle),
    ).toHaveLength(1);
    expect(new Set(columns.map((column) => column.title)).size).toBe(3);
  });

  it('links every catalog tool exactly once from the footer', () => {
    const columns = buildFooterColumns();
    const targets = toolLinkTargets(columns);

    expect(targets).toHaveLength(41);
    expect(new Set(targets).size).toBe(41);
    expect(new Set(targets)).toEqual(
      new Set(tools.map((tool) => `/tools/${tool.slug}`)),
    );

    for (const column of columns) {
      const category = TOOL_CATEGORIES.find(
        (candidate) => TOOL_CATEGORY_LABELS[candidate] === column.title,
      );
      expect(category).toBeDefined();

      for (const item of column.items) {
        const tool = tools.find(
          (candidate) => `/tools/${candidate.slug}` === item.to,
        );
        expect(tool).toBeDefined();
        expect(item.label).toBe(tool?.title);
        expect(tool?.category).toBe(category);
      }
    }
  });

  it('keeps the tool links in catalog order inside their column', () => {
    const columns = buildFooterColumns();
    const performance = columns.find(
      (column) => column.title === performanceTitle,
    );

    expect(performance?.items.map((item) => item.label)).toEqual(
      tools
        .filter((tool) => tool.category === 'performance')
        .map((tool) => tool.title),
    );
  });

  it('changes the footer when a catalog entry is added or removed', () => {
    // The catalog is a literal union, so the fixture needs a cast.
    const fixtureTool = {
      slug: 'test-catalog-tool',
      title: 'Test Catalog Tool',
      description: 'Fixture tool',
      seoDescription: 'Fixture tool',
      category: 'performance',
      legacyPath: '/tools/test-catalog-tool.html',
      icon: 'Scale',
      component: 'BmiCalculator',
    } as unknown as Tool;

    const extendedTargets = toolLinkTargets(
      buildFooterColumns([...tools, fixtureTool]),
    );
    expect(extendedTargets).toHaveLength(42);
    expect(extendedTargets).toContain('/tools/test-catalog-tool');

    const removedTargets = toolLinkTargets(
      buildFooterColumns(tools.filter((tool) => tool.slug !== 'bmi-calculator')),
    );
    expect(removedTargets).toHaveLength(40);
    expect(removedTargets).not.toContain('/tools/bmi-calculator');
  });

  it('changes the navbar when a catalog category appears', () => {
    const fitnessOnly = tools.filter((tool) => tool.category === 'fitness');
    const categories = buildCategories(fitnessOnly);

    expect(categories.map((category) => category.label)).toEqual([
      'Fitness Calculators',
    ]);

    const dropdown = buildNavbarItems(fitnessOnly)[1];
    expect(dropdown.type === 'dropdown' && dropdown.items).toHaveLength(1);
    expect(
      dropdown.type === 'dropdown' ? dropdown.items[0]?.to : undefined,
    ).toBe(`/#${CATEGORY_ANCHORS.fitness}`);
  });

  it('keeps the brand block free of tool links', () => {
    expect(FOOTER_BRAND_COLUMN.title).toBe(SITE_BRAND.title);
    expect(FOOTER_BRAND_COLUMN.items).toHaveLength(1);
    expect(FOOTER_BRAND_COLUMN.items[0]?.html).toContain(SITE_BRAND.description);
    expect(FOOTER_BRAND_COLUMN.items[0]?.html).not.toContain('/tools/');
  });

  it('points the sitemap at the generated file instead of a route', () => {
    const copyright = buildFooterCopyright(2026);

    expect(copyright).toContain('&copy; 2026 Sports Tools Hub');
    expect(copyright).toContain('<a href="/sitemap.xml">Sitemap</a>');
  });

  it('keeps the category anchors aligned with the catalog', () => {
    expect(TOOLS_ANCHOR).toBe('tools');
    expect(Object.keys(CATEGORY_ANCHORS)).toEqual([...TOOL_CATEGORIES]);
    for (const category of TOOL_CATEGORIES) {
      expect(CATEGORY_ANCHORS[category]).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe('featured badges', () => {
  it('lists every legacy badge with a unique target and an accessible name', () => {
    expect(FEATURED_BADGES).toHaveLength(14);
    expect(new Set(FEATURED_BADGES.map((badge) => badge.href)).size).toBe(14);

    for (const badge of FEATURED_BADGES) {
      expect(badge.label).not.toBe('');
      expect(badge.href).toMatch(/^https:\/\//);
      if (badge.image) {
        expect(badge.image.src).toMatch(/^https:\/\//);
      }
    }
  });
});
