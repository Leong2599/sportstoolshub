import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

const stub = (name: string) =>
  new URL(`./src/test/docusaurus-stubs/${name}.tsx`, import.meta.url).pathname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Docusaurus resolves these through webpack aliases, so they are not
      // importable outside a Docusaurus build. The stubs keep the home
      // components testable while the real components ship.
      '@docusaurus/Link': stub('Link'),
      '@theme/Heading': stub('Heading'),
      '@theme/Layout': stub('Layout'),
      '@theme-original/BlogPostItems': stub('BlogPostItems'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
    // The suite has ~94 files and each one runs a jsdom environment. Without
    // a bound Vitest spawns one worker per file, which oversubscribes a
    // normal CI box and starves the slower interaction tests until they hit
    // the 5s timeout. Capping the pool keeps the run deterministic.
    maxWorkers: 4,
    testTimeout: 20000,
  },
});
