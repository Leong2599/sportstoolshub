import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';

const staticDir = fileURLToPath(new URL('../../static/', import.meta.url));
const imageDir = `${staticDir}img/`;
const assetDir = fileURLToPath(new URL('../assets/', import.meta.url));

const read = (relativePath: string) =>
  readFileSync(`${staticDir}${relativePath}`, 'utf8');

describe('static assets', () => {
  it('ships the brand images the site references', () => {
    for (const image of [
      'logo.png',
      'og-image.jpg',
      'favicon.ico',
      'favicon-16x16.png',
      'favicon-32x32.png',
      'favicon-96x96.png',
      'apple-icon-180x180.png',
    ]) {
      expect(existsSync(`${imageDir}${image}`)).toBe(true);
    }

    // The hero photo is bundled from `src/assets/` so that the build ships
    // one copy of it instead of two.
    expect(existsSync(`${assetDir}hero-1.jpg`)).toBe(true);
  });

  it('keeps no unused images in static/img', () => {
    const referenced = new Set([
      'apple-icon-180x180.png',
      'favicon-16x16.png',
      'favicon-32x32.png',
      'favicon-96x96.png',
      'favicon.ico',
      'logo.png',
      'og-image.jpg',
    ]);

    expect(readdirSync(imageDir).sort()).toEqual([...referenced].sort());
  });

  it('serves the production domain from the CNAME file', () => {
    expect(read('CNAME').trim()).toBe('sportstoolshub.com');
  });

  it('keeps the nojekyll marker for GitHub Pages', () => {
    expect(existsSync(`${staticDir}.nojekyll`)).toBe(true);
  });

  it('points robots.txt at the generated sitemap', () => {
    const robots = read('robots.txt');

    expect(robots).toContain('Sitemap: https://sportstoolshub.com/sitemap.xml');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /sitemap.xml');
    expect(robots).not.toContain('sportstoolshub.com/index.html');
  });
});
