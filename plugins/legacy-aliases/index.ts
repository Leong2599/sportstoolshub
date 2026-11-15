import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import type {LoadContext, Plugin} from '@docusaurus/types';
import legacyUrlsJson from '../../src/data/legacy-urls.json';

export type LegacyUrlMap = Record<string, string>;

type AliasEntry = {
  legacyPath: string;
  target: string;
};

type AliasConflict = AliasEntry & {
  aliasFile: string;
};

type BrokenAlias = AliasEntry & {
  reason: string;
};

export type AliasReport = {
  emitted: AliasEntry[];
  missing: AliasEntry[];
  skipped: AliasEntry[];
  conflicts: AliasConflict[];
  broken: BrokenAlias[];
};

type EmitOptions = {
  outDir: string;
  siteUrl: string;
  baseUrl?: string;
  legacyUrls: LegacyUrlMap;
  strict?: boolean;
};

type PluginOptions = {
  strict?: boolean;
};

const legacyUrls = legacyUrlsJson as LegacyUrlMap;

function assertSafeRoute(route: string): void {
  if (!route.startsWith('/') || route.includes('..') || route.includes('//')) {
    throw new Error(`Unsafe legacy route: ${route}`);
  }
}

export function targetToOutputFile(outDir: string, target: string): string {
  assertSafeRoute(target);
  if (target === '/') {
    return join(outDir, 'index.html');
  }
  return join(outDir, target.replace(/^\/+/, ''), 'index.html');
}

export function legacyToOutputFile(outDir: string, legacyPath: string): string {
  assertSafeRoute(legacyPath);
  if (legacyPath === '/') {
    return join(outDir, 'index.html');
  }
  if (legacyPath.endsWith('/')) {
    return join(outDir, legacyPath.slice(1), 'index.html');
  }
  return join(outDir, legacyPath.slice(1));
}

/**
 * The files GitHub Pages may serve for a URL, in the order it tries them.
 *
 * `/tools/bmi-calculator` is served from `tools/bmi-calculator.html` when that
 * file exists, and only falls back to `tools/bmi-calculator/index.html`
 * otherwise. `/tools/bmi-calculator/` is always served from
 * `tools/bmi-calculator/index.html`.
 */
export function staticCandidates(outDir: string, urlPath: string): string[] {
  const clean = urlPath.split(/[?#]/)[0] || '/';
  const relative = clean.replace(/^\/+/, '');
  return clean.endsWith('/')
    ? [join(outDir, relative, 'index.html')]
    : [
        join(outDir, relative),
        join(outDir, `${relative}.html`),
        join(outDir, relative, 'index.html'),
      ];
}

/**
 * Resolves a site path the way GitHub Pages resolves it.
 *
 * `pendingFile` is treated as if it already existed: an alias file is checked
 * against the routes it is about to shadow, before it is written.
 */
export function resolveStaticFile(
  outDir: string,
  urlPath: string,
  pendingFile?: string,
): string | undefined {
  for (const candidate of staticCandidates(outDir, urlPath)) {
    if (pendingFile && resolve(candidate) === resolve(pendingFile)) {
      return candidate;
    }
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return undefined;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code: string) => {
    if (code.startsWith('#')) {
      const hex = code[1]?.toLowerCase() === 'x';
      const numeric = Number.parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isNaN(numeric) ? match : String.fromCodePoint(numeric);
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

export function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = match?.[1]?.trim();
  return title ? decodeHtmlEntities(title) : undefined;
}

export function extractCanonical(html: string): string | undefined {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (!/\brel=["']?canonical["']?/i.test(tag)) {
      continue;
    }
    const href = tag.match(/\bhref=["']?([^"'\s>]+)/i);
    if (href?.[1]) {
      return decodeHtmlEntities(href[1]);
    }
  }
  return undefined;
}

/** The path of a URL, whether it is absolute or already a route. */
export function toUrlPath(url: string): string {
  if (url.startsWith('/')) {
    return url;
  }
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

/** Removes the base path a site is served under, if any. */
export function stripBaseUrl(path: string, baseUrl: string): string {
  const prefix = baseUrl === '/' ? '' : baseUrl.replace(/\/+$/, '');
  if (prefix && path.startsWith(prefix)) {
    return path.slice(prefix.length) || '/';
  }
  return path;
}

/** Appends a trailing slash to the path part of a URL, keeping query and hash. */
export function withTrailingSlash(url: string): string {
  const match = url.match(/^([^?#]*)([?#].*)?$/);
  const path = match?.[1] ?? url;
  const rest = match?.[2] ?? '';
  return path.endsWith('/') ? url : `${path}/${rest}`;
}

/**
 * The canonical URL an alias declares: the canonical URL of the target page,
 * exactly as that page declares it.
 */
export function resolveAliasCanonical(
  siteUrl: string,
  baseUrl: string,
  target: string,
  canonical: string | undefined,
): string {
  if (!canonical) {
    return withTrailingSlash(`${siteUrl.replace(/\/+$/, '')}${baseUrl.replace(/\/+$/, '')}${target}`);
  }
  return canonical.startsWith('/')
    ? `${siteUrl.replace(/\/+$/, '')}${canonical}`
    : canonical;
}

/**
 * The URL an alias redirects to.
 *
 * The trailing slash matters on GitHub Pages. `/tools/bmi-calculator/` is served
 * from `tools/bmi-calculator/index.html`, while `/tools/bmi-calculator` is served
 * from `tools/bmi-calculator.html` - the alias file itself. An alias that
 * pointed at the extensionless form would refresh into itself forever.
 */
export function resolveAliasRedirect(canonical: string): string {
  return withTrailingSlash(canonical);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildAliasHtml({
  title,
  canonical,
  redirect,
}: {
  title: string;
  canonical: string;
  redirect?: string;
}): string {
  const safeTitle = escapeHtml(title);
  const safeCanonical = escapeHtml(canonical);
  const safeRedirect = escapeHtml(redirect ?? canonical);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<link rel="canonical" href="${safeCanonical}">
<meta http-equiv="refresh" content="0; url=${safeRedirect}">
</head>
<body>
<p>This page has moved to <a href="${safeCanonical}">${safeTitle}</a>.</p>
</body>
</html>
`;
}

export function emitLegacyAliases({
  outDir,
  siteUrl,
  baseUrl = '/',
  legacyUrls: aliases,
  strict = false,
}: EmitOptions): AliasReport {
  const entries = Object.entries(aliases).sort(([left], [right]) => left.localeCompare(right));
  const report: AliasReport = {emitted: [], missing: [], skipped: [], conflicts: [], broken: []};
  const plans: {
    legacyPath: string;
    target: string;
    aliasFile: string;
    title: string;
    canonical: string;
    redirect: string;
  }[] = [];

  for (const [legacyPath, target] of entries) {
    if (legacyPath === target) {
      report.skipped.push({legacyPath, target});
      continue;
    }
    const targetFile = targetToOutputFile(outDir, target);
    if (!existsSync(targetFile)) {
      report.missing.push({legacyPath, target});
      continue;
    }
    const aliasFile = legacyToOutputFile(outDir, legacyPath);
    if (existsSync(aliasFile)) {
      report.conflicts.push({legacyPath, target, aliasFile});
      continue;
    }

    const targetHtml = readFileSync(targetFile, 'utf8');
    const title = extractTitle(targetHtml) ?? target;
    const canonical = resolveAliasCanonical(siteUrl, baseUrl, target, extractCanonical(targetHtml));
    const redirect = resolveAliasRedirect(canonical);

    // The alias file is also what GitHub Pages serves for the extensionless
    // route (`/tools/bmi-calculator` -> `tools/bmi-calculator.html`). It may
    // neither point at itself nor shadow the route it redirects to.
    const canonicalRoute = resolveStaticFile(outDir, target, aliasFile);
    if (canonicalRoute && resolve(canonicalRoute) === resolve(aliasFile)) {
      report.broken.push({
        legacyPath,
        target,
        reason: `canonical route ${target} resolves to the alias file itself`,
      });
      continue;
    }
    const canonicalFile = resolveStaticFile(
      outDir,
      stripBaseUrl(toUrlPath(canonical), baseUrl),
      aliasFile,
    );
    if (canonicalFile && resolve(canonicalFile) === resolve(aliasFile)) {
      report.broken.push({
        legacyPath,
        target,
        reason: `canonical URL ${canonical} resolves to the alias file itself`,
      });
      continue;
    }
    const redirectFile = resolveStaticFile(
      outDir,
      stripBaseUrl(toUrlPath(redirect), baseUrl),
      aliasFile,
    );
    if (redirectFile && resolve(redirectFile) === resolve(aliasFile)) {
      report.broken.push({
        legacyPath,
        target,
        reason: `redirect target ${redirect} resolves to the alias file itself`,
      });
      continue;
    }

    plans.push({legacyPath, target, aliasFile, title, canonical, redirect});
  }

  if (
    strict &&
    (report.missing.length > 0 || report.conflicts.length > 0 || report.broken.length > 0)
  ) {
    const missing = report.missing
      .slice(0, 10)
      .map(({legacyPath, target}) => `${legacyPath} -> ${target}`)
      .join(', ');
    const conflicts = report.conflicts
      .slice(0, 10)
      .map(({legacyPath, aliasFile}) => `${legacyPath} (${aliasFile})`)
      .join(', ');
    const broken = report.broken
      .slice(0, 10)
      .map(({legacyPath, reason}) => `${legacyPath} (${reason})`)
      .join(', ');
    throw new Error(
      `Legacy alias validation failed: ${report.missing.length} missing target(s), ` +
        `${report.conflicts.length} conflict(s), ${report.broken.length} broken alias(es). ` +
        `Missing: ${missing || 'none'}. Conflicts: ${conflicts || 'none'}. ` +
        `Broken: ${broken || 'none'}.`,
    );
  }

  for (const plan of plans) {
    mkdirSync(dirname(plan.aliasFile), {recursive: true});
    writeFileSync(
      plan.aliasFile,
      buildAliasHtml({title: plan.title, canonical: plan.canonical, redirect: plan.redirect}),
    );
    report.emitted.push({legacyPath: plan.legacyPath, target: plan.target});
  }

  return report;
}

export default function legacyAliasesPlugin(
  _context: LoadContext,
  options: PluginOptions = {},
): Plugin {
  const strict = options.strict ?? process.env.LEGACY_ALIASES_STRICT === '1';

  return {
    name: 'legacy-aliases',
    postBuild({outDir, siteConfig, generatedFilesDir}) {
      const report = emitLegacyAliases({
        outDir,
        siteUrl: siteConfig.url,
        baseUrl: siteConfig.baseUrl,
        legacyUrls,
        strict,
      });

      mkdirSync(generatedFilesDir, {recursive: true});
      writeFileSync(
        join(generatedFilesDir, 'legacy-aliases-report.json'),
        `${JSON.stringify(report, null, 2)}\n`,
      );

      console.log(
        `[legacy-aliases] emitted ${report.emitted.length}, ` +
          `missing ${report.missing.length}, skipped ${report.skipped.length}, ` +
          `conflicts ${report.conflicts.length}, broken ${report.broken.length}`,
      );
    },
  };
}
