#!/usr/bin/env node
import {existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';

const EXCLUDED = new Map([
  [
    '/blog/golf/golf-equipment-guide.html',
    'Sitemap advertises a file that does not exist; D1 default is to drop it.',
  ],
  [
    '/blog/basketball/basketball-shooting-mastery.html',
    'Dead blog-card link with no source page; D1 default is to drop it.',
  ],
  [
    '/blog/basketball/basketball-defense-guide.html',
    'Dead blog-card link with no source page; D1 default is to drop it.',
  ],
  [
    '/blog/soccer/soccer-warm-up-guide.html',
    'Dead blog-card link with no source page; D1 default is to drop it.',
  ],
  [
    '/blog/soccer/soccer-cooling-down-guide.html',
    'Dead blog-card link with no source page; D1 default is to drop it.',
  ],
]);

const args = process.argv.slice(2);
const sourceArg = args.find((arg) => arg.startsWith('--source='))?.slice('--source='.length);
const sourceDir = resolve(sourceArg ?? process.env.SPORT_TOOLS_SOURCE ?? '');

if (!sourceArg && !process.env.SPORT_TOOLS_SOURCE) {
  console.error('Usage: node scripts/generate-legacy-urls.mjs --source=<sport_tools path>');
  process.exit(1);
}

if (!sourceDir || !existsSync(sourceDir)) {
  console.error(`Source directory not found: ${sourceDir}`);
  process.exit(1);
}

function readSitemapPaths() {
  const xml = readFileSync(join(sourceDir, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => {
    const url = new URL(match[1]);
    return decodeURIComponent(url.pathname);
  });
}

function readInventoryPaths() {
  const paths = ['/'];

  if (existsSync(join(sourceDir, 'about.html'))) {
    paths.push('/about.html');
  }

  for (const file of readdirSync(join(sourceDir, 'tools'))) {
    if (file.endsWith('.html')) {
      paths.push(`/tools/${file}`);
    }
  }

  if (existsSync(join(sourceDir, 'blog', 'blog.html'))) {
    paths.push('/blog/blog.html');
  }

  const blogDir = join(sourceDir, 'blog');
  for (const entry of readdirSync(blogDir, {withFileTypes: true})) {
    if (!entry.isDirectory()) {
      continue;
    }
    for (const file of readdirSync(join(blogDir, entry.name))) {
      if (file.endsWith('.html')) {
        paths.push(`/blog/${entry.name}/${file}`);
      }
    }
  }

  return paths;
}

function toTarget(legacyPath) {
  if (legacyPath === '/') {
    return '/';
  }
  if (legacyPath === '/about.html' || legacyPath === '/tools/about.html') {
    return '/about';
  }
  if (legacyPath === '/blog/blog.html') {
    return '/blog';
  }
  if (/^\/tools\/[a-z0-9-]+\.html$/.test(legacyPath)) {
    return legacyPath.replace(/\.html$/, '');
  }
  if (/^\/blog\/[a-z0-9-]+\/[a-z0-9-]+\.html$/.test(legacyPath)) {
    return legacyPath.replace(/\.html$/, '');
  }
  throw new Error(`Unsupported legacy path shape: ${legacyPath}`);
}

const sitemapPaths = readSitemapPaths();
const inventoryPaths = readInventoryPaths();
const union = [...new Set([...sitemapPaths, ...inventoryPaths])].sort();

const legacyUrls = {};
for (const legacyPath of union) {
  if (EXCLUDED.has(legacyPath)) {
    continue;
  }
  legacyUrls[legacyPath] = toTarget(legacyPath);
}

const outputPath = resolve(process.cwd(), 'src', 'data', 'legacy-urls.json');
mkdirSync(dirname(outputPath), {recursive: true});
writeFileSync(outputPath, `${JSON.stringify(legacyUrls, null, 2)}\n`);

const uniqueTargets = new Set(Object.values(legacyUrls));
console.log(`Legacy paths: ${Object.keys(legacyUrls).length}`);
console.log(`Unique targets: ${uniqueTargets.size}`);
console.log(`Sitemap paths: ${sitemapPaths.length}`);
console.log(`Inventory paths: ${inventoryPaths.length}`);
for (const [legacyPath, reason] of EXCLUDED) {
  console.log(`Excluded: ${legacyPath} — ${reason}`);
}
console.log(`Wrote ${outputPath}`);
