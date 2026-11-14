import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
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

export type AliasReport = {
  emitted: AliasEntry[];
  missing: AliasEntry[];
  skipped: AliasEntry[];
  conflicts: AliasConflict[];
};

type EmitOptions = {
  outDir: string;
  siteUrl: string;
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
  return join(outDir, target.slice(1), 'index.html');
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

function toAbsoluteUrl(siteUrl: string, target: string): string {
  const base = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
  return new URL(target, base).toString();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildAliasHtml({title, canonical}: {title: string; canonical: string}): string {
  const safeTitle = escapeHtml(title);
  const safeCanonical = escapeHtml(canonical);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<link rel="canonical" href="${safeCanonical}">
<meta http-equiv="refresh" content="0; url=${safeCanonical}">
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
  legacyUrls: aliases,
  strict = false,
}: EmitOptions): AliasReport {
  const entries = Object.entries(aliases).sort(([left], [right]) => left.localeCompare(right));
  const report: AliasReport = {emitted: [], missing: [], skipped: [], conflicts: []};

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
    }
  }

  if (strict && (report.missing.length > 0 || report.conflicts.length > 0)) {
    const missing = report.missing
      .slice(0, 10)
      .map(({legacyPath, target}) => `${legacyPath} -> ${target}`)
      .join(', ');
    const conflicts = report.conflicts
      .slice(0, 10)
      .map(({legacyPath, aliasFile}) => `${legacyPath} (${aliasFile})`)
      .join(', ');
    throw new Error(
      `Legacy alias validation failed: ${report.missing.length} missing target(s), ` +
        `${report.conflicts.length} conflict(s). Missing: ${missing || 'none'}. ` +
        `Conflicts: ${conflicts || 'none'}.`,
    );
  }

  const missing = new Set(report.missing.map(({legacyPath}) => legacyPath));
  const conflicts = new Set(report.conflicts.map(({legacyPath}) => legacyPath));

  for (const [legacyPath, target] of entries) {
    if (legacyPath === target || missing.has(legacyPath) || conflicts.has(legacyPath)) {
      continue;
    }
    const targetFile = targetToOutputFile(outDir, target);
    const aliasFile = legacyToOutputFile(outDir, legacyPath);
    const targetHtml = readFileSync(targetFile, 'utf8');
    const title = extractTitle(targetHtml) ?? target;
    const canonical = extractCanonical(targetHtml) ?? toAbsoluteUrl(siteUrl, target);
    mkdirSync(dirname(aliasFile), {recursive: true});
    writeFileSync(aliasFile, buildAliasHtml({title, canonical}));
    report.emitted.push({legacyPath, target});
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
          `conflicts ${report.conflicts.length}`,
      );
    },
  };
}
