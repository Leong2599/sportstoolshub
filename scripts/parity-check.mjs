#!/usr/bin/env node
/**
 * Full-site parity check for the sports-tools rebuild (ST-28).
 *
 * Verifies that the rebuilt site is a drop-in replacement for the legacy
 * static site:
 *
 *   - every legacy URL in `src/data/legacy-urls.json` answers 200 and points
 *     (canonical + meta refresh) at its documented target
 *   - every target answers 200 with a non-empty title, a single `h1` and the
 *     expected canonical
 *   - the sitemap lists every target, never a legacy alias, and no dead URLs
 *   - `robots.txt`, `CNAME`, RSS/Atom feeds and the tag pages survived
 *   - no internal link on any built page is broken
 *   - the content (title/`h1`) still matches the legacy source, except for the
 *     reviewed deltas recorded in `scripts/parity/content-baseline.json`
 *   - the representative pages (home, BMI tool, one article, blog index) still
 *     expose their key structure
 *
 * Two ways to run it:
 *
 *   node scripts/parity-check.mjs --dir=build            # after `npm run build`
 *   node scripts/parity-check.mjs --base-url=http://localhost:3000
 *
 * The HTTP mode additionally checks real status codes (including a 404 for an
 * unknown path); the directory mode reads the files off disk.
 *
 * Add `--update-baseline` to rewrite the reviewed-delta snapshot after an
 * intentional content change, then review the diff before committing it.
 */
import {readdir, readFile, stat, writeFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const DEFAULT_ORIGIN = 'https://sportstoolshub.com';
export const EXPECTED_CNAME = 'sportstoolshub.com';
export const EXPECTED_RSS_ITEMS = 214;
export const SITE_NAME = 'Sports Tools Hub';
export const DEFAULT_LEGACY_FILE = 'src/data/legacy-urls.json';
export const DEFAULT_BASELINE_FILE = 'scripts/parity/content-baseline.json';
export const DEFAULT_REPORT_FILE = '.docusaurus/parity-report.json';
export const DEFAULT_SOURCE_DIR = 'C:/Users/user/Documents/Production/sport_tools';

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2700}-\u{27BF}]/u;
const MAX_FAILURES_PER_CHECK = 40;

/* -------------------------------------------------------------------------- */
/* HTML helpers                                                               */
/* -------------------------------------------------------------------------- */

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '\u2013',
  mdash: '\u2014',
  rsquo: '\u2019',
  lsquo: '\u2018',
  ldquo: '\u201c',
  rdquo: '\u201d',
  hellip: '\u2026',
};

export function decodeEntities(value) {
  return String(value).replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const hex = code[1] === 'x' || code[1] === 'X';
      const numeric = Number.parseInt(hex ? code.slice(2) : code.slice(1), hex ? 16 : 10);
      return Number.isFinite(numeric) && numeric > 0 && numeric <= 0x10ffff
        ? String.fromCodePoint(numeric)
        : match;
    }
    const named = NAMED_ENTITIES[code.toLowerCase()];
    return named ?? match;
  });
}

/** Collapses whitespace, drops markup and entities, trims. */
export function normalizeText(value) {
  if (value == null) {
    return '';
  }
  return decodeEntities(String(value).replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractTitle(html) {
  const match = String(html).match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match ? normalizeText(match[1]) : '';
}

export function extractHeadings(html) {
  const headings = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  while ((match = re.exec(String(html))) !== null) {
    headings.push({level: Number(match[1]), text: normalizeText(match[2])});
  }
  return headings;
}

export function extractH1s(html) {
  return extractHeadings(html)
    .filter((heading) => heading.level === 1)
    .map((heading) => heading.text);
}

const ATTRIBUTE = (name) => new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');

function attributeValue(tag, name) {
  const match = tag.match(ATTRIBUTE(name));
  if (!match) {
    return '';
  }
  return match[1] ?? match[2] ?? match[3] ?? '';
}

/** Canonical href of a page, or '' when the page has none. */
export function extractCanonical(html) {
  const tags = String(html).match(/<link\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const rel = attributeValue(tag, 'rel').toLowerCase().split(/\s+/);
    if (rel.includes('canonical')) {
      return decodeEntities(attributeValue(tag, 'href'));
    }
  }
  return '';
}

/** Target URL of a `<meta http-equiv="refresh">`, or '' when there is none. */
export function extractRefreshUrl(html) {
  const tags = String(html).match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (attributeValue(tag, 'http-equiv').toLowerCase() !== 'refresh') {
      continue;
    }
    const url = attributeValue(tag, 'content').match(/url\s*=\s*(.+)$/i);
    if (url) {
      return decodeEntities(url[1].replace(/["'>]+$/g, '').trim());
    }
  }
  return '';
}

export function extractHrefs(html) {
  const hrefs = [];
  const re = /<a\b[^>]*>/gi;
  let match;
  while ((match = re.exec(String(html))) !== null) {
    const href = attributeValue(match[0], 'href');
    if (href) {
      hrefs.push(decodeEntities(href));
    }
  }
  return hrefs;
}

export function countMatches(html, pattern) {
  return (String(html).match(pattern) ?? []).length;
}

/* -------------------------------------------------------------------------- */
/* Route helpers                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Turns an absolute or base-path-prefixed URL into a normalized root-relative
 * route: `/blog/x/` -> `/blog/x`, `/` -> `/`.
 */
export function normalizeRoute(value, {origin = DEFAULT_ORIGIN, basePath = '/'} = {}) {
  if (!value) {
    return '';
  }
  let route;
  try {
    route = new URL(value, `${origin}/`).pathname;
  } catch {
    return '';
  }
  const prefix = basePath === '/' ? '/' : basePath.replace(/\/+$/, '');
  if (prefix !== '/' && route.startsWith(prefix)) {
    route = route.slice(prefix.length) || '/';
  }
  if (!route.startsWith('/')) {
    route = `/${route}`;
  }
  if (route.length > 1 && route.endsWith('/')) {
    route = route.slice(0, -1);
  }
  return route;
}

export function isInternalHref(href) {
  const value = String(href).trim();
  if (!value || value.startsWith('#')) {
    return false;
  }
  return !/^(mailto|tel|javascript|data|sms|ftp):/i.test(value);
}

/* -------------------------------------------------------------------------- */
/* Parsers                                                                    */
/* -------------------------------------------------------------------------- */

export function parseSitemapUrls(xml) {
  const urls = [];
  for (const match of String(xml).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    urls.push(decodeEntities(match[1]));
  }
  return urls;
}

export function parseRssLinks(xml) {
  const links = [];
  for (const item of String(xml).matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const link = item[1].match(/<link>\s*([^<]+?)\s*<\/link>/i);
    if (link) {
      links.push(decodeEntities(link[1]));
    }
  }
  return links;
}

/** Groups `robots.txt` lines into `User-agent` blocks. */
export function parseRobotsGroups(text) {
  const groups = [];
  let current = null;
  for (const line of String(text).split(/\r?\n/)) {
    const clean = line.replace(/#.*/, '').trim();
    if (!clean) {
      continue;
    }
    const separator = clean.indexOf(':');
    if (separator === -1) {
      continue;
    }
    const key = clean.slice(0, separator).trim().toLowerCase();
    const value = clean.slice(separator + 1).trim();
    if (key === 'user-agent') {
      if (!current || current.rules.length > 0) {
        current = {agents: [], rules: []};
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
    } else if (current) {
      current.rules.push({key, value});
    }
  }
  return groups;
}

/** True when the `User-agent: *` group does not block the whole site. */
export function robotsAllowsEverything(text) {
  const wildcard = parseRobotsGroups(text).filter((group) => group.agents.includes('*'));
  if (wildcard.length === 0) {
    return false;
  }
  return !wildcard.some((group) =>
    group.rules.some((rule) => rule.key === 'disallow' && rule.value === '/'),
  );
}

/** Top-level keys of `blog/tags.yml` (the tag slugs). */
export function parseTagSlugs(yaml) {
  const slugs = [];
  for (const line of String(yaml).split(/\r?\n/)) {
    if (!line.trim() || /^\s/.test(line) || line.trim().startsWith('#')) {
      continue;
    }
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(?:#.*)?$/);
    if (match) {
      slugs.push(match[1]);
    }
  }
  return slugs;
}

export function parseArgs(argv) {
  const options = {
    dir: 'build',
    baseUrl: '',
    basePath: '/',
    origin: DEFAULT_ORIGIN,
    legacyFile: DEFAULT_LEGACY_FILE,
    baselineFile: DEFAULT_BASELINE_FILE,
    reportFile: DEFAULT_REPORT_FILE,
    sourceDir: process.env.PARITY_SOURCE_DIR ?? DEFAULT_SOURCE_DIR,
    updateBaseline: false,
    skipContent: false,
    preview: false,
    verbose: false,
  };
  for (const arg of argv) {
    const [flag, rawValue] = arg.split('=');
    const value = rawValue ?? '';
    switch (flag) {
      case '--dir':
        options.dir = value || 'build';
        break;
      case '--base-url':
        options.baseUrl = value;
        break;
      case '--base-path':
        options.basePath = value || '/';
        break;
      case '--origin':
        options.origin = (value || DEFAULT_ORIGIN).replace(/\/+$/, '');
        break;
      case '--legacy':
        options.legacyFile = value;
        break;
      case '--baseline':
        options.baselineFile = value;
        break;
      case '--json':
        options.reportFile = value;
        break;
      case '--source-dir':
        options.sourceDir = value;
        break;
      case '--update-baseline':
        options.updateBaseline = true;
        break;
      case '--skip-content':
        options.skipContent = true;
        break;
      case '--preview':
        options.preview = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (options.baseUrl) {
    options.baseUrl = options.baseUrl.replace(/\/+$/, '');
  }
  return options;
}

/* -------------------------------------------------------------------------- */
/* Content sources                                                            */
/* -------------------------------------------------------------------------- */

/** Reads pages from a directory holding a built site. */
export function createDirSource(dir) {
  const rootDir = path.resolve(dir);
  return {
    kind: 'dir',
    label: rootDir,
    async get(route) {
      const clean = route.split(/[?#]/)[0] || '/';
      const relative = decodeURIComponent(clean.replace(/^\/+/, ''));
      const candidates = clean.endsWith('/') || clean === '/'
        ? [path.join(rootDir, relative, 'index.html'), path.join(rootDir, `${relative}.html`)]
        : [
            path.join(rootDir, relative),
            path.join(rootDir, relative, 'index.html'),
            path.join(rootDir, `${relative}.html`),
          ];
      for (const candidate of candidates) {
        if (candidate.startsWith(rootDir)) {
          try {
            const body = await readFile(candidate, 'utf8');
            return {status: 200, body, file: candidate};
          } catch {
            /* try the next candidate */
          }
        }
      }
      return {status: 404, body: '', file: null};
    },
    async listHtmlFiles() {
      const files = [];
      async function walk(current) {
        const entries = await readdir(current, {withFileTypes: true});
        for (const entry of entries) {
          const full = path.join(current, entry.name);
          if (entry.isDirectory()) {
            await walk(full);
          } else if (entry.name.endsWith('.html')) {
            files.push(full);
          }
        }
      }
      await walk(rootDir);
      return files;
    },
  };
}

/** Reads pages over HTTP from a running server. */
export function createHttpSource(baseUrl) {
  const root = baseUrl.replace(/\/+$/, '');
  return {
    kind: 'http',
    label: root,
    async get(route) {
      const response = await fetch(`${root}${route}`, {redirect: 'manual'});
      const body = response.status === 200 ? await response.text() : '';
      return {
        status: response.status,
        body,
        file: null,
        location: response.headers.get('location') ?? '',
      };
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Checks                                                                     */
/* -------------------------------------------------------------------------- */

function createCheck(id, title) {
  return {id, title, failures: [], notes: [], counts: {}, passed: true};
}

function recordFailure(check, message) {
  if (check.failures.length < MAX_FAILURES_PER_CHECK) {
    check.failures.push(message);
  }
  if (check.failures.length === MAX_FAILURES_PER_CHECK) {
    check.failures.push('... further failures suppressed');
  }
  check.passed = false;
}

function finish(check) {
  check.passed = check.failures.length === 0;
  return check;
}

export async function checkLegacyAliases({source, legacy, origin, basePath}) {
  const check = createCheck('legacy-aliases', 'Legacy URLs redirect to their target');
  check.counts.aliases = 0;
  check.counts.ok = 0;

  for (const [legacyPath, target] of Object.entries(legacy)) {
    if (legacyPath === '/' && target === '/') {
      check.notes.push('Skipped the identity entry "/" -> "/" (it is the home page).');
      continue;
    }
    check.counts.aliases += 1;
    const response = await source.get(legacyPath);
    const expected = normalizeRoute(target, {origin, basePath});
    if (response.location) {
      const redirect = normalizeRoute(response.location, {origin, basePath});
      if ([301, 302, 303, 307, 308].includes(response.status) && redirect === expected) {
        check.counts.redirected = (check.counts.redirected ?? 0) + 1;
        check.counts.ok += 1;
        continue;
      }
      const cleanUrl = normalizeRoute(legacyPath.replace(/\.html$/i, ''), {origin, basePath});
      if ([301, 302, 303, 307, 308].includes(response.status) && redirect === cleanUrl) {
        // `docusaurus serve` strips `.html` from every URL before serving; a
        // static host serves the alias file itself. The alias file is verified
        // by the directory mode of this check.
        check.counts.cleanUrlRedirects = (check.counts.cleanUrlRedirects ?? 0) + 1;
        check.notes.push(`${legacyPath} is served through a clean-URL redirect to ${redirect}.`);
        check.counts.ok += 1;
        continue;
      }
      recordFailure(
        check,
        `${legacyPath} -> HTTP ${response.status} ${redirect}, expected 200 or a redirect to ${expected}`,
      );
      continue;
    }
    if (response.status !== 200) {
      recordFailure(check, `${legacyPath} -> HTTP ${response.status} (expected 200)`);
      continue;
    }
    const canonical = extractCanonical(response.body);
    const refresh = extractRefreshUrl(response.body);
    const canonicalRoute = normalizeRoute(canonical, {origin, basePath});
    const refreshRoute = normalizeRoute(refresh, {origin, basePath});
    if (!canonical) {
      recordFailure(check, `${legacyPath} has no canonical link`);
    } else if (canonicalRoute !== expected) {
      recordFailure(
        check,
        `${legacyPath} canonical is ${canonicalRoute}, expected ${expected}`,
      );
    }
    if (!refresh) {
      recordFailure(check, `${legacyPath} has no meta refresh`);
    } else if (refreshRoute !== expected) {
      recordFailure(check, `${legacyPath} meta refresh is ${refreshRoute}, expected ${expected}`);
    }
    if (!extractTitle(response.body)) {
      recordFailure(check, `${legacyPath} has an empty <title>`);
    }
    if (canonicalRoute === expected && refreshRoute === expected) {
      check.counts.ok += 1;
    }
  }

  return finish(check);
}

export async function checkDestinations({source, legacy, origin, basePath}) {
  const check = createCheck('destinations', 'Canonical routes resolve with a title, h1 and canonical');
  const targets = [...new Set(Object.values(legacy))];
  check.counts.targets = targets.length;
  check.counts.ok = 0;

  for (const target of targets) {
    const response = await source.get(target);
    if (response.status !== 200) {
      recordFailure(check, `${target} -> HTTP ${response.status} (expected 200)`);
      continue;
    }
    const title = extractTitle(response.body);
    const h1s = extractH1s(response.body);
    const canonical = normalizeRoute(extractCanonical(response.body), {origin, basePath});
    const expected = normalizeRoute(target, {origin, basePath});

    let ok = true;
    if (!title) {
      recordFailure(check, `${target} has an empty <title>`);
      ok = false;
    }
    if (h1s.length !== 1) {
      recordFailure(check, `${target} has ${h1s.length} <h1> elements, expected exactly 1`);
      ok = false;
    } else if (!h1s[0]) {
      recordFailure(check, `${target} has an empty <h1>`);
      ok = false;
    }
    if (canonical !== expected) {
      recordFailure(check, `${target} canonical is ${canonical || '(none)'}, expected ${expected}`);
      ok = false;
    }
    if (ok) {
      check.counts.ok += 1;
    }
  }

  return finish(check);
}

export async function checkSitemap({source, legacy, origin, basePath}) {
  const check = createCheck('sitemap', 'Sitemap lists every canonical route and no alias');
  const response = await source.get('/sitemap.xml');
  if (response.status !== 200) {
    recordFailure(check, `sitemap.xml -> HTTP ${response.status} (expected 200)`);
    return finish(check);
  }

  const urls = parseSitemapUrls(response.body);
  const routes = urls.map((url) => normalizeRoute(url, {origin, basePath}));
  check.counts.urls = urls.length;

  for (const url of urls) {
    if (!/^https?:\/\//i.test(url)) {
      recordFailure(check, `sitemap entry is not absolute: ${url}`);
    }
  }

  const seen = new Set();
  for (const route of routes) {
    if (seen.has(route)) {
      recordFailure(check, `duplicate sitemap entry: ${route}`);
    }
    seen.add(route);
    if (route.endsWith('.html')) {
      recordFailure(check, `legacy alias listed in the sitemap: ${route}`);
    }
  }

  const targets = [...new Set(Object.values(legacy))].map((target) =>
    normalizeRoute(target, {origin, basePath}),
  );
  const missing = targets.filter((target) => !seen.has(target));
  for (const target of missing) {
    recordFailure(check, `canonical route missing from the sitemap: ${target}`);
  }

  check.counts.targets = targets.length;
  check.counts.targetsListed = targets.length - missing.length;
  return finish(check);
}

export async function checkRobots({source, origin, production = true}) {
  const check = createCheck('robots', 'robots.txt allows crawling and points at the sitemap');
  const response = await source.get('/robots.txt');
  if (response.status !== 200) {
    recordFailure(check, `robots.txt -> HTTP ${response.status} (expected 200)`);
    return finish(check);
  }

  const body = response.body;
  const sitemap = `${origin}/sitemap.xml`;
  if (production && !new RegExp(`Sitemap:\\s*${origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/sitemap\\.xml`, 'i').test(body)) {
    recordFailure(check, `robots.txt does not advertise ${sitemap}`);
  }
  if (!production) {
    // The preview lane is served from a project path but ships the production
    // robots.txt (which points at the custom domain) on purpose.
    check.notes.push(`Preview lane: the sitemap pointer is not asserted (${sitemap}).`);
  }
  if (!robotsAllowsEverything(body)) {
    recordFailure(check, 'robots.txt blocks the whole site with "Disallow: /" for all agents');
  }
  return finish(check);
}

export async function checkCname({source}) {
  const check = createCheck('cname', `CNAME is ${EXPECTED_CNAME}`);
  const response = await source.get('/CNAME');
  if (response.status !== 200) {
    recordFailure(check, `CNAME -> HTTP ${response.status} (expected 200)`);
    return finish(check);
  }
  const value = normalizeText(response.body);
  if (value !== EXPECTED_CNAME) {
    recordFailure(check, `CNAME is "${value}", expected "${EXPECTED_CNAME}"`);
  }
  return finish(check);
}

export async function checkFeeds({source, origin, basePath}) {
  const check = createCheck('feeds', `RSS/Atom feeds are served with ${EXPECTED_RSS_ITEMS} items`);
  for (const route of ['/blog/rss.xml', '/blog/atom.xml']) {
    const response = await source.get(route);
    if (response.status !== 200) {
      recordFailure(check, `${route} -> HTTP ${response.status} (expected 200)`);
      continue;
    }
    if (!/^\s*<\?xml/i.test(response.body)) {
      recordFailure(check, `${route} does not look like an XML document`);
      continue;
    }
    const items = countMatches(response.body, /<item>/g);
    if (route.endsWith('rss.xml')) {
      check.counts.rssItems = items;
      if (items !== EXPECTED_RSS_ITEMS) {
        recordFailure(check, `${route} has ${items} items, expected ${EXPECTED_RSS_ITEMS}`);
      }
      const links = parseRssLinks(response.body);
      if (links.length !== items) {
        recordFailure(check, `${route} has ${links.length} item links for ${items} items`);
      }
      for (const link of links) {
        if (!link.startsWith(`${origin}/`)) {
          recordFailure(check, `${route} item link is not on ${origin}: ${link}`);
          break;
        }
      }
      for (const link of links.slice(0, 10)) {
        const target = normalizeRoute(link, {origin, basePath});
        const post = await source.get(target);
        if (post.status !== 200) {
          recordFailure(check, `${route} item link ${target} -> HTTP ${post.status}`);
        }
      }
    }
  }
  return finish(check);
}

export async function checkTagPages({source, tagsYaml}) {
  const check = createCheck('tag-pages', 'Tag index and every tag page resolve');
  const slugs = parseTagSlugs(tagsYaml);
  check.counts.tags = slugs.length;

  const index = await source.get('/blog/tags');
  if (index.status !== 200) {
    recordFailure(check, `/blog/tags -> HTTP ${index.status} (expected 200)`);
  }
  for (const slug of slugs) {
    const route = `/blog/tags/${slug}`;
    const response = await source.get(route);
    if (response.status !== 200) {
      recordFailure(check, `${route} -> HTTP ${response.status} (expected 200)`);
      continue;
    }
    const h1s = extractH1s(response.body);
    if (h1s.length !== 1) {
      recordFailure(check, `${route} has ${h1s.length} <h1> elements, expected exactly 1`);
    }
  }
  return finish(check);
}

export async function checkInternalLinks({source, origin, basePath}) {
  const check = createCheck('internal-links', 'No built page links to a missing page');
  const pages = new Map();

  if (source.kind === 'dir') {
    for (const file of await source.listHtmlFiles()) {
      const body = await readFile(file, 'utf8');
      const route = `/${path.relative(path.resolve(source.label), file).replace(/\\/g, '/')}`
        .replace(/\/index\.html$/, '')
        .replace(/^\/index\.html$/, '/');
      pages.set(route, body);
    }
  } else {
    const sitemap = await source.get('/sitemap.xml');
    const routes = parseSitemapUrls(sitemap.body).map((url) => normalizeRoute(url, {origin, basePath}));
    for (const route of routes) {
      const response = await source.get(route);
      pages.set(route, response.body);
    }
  }

  const checked = new Map();
  for (const [route, body] of pages) {
    for (const href of extractHrefs(body)) {
      if (!isInternalHref(href)) {
        continue;
      }
      if (/^https?:\/\//i.test(href) && !href.startsWith(`${origin}/`)) {
        continue;
      }
      let resolved;
      try {
        resolved = normalizeRoute(new URL(href, `${origin}${route === '/' ? '/' : route}`).href, {
          origin,
          basePath,
        });
      } catch {
        recordFailure(check, `${route} has an unparseable href: ${href}`);
        continue;
      }
      if (!checked.has(resolved)) {
        checked.set(resolved, route);
      }
    }
  }

  check.counts.pages = pages.size;
  check.counts.links = checked.size;
  for (const [target, from] of checked) {
    const response = await source.get(target);
    if (response.status !== 200) {
      recordFailure(check, `${from} links to ${target}, which returns HTTP ${response.status}`);
    }
  }
  return finish(check);
}

/* -------------------------------------------------------------------------- */
/* Content parity against the legacy source                                   */
/* -------------------------------------------------------------------------- */

/** Leading phrase of a title, before a `|`, `-` or dash-separated suffix. */
export function titleHead(title) {
  return String(title)
    .split(/\s+[|\u2013\u2014-]\s+/)[0]
    .trim();
}

/**
 * How the rebuilt title relates to the legacy one:
 *
 *   - `exact`       same string
 *   - `site-suffix` the same leading phrase, with the legacy per-page suffix
 *                   replaced by the site-wide `| Sports Tools Hub` template
 *   - `delta`       anything else, which has to be reviewed in the baseline
 */
export function compareTitle(sourceTitle, builtTitle, siteName = SITE_NAME) {
  if (sourceTitle === builtTitle) {
    return 'exact';
  }
  const head = titleHead(sourceTitle);
  if (builtTitle === head || builtTitle === `${head} | ${siteName}`) {
    return 'site-suffix';
  }
  return 'delta';
}

function sourceFileFor(rootDir, legacyPath) {
  return path.join(rootDir, legacyPath === '/' ? 'index.html' : legacyPath);
}

export const DELTA_CATEGORIES = {
  'emoji-stripped':
    'The legacy heading opened with an emoji that the legacy markup garbled; the rebuilt heading is the plain text.',
  'blog-frontmatter':
    'The rebuilt heading/title comes from the reviewed frontmatter generated by the blog conversion, which also fixed legacy copy issues.',
  'catalog-frontmatter':
    'The rebuilt title/heading comes from the tool catalog frontmatter rather than the legacy title tag.',
  'static-page-frontmatter':
    'The rebuilt title/heading comes from the page frontmatter.',
  'source-missing': 'The legacy page had no heading; the rebuild adds one.',
};

export function classifyDelta(legacyPath, field, sourceValue, builtValue) {
  if (!sourceValue) {
    return 'source-missing';
  }
  if (EMOJI.test(sourceValue) && !EMOJI.test(builtValue)) {
    return 'emoji-stripped';
  }
  if (legacyPath.startsWith('/blog/')) {
    return 'blog-frontmatter';
  }
  if (legacyPath.startsWith('/tools/')) {
    return 'catalog-frontmatter';
  }
  return 'static-page-frontmatter';
}

export async function collectContentDeltas({source, legacy, origin, basePath, sourceDir}) {
  const deltas = [];
  const skipped = [];
  const suffixDeltas = [];
  for (const [legacyPath, target] of Object.entries(legacy)) {
    if (legacyPath === '/') {
      skipped.push({path: legacyPath, reason: 'identity entry'});
      continue;
    }
    const sourcePath = sourceFileFor(sourceDir, legacyPath);
    let sourceHtml;
    try {
      sourceHtml = await readFile(sourcePath, 'utf8');
    } catch {
      skipped.push({path: legacyPath, reason: 'no legacy source file'});
      continue;
    }
    const response = await source.get(target);
    if (response.status !== 200) {
      continue; // reported by the destinations check
    }
    const sourceTitle = extractTitle(sourceHtml);
    const builtTitle = extractTitle(response.body);
    const titleRelation = compareTitle(sourceTitle, builtTitle);
    if (titleRelation === 'site-suffix') {
      suffixDeltas.push({path: legacyPath, source: sourceTitle, built: builtTitle});
    } else if (titleRelation === 'delta') {
      deltas.push({
        path: legacyPath,
        field: 'title',
        category: classifyDelta(legacyPath, 'title', sourceTitle, builtTitle),
        source: sourceTitle,
        built: builtTitle,
        target: normalizeRoute(target, {origin, basePath}),
      });
    }

    const sourceH1 = extractH1s(sourceHtml)[0] ?? '';
    const builtH1 = extractH1s(response.body)[0] ?? '';
    if (sourceH1 !== builtH1) {
      deltas.push({
        path: legacyPath,
        field: 'h1',
        category: classifyDelta(legacyPath, 'h1', sourceH1, builtH1),
        source: sourceH1,
        built: builtH1,
        target: normalizeRoute(target, {origin, basePath}),
      });
    }
  }
  return {deltas, skipped, suffixDeltas};
}

export function compareWithBaseline(deltas, baseline) {
  const known = new Map();
  for (const entry of baseline?.deltas ?? []) {
    known.set(`${entry.path}|${entry.field}`, entry);
  }

  const unreviewed = [];
  const changed = [];
  const matched = new Set();

  for (const delta of deltas) {
    const key = `${delta.path}|${delta.field}`;
    const entry = known.get(key);
    if (!entry) {
      unreviewed.push(delta);
      continue;
    }
    matched.add(key);
    if (entry.source !== delta.source || entry.built !== delta.built) {
      changed.push({delta, baseline: entry});
    }
  }

  const stale = [...known.entries()]
    .filter(([key]) => !matched.has(key))
    .map(([, entry]) => entry);

  return {unreviewed, changed, stale, reviewed: matched.size};
}

function summarizeBaseline(deltas, skipped) {
  return {
    version: 1,
    note:
      'Reviewed content differences between the legacy static site and the rebuild. ' +
      'Generated by `npm run parity:baseline`; every entry is intentional and ' +
      '`npm run parity:check` fails when a new difference shows up or a recorded one changes.',
    categories: DELTA_CATEGORIES,
    deltas: deltas
      .map(({path: deltaPath, field, category, source, built}) => ({
        path: deltaPath,
        field,
        category,
        source,
        built,
      }))
      .sort((a, b) => a.path.localeCompare(b.path) || a.field.localeCompare(b.field)),
    skipped,
  };
}

export async function checkContentParity({source, legacy, origin, basePath, sourceDir, baseline}) {
  const check = createCheck('content-parity', 'Titles and h1s still match the legacy source');
  const {deltas, skipped, suffixDeltas} = await collectContentDeltas({
    source,
    legacy,
    origin,
    basePath,
    sourceDir,
  });
  const comparison = compareWithBaseline(deltas, baseline);

  check.counts.deltas = deltas.length;
  check.counts.reviewed = comparison.reviewed;
  check.counts.unreviewed = comparison.unreviewed.length;
  check.counts.siteSuffixTitles = suffixDeltas.length;
  check.counts.skipped = skipped.length;

  if (suffixDeltas.length > 0) {
    const examples = suffixDeltas
      .slice(0, 5)
      .map((entry) => `${entry.path}: "${entry.source}" -> "${entry.built}"`)
      .join('; ');
    check.notes.push(
      `${suffixDeltas.length} legacy titles only differ in their trailing suffix, which the ` +
        `"<page title> | ${SITE_NAME}" template replaces (e.g. ${examples})`,
    );
  }

  for (const delta of comparison.unreviewed) {
    recordFailure(
      check,
      `${delta.path} ${delta.field} differs from the legacy source (${delta.category}): ` +
        `"${delta.source}" -> "${delta.built}"`,
    );
  }
  for (const {delta, baseline: entry} of comparison.changed) {
    recordFailure(
      check,
      `${delta.path} ${delta.field} changed since it was reviewed ` +
        `(baseline "${entry.source}" -> "${entry.built}", now "${delta.source}" -> "${delta.built}")`,
    );
  }
  for (const entry of comparison.stale) {
    check.notes.push(
      `Stale baseline entry (no longer differs): ${entry.path} ${entry.field}`,
    );
  }
  for (const skip of skipped) {
    check.notes.push(`Skipped ${skip.path}: ${skip.reason}.`);
  }

  return {check: finish(check), deltas, skipped, suffixDeltas};
}

/* -------------------------------------------------------------------------- */
/* Representative pages                                                       */
/* -------------------------------------------------------------------------- */

export function createKeyPages(basePath = '/') {
  const prefix = basePath === '/' ? '' : basePath.replace(/\/+$/, '');
  const linkPrefix = (route) => new RegExp(`href=["']?${prefix}${route}`, 'g');
  return [
    {
      route: '/',
      label: 'home',
      assertions: [
        {
          test: (html) => countMatches(html, linkPrefix('/tools/')) >= 41,
          message: 'lists fewer than 41 tools',
        },
        {test: (html) => /<footer\b/i.test(html), message: 'has no footer'},
      ],
    },
    {
      route: '/tools/bmi-calculator',
      label: 'BMI calculator',
      assertions: [
        {test: (html) => countMatches(html, /<input\b/gi) >= 2, message: 'has fewer than 2 inputs'},
        {test: (html) => countMatches(html, /<form\b/gi) >= 1, message: 'has no form'},
      ],
    },
    {
      route: '/blog/basketball/10-essential-basketball-drills',
      label: 'article',
      assertions: [
        {
          test: (html) => countMatches(html, /<h2\b/gi) >= 3,
          message: 'has fewer than 3 h2 sections',
        },
      ],
    },
    {
      route: '/blog',
      label: 'blog index',
      assertions: [
        {
          test: (html) => countMatches(html, linkPrefix('/blog/')) >= 12,
          message: 'lists fewer than 12 posts',
        },
        {
          test: (html) => extractH1s(html).length === 1,
          message: 'does not have exactly one h1',
        },
      ],
    },
  ];
}

export async function checkKeyPages({source, basePath = '/'}) {
  const check = createCheck('key-pages', 'Representative pages keep their structure');
  const pages = createKeyPages(basePath);
  check.counts.pages = pages.length;
  for (const page of pages) {
    const response = await source.get(page.route);
    if (response.status !== 200) {
      recordFailure(check, `${page.route} -> HTTP ${response.status} (expected 200)`);
      continue;
    }
    for (const assertion of page.assertions) {
      if (!assertion.test(response.body)) {
        recordFailure(check, `${page.label} (${page.route}) ${assertion.message}`);
      }
    }
  }
  return finish(check);
}

/* -------------------------------------------------------------------------- */
/* Orchestration                                                              */
/* -------------------------------------------------------------------------- */

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

export async function runParityCheck(options = {}) {
  const settings = {
    ...parseArgs([]),
    ...options,
  };
  const origin = settings.origin;
  const basePath = settings.basePath;
  const source = settings.baseUrl
    ? createHttpSource(settings.baseUrl)
    : createDirSource(path.resolve(ROOT, settings.dir));

  if (source.kind === 'dir' && !(await exists(path.resolve(ROOT, settings.dir)))) {
    throw new Error(`Build directory not found: ${path.resolve(ROOT, settings.dir)}`);
  }

  const legacyFile = path.resolve(ROOT, settings.legacyFile);
  const legacy = JSON.parse(await readFile(legacyFile, 'utf8'));
  const baselineFile = settings.updateBaseline ? null : path.resolve(ROOT, settings.baselineFile);
  const baseline = baselineFile && (await exists(baselineFile))
    ? JSON.parse(await readFile(baselineFile, 'utf8'))
    : {deltas: []};

  const tagsYaml = await readFile(path.join(ROOT, 'blog/tags.yml'), 'utf8');
  const checks = [];

  checks.push(await checkLegacyAliases({source, legacy, origin, basePath}));
  checks.push(await checkDestinations({source, legacy, origin, basePath}));
  checks.push(await checkSitemap({source, legacy, origin, basePath}));
  checks.push(await checkRobots({source, origin, production: !settings.preview}));
  if (settings.preview) {
    const check = createCheck('cname', `CNAME is ${EXPECTED_CNAME}`);
    check.notes.push('Skipped: preview build, which deletes CNAME by design.');
    checks.push(check);
  } else {
    checks.push(await checkCname({source}));
  }
  checks.push(await checkFeeds({source, origin, basePath}));
  checks.push(await checkTagPages({source, tagsYaml}));
  checks.push(await checkInternalLinks({source, origin, basePath}));
  checks.push(await checkKeyPages({source, basePath}));

  let contentResult = null;
  const sourceDir = settings.sourceDir && path.resolve(settings.sourceDir);
  const contentAvailable = !settings.skipContent && sourceDir && (await exists(sourceDir));

  if (!contentAvailable) {
    const check = createCheck('content-parity', 'Titles and h1s still match the legacy source');
    check.notes.push(
      settings.skipContent
        ? 'Skipped: --skip-content was passed.'
        : `Skipped: no legacy source checkout at ${settings.sourceDir} (set PARITY_SOURCE_DIR).`,
    );
    checks.push(check);
  } else if (settings.updateBaseline) {
    contentResult = await collectContentDeltas({source, legacy, origin, basePath, sourceDir});
    const check = createCheck('content-parity', 'Titles and h1s still match the legacy source');
    check.notes.push(`Baseline snapshot rewritten with ${contentResult.deltas.length} deltas.`);
    checks.push(check);
  } else {
    contentResult = await checkContentParity({
      source,
      legacy,
      origin,
      basePath,
      sourceDir,
      baseline,
    });
    checks.push(contentResult.check);
  }

  if (source.kind === 'http') {
    const check = createCheck('unknown-route', 'Unknown routes answer 404');
    const response = await source.get('/this-route-does-not-exist-parity-check');
    if (response.status !== 404) {
      recordFailure(check, `unknown route -> HTTP ${response.status} (expected 404)`);
    }
    checks.push(finish(check));
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: source.kind,
    location: source.label,
    origin,
    basePath,
    legacyUrls: Object.keys(legacy).length,
    siteSuffixTitleDeltas: contentResult?.suffixDeltas ?? [],
    checks,
    totals: {
      checks: checks.length,
      passed: checks.filter((check) => check.passed).length,
      failed: checks.filter((check) => !check.passed).length,
      failures: checks.reduce((sum, check) => sum + check.failures.length, 0),
    },
  };

  if (settings.updateBaseline && contentResult) {
    const snapshot = summarizeBaseline(contentResult.deltas, contentResult.skipped);
    const target = path.resolve(ROOT, settings.baselineFile);
    await mkdir(path.dirname(target), {recursive: true});
    await writeFile(target, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
    report.baseline = {file: target, deltas: snapshot.deltas.length};
  }

  if (settings.reportFile) {
    const target = path.resolve(ROOT, settings.reportFile);
    await mkdir(path.dirname(target), {recursive: true});
    await writeFile(target, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }

  return report;
}

export function formatSummary(report, {verbose = false} = {}) {
  const lines = [];
  const mode = report.mode === 'http' ? `http ${report.location}` : `dir ${report.location}`;
  lines.push(`Parity check (${mode}) — ${report.legacyUrls} legacy URLs`);
  for (const check of report.checks) {
    const counts = Object.entries(check.counts)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');
    lines.push(
      `${check.passed ? 'PASS' : 'FAIL'}  ${check.id}${counts ? `  (${counts})` : ''}`,
    );
    for (const note of check.notes) {
      lines.push(`      note: ${note}`);
    }
    const limit = verbose ? check.failures.length : Math.min(check.failures.length, 8);
    for (const failure of check.failures.slice(0, limit)) {
      lines.push(`      - ${failure}`);
    }
    if (!verbose && check.failures.length > limit) {
      lines.push(`      - ... ${check.failures.length - limit} more`);
    }
  }
  lines.push(
    `${report.totals.failed === 0 ? 'PASS' : 'FAIL'}  ${report.totals.passed}/${report.totals.checks} checks, ` +
      `${report.totals.failures} failures`,
  );
  return lines.join('\n');
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
    return;
  }
  if (options.help) {
    process.stdout.write(
      [
        'Usage: node scripts/parity-check.mjs [options]',
        '',
        '  --dir=build                 check the build output on disk (default)',
        '  --base-url=http://...       check a running server instead',
        '  --origin=https://...        expected canonical origin',
        '  --base-path=/prefix/        baseUrl of the build',
        '  --source-dir=...            legacy site checkout (default $PARITY_SOURCE_DIR)',
        '  --baseline=...              reviewed content delta snapshot',
        '  --update-baseline           rewrite the snapshot from the current build',
        '  --skip-content              skip the source comparison',
        '  --preview                   relax the production-only checks (CNAME, sitemap domain)',
        '  --json=...                  write the machine-readable report',
        '  --verbose                   print every failure',
        '',
      ].join('\n'),
    );
    return;
  }

  const report = await runParityCheck(options);
  process.stdout.write(`${formatSummary(report, {verbose: options.verbose})}\n`);
  process.stdout.write(`report: ${path.resolve(ROOT, options.reportFile)}\n`);
  if (report.totals.failed > 0) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 2;
  });
}
