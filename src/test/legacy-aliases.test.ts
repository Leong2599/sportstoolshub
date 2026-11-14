import {existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {
  buildAliasHtml,
  emitLegacyAliases,
  extractCanonical,
  extractTitle,
  type LegacyUrlMap,
} from '../../plugins/legacy-aliases';

const siteUrl = 'https://sportstoolshub.com';

let outDir: string;

beforeEach(() => {
  outDir = mkdtempSync(join(tmpdir(), 'legacy-aliases-'));
});

afterEach(() => {
  rmSync(outDir, {recursive: true, force: true});
});

function writePage(route: string, title: string, canonical?: string): string {
  const file =
    route === '/'
      ? join(outDir, 'index.html')
      : join(outDir, route.slice(1), 'index.html');
  mkdirSync(dirname(file), {recursive: true});
  const canonicalTag = canonical
    ? `<link rel=canonical href=${canonical}>`
    : '';
  writeFileSync(
    file,
    `<!doctype html><html><head><title>${title}</title>${canonicalTag}</head><body>page</body></html>`,
  );
  return file;
}

describe('legacy alias emission', () => {
  it('emits aliases for existing targets and skips the self-mapped home route', () => {
    writePage('/', 'Sports Tools Hub', 'https://sportstoolshub.com/');
    writePage('/tools/bmi-calculator', 'BMI Calculator', 'https://sportstoolshub.com/tools/bmi-calculator');
    writePage('/about', 'About Sports Tools Hub', 'https://sportstoolshub.com/about');

    const map: LegacyUrlMap = {
      '/': '/',
      '/about.html': '/about',
      '/tools/about.html': '/about',
      '/tools/bmi-calculator.html': '/tools/bmi-calculator',
    };

    const report = emitLegacyAliases({outDir, siteUrl, legacyUrls: map});

    expect(report.missing).toHaveLength(0);
    expect(report.conflicts).toHaveLength(0);
    expect(report.skipped).toEqual([{legacyPath: '/', target: '/'}]);
    expect(report.emitted).toHaveLength(3);

    const bmiAlias = join(outDir, 'tools', 'bmi-calculator.html');
    const aboutAlias = join(outDir, 'about.html');
    const toolsAboutAlias = join(outDir, 'tools', 'about.html');

    expect(existsSync(bmiAlias)).toBe(true);
    expect(existsSync(aboutAlias)).toBe(true);
    expect(existsSync(toolsAboutAlias)).toBe(true);
    expect(existsSync(join(outDir, 'index.html'))).toBe(true);

    const html = readFileSync(bmiAlias, 'utf8');
    expect(html).toContain('<title>BMI Calculator</title>');
    expect(html).toContain(
      '<link rel="canonical" href="https://sportstoolshub.com/tools/bmi-calculator">',
    );
    expect(html).toContain(
      '<meta http-equiv="refresh" content="0; url=https://sportstoolshub.com/tools/bmi-calculator">',
    );
    expect(html).not.toContain('noindex');
  });

  it('falls back to the target route when the page has no canonical tag', () => {
    writePage('/about', 'About Sports Tools Hub');
    const report = emitLegacyAliases({
      outDir,
      siteUrl,
      legacyUrls: {'/about.html': '/about'},
    });

    expect(report.emitted).toHaveLength(1);
    expect(readFileSync(join(outDir, 'about.html'), 'utf8')).toContain(
      'href="https://sportstoolshub.com/about"',
    );
  });

  it('preserves entities from the target title without double escaping', () => {
    writePage('/about', 'About &amp; Contact');
    emitLegacyAliases({
      outDir,
      siteUrl,
      legacyUrls: {'/about.html': '/about'},
    });

    const html = readFileSync(join(outDir, 'about.html'), 'utf8');
    expect(html).toContain('<title>About &amp; Contact</title>');
    expect(html).not.toContain('&amp;amp;');
  });

  it('reports missing targets without writing aliases outside strict mode', () => {
    const report = emitLegacyAliases({
      outDir,
      siteUrl,
      legacyUrls: {'/tools/missing.html': '/tools/missing'},
    });

    expect(report.emitted).toHaveLength(0);
    expect(report.missing).toEqual([
      {legacyPath: '/tools/missing.html', target: '/tools/missing'},
    ]);
    expect(existsSync(join(outDir, 'tools', 'missing.html'))).toBe(false);
  });

  it('throws in strict mode when any target is missing', () => {
    expect(() =>
      emitLegacyAliases({
        outDir,
        siteUrl,
        legacyUrls: {'/tools/missing.html': '/tools/missing'},
        strict: true,
      }),
    ).toThrow(/Legacy alias validation failed/);
  });

  it('does not overwrite an existing route and reports the conflict', () => {
    writePage('/blog', 'Blog');
    const conflictPath = join(outDir, 'blog', 'blog.html');
    mkdirSync(dirname(conflictPath), {recursive: true});
    writeFileSync(conflictPath, 'existing content');

    const report = emitLegacyAliases({
      outDir,
      siteUrl,
      legacyUrls: {'/blog/blog.html': '/blog'},
    });

    expect(report.conflicts).toHaveLength(1);
    expect(report.emitted).toHaveLength(0);
    expect(readFileSync(conflictPath, 'utf8')).toBe('existing content');
  });

  it('throws in strict mode when an alias conflicts with an existing file', () => {
    writePage('/blog', 'Blog');
    const conflictPath = join(outDir, 'blog', 'blog.html');
    mkdirSync(dirname(conflictPath), {recursive: true});
    writeFileSync(conflictPath, 'existing content');

    expect(() =>
      emitLegacyAliases({
        outDir,
        siteUrl,
        legacyUrls: {'/blog/blog.html': '/blog'},
        strict: true,
      }),
    ).toThrow(/conflict/);
  });
});

describe('alias parsing helpers', () => {
  it('reads unquoted Docusaurus title and canonical tags', () => {
    const html =
      '<html><head><title>BMI &amp; Body Fat</title>' +
      '<link data-rh=true rel=canonical href=https://sportstoolshub.com/tools/bmi-calculator /></head></html>';

    expect(extractTitle(html)).toBe('BMI & Body Fat');
    expect(extractCanonical(html)).toBe('https://sportstoolshub.com/tools/bmi-calculator');
  });

  it('escapes title and URL content in alias HTML', () => {
    const html = buildAliasHtml({
      title: 'A & B <Tools>',
      canonical: 'https://sportstoolshub.com/tools/a?x=1&y=2',
    });

    expect(html).toContain('A &amp; B &lt;Tools&gt;');
    expect(html).toContain('href="https://sportstoolshub.com/tools/a?x=1&amp;y=2"');
    expect(html).not.toContain('noindex');
  });
});
