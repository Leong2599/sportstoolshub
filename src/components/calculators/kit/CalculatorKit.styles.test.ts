import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const css = readFileSync(
  resolve(
    process.cwd(),
    'src',
    'components',
    'calculators',
    'kit',
    'CalculatorKit.module.css',
  ),
  'utf8',
);

describe('calculator kit styling', () => {
  it('uses CSS Modules without global escape hatches', () => {
    expect(css).not.toContain(':global');
    expect(css).not.toMatch(/composes:/);
  });

  it('does not introduce unscoped element selectors', () => {
    expect(css).not.toMatch(
      /^\s*(input|select|textarea|button|label|form|fieldset|legend)\b/m,
    );
  });

  it('reuses the shared brand tokens', () => {
    expect(css).toContain('var(--sth-form-focus-border)');
    expect(css).toContain('var(--sth-card-radius)');
    expect(css).toContain('var(--sth-result-value-color)');
  });
});
