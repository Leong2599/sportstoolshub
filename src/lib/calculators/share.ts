export type ShareContent = {
  title?: string;
  text: string;
  url?: string;
};

export type ShareOutcome =
  | 'shared'
  | 'copied'
  | 'cancelled'
  | 'unsupported'
  | 'failed';

export type ShareStatus = 'idle' | 'sharing' | ShareOutcome;

export type ShareEnvironment = {
  share?: (content: ShareContent) => Promise<void>;
  copyText?: (text: string) => Promise<void>;
};

export function formatShareText(content: ShareContent): string {
  const text = content.text.trim();

  if (!content.url) {
    return text;
  }

  return text ? `${text}\n${content.url}` : content.url;
}

export function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'AbortError'
  );
}

export async function shareOrCopy(
  content: ShareContent,
  environment: ShareEnvironment,
): Promise<ShareOutcome> {
  if (environment.share) {
    try {
      await environment.share(content);
      return 'shared';
    } catch (error) {
      if (isAbortError(error)) {
        return 'cancelled';
      }
    }
  }

  if (environment.copyText) {
    try {
      await environment.copyText(formatShareText(content));
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'unsupported';
}

export function createBrowserShareEnvironment(): ShareEnvironment {
  if (typeof navigator === 'undefined') {
    return {};
  }

  const environment: ShareEnvironment = {};

  if (typeof navigator.share === 'function') {
    environment.share = (content) => navigator.share(content);
  }

  if (typeof navigator.clipboard?.writeText === 'function') {
    environment.copyText = (text) => navigator.clipboard.writeText(text);
  }

  return environment;
}
