import path from 'node:path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {
  buildFooterColumns,
  buildFooterCopyright,
  buildNavbarItems,
  FOOTER_BRAND_COLUMN,
  SITE_BRAND,
} from './src/data/chrome';

function withTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

// `url` and `baseUrl` default to the production domain. The deploy workflow
// overrides them to build a preview at the GitHub Pages project path, e.g.
// `SITE_URL=https://leong2599.github.io` and `BASE_URL=/sportstools/`.
const siteUrl = process.env.SITE_URL ?? 'https://sportstoolshub.com';
const baseUrl = withTrailingSlash(process.env.BASE_URL ?? '/');

// `headTags` hrefs are emitted verbatim (unlike the navbar logo and the social
// card, which Docusaurus resolves against `baseUrl`), so they carry it here.
const iconHref = (file: string) => `${baseUrl}img/${file}`;

const config: Config = {
  title: SITE_BRAND.title,
  tagline: SITE_BRAND.tagline,
  favicon: 'img/favicon.ico',

  // The source favicon set, served from `static/img/`.
  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'icon', type: 'image/png', sizes: '16x16', href: iconHref('favicon-16x16.png')},
    },
    {
      tagName: 'link',
      attributes: {rel: 'icon', type: 'image/png', sizes: '32x32', href: iconHref('favicon-32x32.png')},
    },
    {
      tagName: 'link',
      attributes: {rel: 'icon', type: 'image/png', sizes: '96x96', href: iconHref('favicon-96x96.png')},
    },
    {
      tagName: 'link',
      attributes: {rel: 'apple-touch-icon', sizes: '180x180', href: iconHref('apple-icon-180x180.png')},
    },
  ],

  future: {
    v4: true,
  },

  url: siteUrl,
  baseUrl,

  organizationName: 'Leong2599',
  projectName: 'sportstools',

  onBrokenLinks: 'throw',

  // Canonical URLs carry a trailing slash, so they are `/tools/<slug>/`,
  // `/blog/<sport>/<slug>/`, `/about/`. That is the form GitHub Pages serves
  // straight from `<route>/index.html`.
  //
  // The extensionless form is owned by the legacy alias layer: GitHub Pages
  // resolves `/tools/<slug>` to `tools/<slug>.html` when that file exists and
  // only falls back to `tools/<slug>/index.html` otherwise. The alias layer
  // writes `tools/<slug>.html` for every legacy URL, so `/tools/<slug>` is the
  // alias and must redirect to the canonical route - never to itself.
  trailingSlash: true,

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [path.resolve(process.cwd(), 'plugins/legacy-aliases/index.ts')],

  presets: [
    [
      'classic',
      {
        docs: false,
        sitemap: {
          // The 404 route renders the not-found layout. It is not a page to
          // index, so it must not be advertised in the sitemap.
          ignorePatterns: ['/404/'],
        },
        blog: {
          // Reading time is derived by the plugin (D5), not authored in the
          // frontmatter.
          showReadingTime: true,
          // The sport tags are the primary tag pages; `blog/tags.yml` also
          // holds the topic tags the converter writes.
          blogTitle: 'Sports Blog Series',
          blogDescription:
            'Comprehensive sports blog covering soccer, basketball, tennis, cricket, cycling, swimming, golf, pickleball, hockey, squash, karate, wrestling, boxing, table tennis, badminton, baseball, volleyball, rugby, athletics, skiing, rowing, fencing, gymnastics, and archery. Training, nutrition, equipment, tactics, and player development.',
          blogSidebarTitle: 'Recent posts',
          blogSidebarCount: 10,
          postsPerPage: 12,
          routeBasePath: 'blog',
          path: 'blog',
          tagsBasePath: 'tags',
          authorsBasePath: 'authors',
          authorsMapPath: 'authors.yml',
          feedOptions: {
            type: ['rss', 'atom'],
            // Large archive; keep feed coverage high for SEO/indexing.
            limit: 500,
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: SITE_BRAND.title,
      logo: {
        alt: `${SITE_BRAND.title} Logo`,
        src: 'img/logo.png',
      },
      // Derived from the tool catalog: adding or removing a catalog entry
      // changes the navbar without a markup edit.
      items: buildNavbarItems(),
    },
    footer: {
      style: 'dark',
      // One column per catalog category plus the brand block. The source page
      // repeated the "Performance Trackers" heading; here it appears once.
      links: [FOOTER_BRAND_COLUMN, ...buildFooterColumns()],
      copyright: buildFooterCopyright(),
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // Social card image, shared by every page.
    image: 'img/og-image.jpg',
    metadata: [
      {
        name: 'keywords',
        content:
          'sports tools, fitness calculators, athletic performance, training equipment, sports blog, workout trackers',
      },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
