import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';
import * as lucideReact from 'lucide-react';
import {TOOL_ICONS} from './icons';
import legacyUrlData from './legacy-urls.json';
import {
  TOOL_CATEGORIES,
  TOOL_CATEGORY_LABELS,
  getLegacyTarget,
  getRelatedTools,
  getToolByLegacyPath,
  getToolBySlug,
  getToolRoute,
  getToolsByCategory,
  toolCategorySections,
  tools,
  toolsByCategory,
} from './tools';

const legacyUrls = legacyUrlData as Record<string, string>;
const lucideIcons = lucideReact as Record<string, unknown>;
const toolPagesDir = fileURLToPath(new URL('../pages/tools/', import.meta.url));

describe('tool catalog', () => {
  it('contains 41 tools with unique slugs, legacy paths, and component keys', () => {
    expect(tools).toHaveLength(41);
    expect(new Set(tools.map((tool) => tool.slug)).size).toBe(41);
    expect(new Set(tools.map((tool) => tool.legacyPath)).size).toBe(41);
    expect(new Set(tools.map((tool) => tool.component)).size).toBe(41);

    for (const tool of tools) {
      expect(tool.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(tool.component).toMatch(/^[A-Z][A-Za-z0-9]+$/);
      expect(tool.legacyPath).toBe(`/tools/${tool.slug}.html`);
    }
  });

  it('partitions every tool into the three fixed categories', () => {
    expect(TOOL_CATEGORIES).toEqual(['fitness', 'performance', 'nutrition']);
    expect(Object.keys(toolsByCategory)).toEqual([...TOOL_CATEGORIES]);
    expect(getToolsByCategory('fitness')).toHaveLength(6);
    expect(getToolsByCategory('performance')).toHaveLength(22);
    expect(getToolsByCategory('nutrition')).toHaveLength(13);

    expect(tools.map((tool) => tool.category)).toEqual([
      ...Array(6).fill('fitness'),
      ...Array(22).fill('performance'),
      ...Array(13).fill('nutrition'),
    ]);

    for (const category of TOOL_CATEGORIES) {
      expect(getToolsByCategory(category)).toBe(toolsByCategory[category]);
      for (const tool of getToolsByCategory(category)) {
        expect(tool.category).toBe(category);
      }
    }
  });

  it('exposes one labelled section per category for shared home and footer rendering', () => {
    expect(toolCategorySections).toHaveLength(3);
    expect(toolCategorySections.map((section) => section.label)).toEqual([
      'Fitness Calculators',
      'Performance Trackers',
      'Nutrition Tools',
    ]);
    expect(new Set(toolCategorySections.map((section) => section.label)).size).toBe(3);
    expect(toolCategorySections.flatMap((section) => section.tools)).toHaveLength(41);

    for (const category of TOOL_CATEGORIES) {
      expect(TOOL_CATEGORY_LABELS[category]).toBeTruthy();
    }
  });

  it('agrees with the ST-3 legacy URL contract', () => {
    const contractToolPaths = Object.keys(legacyUrls).filter(
      (legacyPath) =>
        /^\/tools\/[a-z0-9-]+\.html$/.test(legacyPath) &&
        legacyPath !== '/tools/about.html',
    );

    expect(contractToolPaths).toHaveLength(41);
    expect(new Set(contractToolPaths)).toEqual(
      new Set(tools.map((tool) => tool.legacyPath)),
    );

    for (const tool of tools) {
      expect(legacyUrls[tool.legacyPath]).toBe(`/tools/${tool.slug}/`);
    }
  });

  it('has a page for every tool so the home grid links resolve', () => {
    for (const tool of tools) {
      expect(existsSync(`${toolPagesDir}${tool.slug}.mdx`)).toBe(true);
    }
  });

  it('maps every tool to a real lucide icon', () => {    expect(new Set(Object.keys(TOOL_ICONS))).toEqual(
      new Set(tools.map((tool) => tool.icon)),
    );

    for (const tool of tools) {
      expect(Object.prototype.hasOwnProperty.call(TOOL_ICONS, tool.icon)).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(lucideIcons, tool.icon)).toBe(true);
      expect(lucideIcons[tool.icon]).toBe(TOOL_ICONS[tool.icon]);
    }
  });

  it('has clean, unique, non-empty copy without source emoji', () => {
    expect(new Set(tools.map((tool) => tool.title)).size).toBe(41);
    expect(new Set(tools.map((tool) => tool.description)).size).toBe(41);
    expect(new Set(tools.map((tool) => tool.seoDescription)).size).toBe(41);

    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
    for (const tool of tools) {
      expect(tool.title.trim()).toBe(tool.title);
      expect(tool.description.trim()).toBe(tool.description);
      expect(tool.seoDescription.trim()).toBe(tool.seoDescription);
      expect(tool.title).not.toMatch(emoji);
      expect(tool.description).not.toMatch(emoji);
      expect(tool.seoDescription).not.toMatch(emoji);
    }
  });

  it('gives every tool the call to action of its source card', () => {
    for (const tool of tools) {
      expect(tool.linkLabel.trim()).toBe(tool.linkLabel);
      expect(tool.linkLabel.length).toBeGreaterThan(0);
      expect(tool.linkLabel).toMatch(/^[\x20-\x7E]+$/);
    }

    expect(
      tools.find((tool) => tool.slug === 'bmi-calculator')?.linkLabel,
    ).toBe('Use Calculator');
    expect(
      tools.find((tool) => tool.slug === 'one-rep-max-calculator')?.linkLabel,
    ).toBe('Calculate 1RM');
    expect(
      tools.find((tool) => tool.slug === 'body-type-quiz')?.linkLabel,
    ).toBe('Take Quiz');
    expect(
      tools.find((tool) => tool.slug === 'weight-cut-gain-planner')?.linkLabel,
    ).toBe('Plan Weight');
  });

  it('looks up tools, returns related tools, and resolves legacy targets', () => {
    const bmi = getToolBySlug('bmi-calculator');
    expect(bmi?.title).toBe('BMI Calculator');
    expect(getToolBySlug('missing-tool')).toBeUndefined();

    expect(getToolRoute('bmi-calculator')).toBe('/tools/bmi-calculator');
    expect(getToolRoute(bmi!)).toBe('/tools/bmi-calculator');
    expect(getLegacyTarget('/tools/bmi-calculator.html')).toBe(
      '/tools/bmi-calculator',
    );
    expect(getLegacyTarget('/tools/missing.html')).toBeUndefined();

    expect(getToolByLegacyPath('/tools/bmi-calculator.html')?.slug).toBe(
      'bmi-calculator',
    );
    expect(getToolByLegacyPath('/tools/missing.html')).toBeUndefined();

    const related = getRelatedTools('bmi-calculator', 3);
    expect(related).toHaveLength(3);
    expect(
      related.every(
        (tool) => tool.category === 'fitness' && tool.slug !== 'bmi-calculator',
      ),
    ).toBe(true);
    expect(getRelatedTools(bmi!, 2)).toEqual(related.slice(0, 2));
    expect(getRelatedTools('bmi-calculator', 0)).toEqual([]);
  });
});
