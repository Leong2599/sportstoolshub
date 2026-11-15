import {describe, expect, it} from 'vitest';
import legacyUrlData from './legacy-urls.json';

const legacyUrls = legacyUrlData as Record<string, string>;
const entries = Object.entries(legacyUrls);
const targets = Object.values(legacyUrls);

describe('legacy URL contract', () => {
  it('covers every legacy path, with the about page represented twice', () => {
    expect(entries).toHaveLength(259);
    expect(new Set(targets).size).toBe(258);
  });

  it('keeps the home page as a self-mapped route', () => {
    expect(legacyUrls['/']).toBe('/');
  });

  it('maps both about spellings and the blog index', () => {
    expect(legacyUrls['/about.html']).toBe('/about/');
    expect(legacyUrls['/tools/about.html']).toBe('/about/');
    expect(legacyUrls['/blog/blog.html']).toBe('/blog/');
  });

  it('maps every tool page to a clean tools route', () => {
    const tools = entries.filter(
      ([legacyPath]) =>
        /^\/tools\/[a-z0-9-]+\.html$/.test(legacyPath) && legacyPath !== '/tools/about.html',
    );
    expect(tools).toHaveLength(41);
    for (const [legacyPath, target] of tools) {
      expect(target).toBe(`${legacyPath.replace(/\.html$/, '')}/`);
    }
  });

  it('maps every blog post to a clean sport route', () => {
    const posts = entries.filter(([legacyPath]) =>
      /^\/blog\/[a-z0-9-]+\/[a-z0-9-]+\.html$/.test(legacyPath),
    );
    expect(posts).toHaveLength(214);
    const sports = new Set(posts.map(([legacyPath]) => legacyPath.split('/')[2]));
    expect(sports.size).toBe(14);
    for (const [legacyPath, target] of posts) {
      expect(target).toBe(`${legacyPath.replace(/\.html$/, '')}/`);
    }
  });

  it('excludes the missing golf article and the dead blog cards', () => {
    expect(legacyUrls['/blog/golf/golf-equipment-guide.html']).toBeUndefined();
    expect(legacyUrls['/blog/basketball/basketball-shooting-mastery.html']).toBeUndefined();
    expect(legacyUrls['/blog/basketball/basketball-defense-guide.html']).toBeUndefined();
    expect(legacyUrls['/blog/soccer/soccer-warm-up-guide.html']).toBeUndefined();
    expect(legacyUrls['/blog/soccer/soccer-cooling-down-guide.html']).toBeUndefined();
  });

  it('does not alias /index.html over the built home page', () => {
    expect(legacyUrls['/index.html']).toBeUndefined();
  });

  it('uses safe canonical route shapes for every target', () => {
    for (const target of targets) {
      expect(target).toMatch(/^\//);
      expect(target).not.toContain('.html');
      expect(target).not.toContain('//');
      expect(target).not.toContain('?');
      expect(target).not.toContain('#');
      expect(target).toMatch(
        /^(?:\/|\/about\/|\/blog\/|\/tools\/[a-z0-9-]+\/|\/blog\/[a-z0-9-]+\/[a-z0-9-]+\/)$/,
      );
    }
  });

  it('points every target at the trailing-slash form GitHub Pages serves', () => {
    // GitHub Pages serves `/tools/x/` from `tools/x/index.html` and the
    // extensionless `/tools/x` from `tools/x.html` - the legacy alias file.
    // The canonical target therefore has to carry the trailing slash.
    for (const target of targets) {
      expect(target === '/' || target.endsWith('/')).toBe(true);
    }
  });

  it('uses safe legacy paths', () => {
    for (const [legacyPath] of entries) {
      expect(legacyPath).toMatch(/^\//);
      expect(legacyPath === '/' || legacyPath.endsWith('.html')).toBe(true);
      expect(legacyPath).not.toContain('?');
      expect(legacyPath).not.toContain('#');
      expect(legacyPath).not.toContain('//');
    }
  });
});
