// @vitest-environment jsdom
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {BODY_TYPE_QUIZ_ERROR} from '../../lib/calculators/bodyType';
import {BodyTypeQuiz} from './BodyTypeQuiz';

const scrollIntoView = vi.fn();

beforeEach(() => {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: scrollIntoView,
  });
});

afterEach(() => {
  cleanup();
  scrollIntoView.mockReset();
  vi.restoreAllMocks();
});

async function answer(
  user: ReturnType<typeof userEvent.setup>,
  question: string,
  option: string,
) {
  const group = screen.getByRole('group', {name: question});
  await user.click(within(group).getByRole('radio', {name: option}));
}

async function submitQuiz(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', {name: 'Discover My Body Type'}),
  );
}

describe('BodyTypeQuiz', () => {
  it('computes a dominant source archetype without scrolling or sharing', async () => {
    const user = userEvent.setup();
    render(<BodyTypeQuiz />);

    await answer(
      user,
      '1. How would you describe your bone structure?',
      'Small, delicate',
    );
    await answer(user, '2. How easily do you gain muscle mass?', 'Very difficult');
    await answer(user, '3. How easily do you gain body fat?', 'Very difficult');
    await answer(
      user,
      '4. What is your natural body shape?',
      'Long, lean, narrow shoulders',
    );
    await answer(user, '5. How is your appetite generally?', 'Small, can forget to eat');

    await submitQuiz(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Body Type Result'}).textContent,
      ).toContain('Ectomorph'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Body Type Result',
    });
    expect(result.textContent).toContain(
      'Naturally lean and often struggles to gain weight or muscle.',
    );
    expect(result.textContent).toContain('heavy weights and lower reps (6-10)');
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('button', {name: 'Share results'}),
    ).toBeNull();
    expect(
      screen.queryByRole('button', {name: 'Print results'}),
    ).toBeNull();
  });

  it('uses the source mixed-body-type tie rule', async () => {
    const user = userEvent.setup();
    render(<BodyTypeQuiz />);

    await answer(
      user,
      '1. How would you describe your bone structure?',
      'Small, delicate',
    );
    await answer(user, '2. How easily do you gain muscle mass?', 'Quite easily');
    await answer(user, '3. How easily do you gain body fat?', 'Very difficult');
    await answer(
      user,
      '4. What is your natural body shape?',
      'Rectangular, athletic, broad shoulders',
    );
    await answer(user, '5. How is your appetite generally?', 'Large, enjoy eating');

    await submitQuiz(user);

    const result = screen.getByRole('region', {
      name: 'Your Body Type Result',
    });
    expect(result.textContent).toContain('Mixed Body Type');
    expect(result.textContent).toContain(
      'You exhibit characteristics of multiple body types.',
    );
  });

  it('requires all five answers with the source message', async () => {
    const user = userEvent.setup();
    render(<BodyTypeQuiz />);

    await submitQuiz(user);

    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(5);
    expect(alerts.every((alert) => alert.textContent === BODY_TYPE_QUIZ_ERROR)).toBe(
      true,
    );
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('resets the quiz and result', async () => {
    const user = userEvent.setup();
    render(<BodyTypeQuiz />);

    await answer(
      user,
      '1. How would you describe your bone structure?',
      'Small, delicate',
    );
    await answer(user, '2. How easily do you gain muscle mass?', 'Very difficult');
    await answer(user, '3. How easily do you gain body fat?', 'Very difficult');
    await answer(
      user,
      '4. What is your natural body shape?',
      'Long, lean, narrow shoulders',
    );
    await answer(user, '5. How is your appetite generally?', 'Small, can forget to eat');
    await submitQuiz(user);

    await user.click(screen.getByRole('button', {name: 'Reset Quiz'}));

    const result = screen.getByRole('region', {
      name: 'Your Body Type Result',
    });
    expect(result.textContent).toContain('?');
    expect(result.textContent).not.toContain('Ectomorph');

    const firstQuestion = screen.getByRole('group', {
      name: '1. How would you describe your bone structure?',
    });
    expect(
      (
        within(firstQuestion).getByRole('radio', {
          name: 'Small, delicate',
        }) as HTMLInputElement
      ).checked,
    ).toBe(false);
  });
});
