import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

function readStyle(name: string): string {
  return readFileSync(resolve(process.cwd(), 'src', 'css', name), 'utf8');
}

const tokens = readStyle('tokens.css');
const custom = readStyle('custom.css');
const base = readStyle('base.css');
const shell = readStyle('shell.css');
const prose = readStyle('prose.css');

describe('brand tokens', () => {
  it('defines the primary palette and self-hosted font stack', () => {
    expect(tokens).toContain('--sth-color-primary: #3b82f6;');
    expect(tokens).toContain('--sth-color-primary-dark: #2563eb;');
    expect(tokens).toContain("--sth-font-sans: 'Inter'");
  });

  it('exposes card, form, and result tokens for the calculator kit', () => {
    expect(tokens).toContain('--sth-card-bg:');
    expect(tokens).toContain('--sth-form-focus-border:');
    expect(tokens).toContain('--sth-result-value-color:');
  });
});

describe('Infima integration', () => {
  it('imports every Inter weight used by the legacy site', () => {
    for (const weight of [300, 400, 500, 600, 700]) {
      expect(custom).toContain(`@import '@fontsource/inter/${weight}.css';`);
    }
  });

  it('maps brand tokens onto Infima variables', () => {
    expect(custom).toContain('--ifm-color-primary: var(--sth-color-primary);');
    expect(custom).toContain('--ifm-font-family-base: var(--sth-font-sans);');
    expect(custom).toContain('--ifm-background-color: var(--sth-color-bg);');
  });

  it('does not depend on third-party font hosts', () => {
    expect(custom).not.toContain('fonts.googleapis.com');
    expect(custom).not.toContain('fonts.gstatic.com');
  });
});

describe('scoped styling foundation', () => {
  it('defines the page-wrapper and prose conventions', () => {
    expect(shell).toContain('.sth-tool-page');
    expect(shell).toContain('.sth-blog-page');
    expect(prose).toContain('.sth-prose');
  });

  it('does not apply unscoped form-control rules', () => {
    for (const css of [base, shell, prose, custom]) {
      expect(css).not.toMatch(/^\s*(input|select|textarea|button)\b/m);
    }
  });
});
