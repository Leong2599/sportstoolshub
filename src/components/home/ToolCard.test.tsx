// @vitest-environment jsdom
import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';
import {tools} from '../../data/tools';
import {ToolCard} from './ToolCard';

const bmi = tools[0];

afterEach(cleanup);

describe('ToolCard', () => {
  it('renders the catalog title, description and call to action', () => {
    render(<ToolCard tool={bmi} />);

    expect(
      screen.getByRole('heading', {name: bmi.title, level: 4}),
    ).toBeTruthy();
    expect(screen.getByText(bmi.description)).toBeTruthy();

    const link = screen.getByRole('link', {name: bmi.linkLabel});
    expect(link.getAttribute('href')).toBe(`/tools/${bmi.slug}`);
  });

  it('renders the lucide icon that the catalog maps to the tool', () => {
    const {container} = render(<ToolCard tool={bmi} />);
    const icon = container.querySelector('svg');

    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('uses the link label of the tool it renders', () => {
    const quiz = tools.find((tool) => tool.slug === 'body-type-quiz');
    expect(quiz).toBeDefined();

    render(<ToolCard tool={quiz!} />);
    expect(screen.getByRole('link', {name: 'Take Quiz'})).toBeTruthy();
  });
});
