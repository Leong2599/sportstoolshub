import {describe, expect, it, vi} from 'vitest';
import {
  formatShareText,
  isAbortError,
  shareOrCopy,
  type ShareContent,
} from './share';

const content: ShareContent = {
  title: 'Demo result',
  text: 'Demo score: 22.9 (Balanced).',
  url: 'https://sportstoolshub.com/tools/demo',
};

describe('formatShareText', () => {
  it('appends the URL when present', () => {
    expect(formatShareText(content)).toBe(
      'Demo score: 22.9 (Balanced).\nhttps://sportstoolshub.com/tools/demo',
    );
  });

  it('handles text-only and URL-only content', () => {
    expect(formatShareText({text: '  Result  '})).toBe('Result');
    expect(formatShareText({text: '', url: 'https://example.com'})).toBe(
      'https://example.com',
    );
  });
});

describe('isAbortError', () => {
  it('detects native share cancellation', () => {
    const error = new Error('cancelled');
    error.name = 'AbortError';

    expect(isAbortError(error)).toBe(true);
    expect(isAbortError(new Error('failed'))).toBe(false);
    expect(isAbortError(null)).toBe(false);
  });
});

describe('shareOrCopy', () => {
  it('uses the native share sheet when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const copyText = vi.fn().mockResolvedValue(undefined);

    await expect(shareOrCopy(content, {share, copyText})).resolves.toBe(
      'shared',
    );
    expect(share).toHaveBeenCalledWith(content);
    expect(copyText).not.toHaveBeenCalled();
  });

  it('treats native cancellation as a completed choice', async () => {
    const error = new Error('cancelled');
    error.name = 'AbortError';
    const share = vi.fn().mockRejectedValue(error);
    const copyText = vi.fn().mockResolvedValue(undefined);

    await expect(shareOrCopy(content, {share, copyText})).resolves.toBe(
      'cancelled',
    );
    expect(copyText).not.toHaveBeenCalled();
  });

  it('falls back to the clipboard when native sharing fails', async () => {
    const share = vi.fn().mockRejectedValue(new Error('not allowed'));
    const copyText = vi.fn().mockResolvedValue(undefined);

    await expect(shareOrCopy(content, {share, copyText})).resolves.toBe(
      'copied',
    );
    expect(copyText).toHaveBeenCalledWith(
      'Demo score: 22.9 (Balanced).\nhttps://sportstoolshub.com/tools/demo',
    );
  });

  it('reports unsupported and failed environments', async () => {
    await expect(shareOrCopy(content, {})).resolves.toBe('unsupported');

    const copyText = vi.fn().mockRejectedValue(new Error('denied'));
    await expect(shareOrCopy(content, {copyText})).resolves.toBe('failed');
  });
});
