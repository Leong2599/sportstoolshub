import {afterEach, describe, expect, it, vi} from 'vitest';
import config from '../../docusaurus.config';
import {buildFooterColumns, buildNavbarItems} from '../data/chrome';
import {tools} from '../data/tools';

type NavbarConfig = {
  title?: string;
  logo?: {alt?: string; src: string};
  items?: {label?: string; to?: string; type?: string; position?: string}[];
};

type FooterColumn = {title: string | null; items: {label?: string; to?: string}[]};

type FooterConfig = {links?: FooterColumn[]; copyright?: string};

const themeConfig = config.themeConfig as {
  navbar?: NavbarConfig;
  footer?: FooterConfig;
  image?: string;
};

describe('site configuration', () => {
  afterEach(() => {
    delete process.env.BASE_URL;
    delete process.env.SITE_URL;
    vi.resetModules();
  });

  it('targets the production domain from the site root', () => {
    expect(config.url).toBe('https://sportstoolshub.com');
    expect(config.baseUrl).toBe('/');
  });

  it('can be built for a preview at the GitHub Pages project path', async () => {
    process.env.BASE_URL = '/sportstools';
    process.env.SITE_URL = 'https://leong2599.github.io';
    vi.resetModules();

    const {default: preview} = await import('../../docusaurus.config');

    expect(preview.url).toBe('https://leong2599.github.io');
    expect(preview.baseUrl).toBe('/sportstools/');
    expect(preview.headTags?.map((tag) => tag.attributes?.href)).toEqual([
      '/sportstools/img/favicon-16x16.png',
      '/sportstools/img/favicon-32x32.png',
      '/sportstools/img/favicon-96x96.png',
      '/sportstools/img/apple-icon-180x180.png',
    ]);
  });

  it('fails builds on broken links', () => {
    expect(config.onBrokenLinks).toBe('throw');
  });

  it('publishes canonical URLs in the trailing-slash form', () => {
    // GitHub Pages serves `/tools/x/` from `tools/x/index.html`. The
    // extensionless `/tools/x` is served from `tools/x.html`, the legacy alias
    // file, so it must not be the canonical form.
    expect(config.trailingSlash).toBe(true);
  });

  it('ships light mode only', () => {
    expect(config.themeConfig?.colorMode).toMatchObject({
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    });
  });

  it('publishes the favicon set and the social card image', () => {
    const headTags = config.headTags ?? [];

    expect(headTags.map((tag) => tag.attributes?.href)).toEqual([
      '/img/favicon-16x16.png',
      '/img/favicon-32x32.png',
      '/img/favicon-96x96.png',
      '/img/apple-icon-180x180.png',
    ]);
    expect(headTags.map((tag) => tag.attributes?.rel)).toEqual([
      'icon',
      'icon',
      'icon',
      'apple-touch-icon',
    ]);

    expect(themeConfig.image).toBe('img/og-image.jpg');
  });

  it('builds the navbar from the catalog', () => {
    const navbar = themeConfig.navbar;

    expect(navbar?.title).toBe('Sports Tools Hub');
    expect(navbar?.logo).toMatchObject({src: 'img/logo.png'});
    expect(navbar?.items).toEqual(buildNavbarItems());
  });

  it('builds the footer from the catalog', () => {
    const columns = themeConfig.footer?.links ?? [];

    expect(columns).toHaveLength(4);
    expect(columns[0]?.title).toBe('Sports Tools Hub');
    expect(columns.slice(1)).toEqual(buildFooterColumns());

    const toolTargets = columns
      .flatMap((column) => column.items)
      .map((item) => item.to)
      .filter((to): to is string => Boolean(to));

    expect(toolTargets).toHaveLength(tools.length);
    expect(new Set(toolTargets)).toEqual(
      new Set(tools.map((tool) => `/tools/${tool.slug}`)),
    );
  });
});
