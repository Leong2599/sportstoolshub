import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';

const ciPath = fileURLToPath(
  new URL('../../.github/workflows/ci.yml', import.meta.url),
);
const deployPath = fileURLToPath(
  new URL('../../.github/workflows/deploy-pages.yml', import.meta.url),
);

function read(path: string): string {
  return readFileSync(path, 'utf8');
}

describe('CI workflow', () => {
  it('exists and runs on pushes and pull requests', () => {
    expect(existsSync(ciPath)).toBe(true);
    const ci = read(ciPath);

    expect(ci).toMatch(/^name: CI$/m);
    expect(ci).toMatch(/^on:\s*$/m);
    expect(ci).toMatch(/^\s{2}pull_request:\s*$/m);
    expect(ci).toMatch(/^\s{4}branches: \[main\]$/m);
  });

  it('installs with npm ci and runs every gate in order', () => {
    const ci = read(ciPath);
    const gates = ['npm ci', 'npm run typecheck', 'npm run test:run', 'npm run build'];
    const positions = gates.map((gate) => ci.indexOf(gate));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((left, right) => left - right)).toEqual(positions);
  });

  it('builds with strict legacy alias coverage', () => {
    expect(read(ciPath)).toMatch(/LEGACY_ALIASES_STRICT: '1'/);
  });

  it('pins a Node version the tests support and caches npm', () => {
    const ci = read(ciPath);

    expect(ci).toMatch(/node-version: '22\.x'/);
    expect(ci).toMatch(/cache: npm/);
    expect(ci).toMatch(/package-lock\.json/);
  });

  it('uploads the build for review without deploying', () => {
    const ci = read(ciPath);

    expect(ci).toMatch(/actions\/upload-artifact@v4/);
    expect(ci).toMatch(/path: build/);
    expect(ci).not.toMatch(/deploy-pages/);
    expect(ci).toMatch(/permissions:\s*\n\s{2}contents: read/);
  });

  it('runs the parity check against the served build after the build', () => {
    const ci = read(ciPath);
    const build = ci.indexOf('run: npm run build');
    const serve = ci.indexOf('npx docusaurus serve --port 3100 --no-open');
    const parity = ci.indexOf('scripts/parity-check.mjs --base-url=http://localhost:3100');

    expect(build).toBeGreaterThan(-1);
    expect(serve).toBeGreaterThan(build);
    expect(parity).toBeGreaterThan(serve);
    // The legacy checkout is not part of this repository, so CI skips the
    // source comparison and keeps the rest of the gate.
    expect(ci).toMatch(/parity-check\.mjs --base-url=http:\/\/localhost:3100 --skip-content/);
    expect(ci).toMatch(/path: \.docusaurus\/parity-report\.json/);
  });
});

describe('Pages deploy workflow', () => {
  it('requests the Pages permissions and serialises deployments', () => {
    const deploy = read(deployPath);

    expect(existsSync(deployPath)).toBe(true);
    expect(deploy).toMatch(/pages: write/);
    expect(deploy).toMatch(/id-token: write/);
    expect(deploy).toMatch(/group: pages/);
    expect(deploy).toMatch(/cancel-in-progress: false/);
  });

  it('builds, uploads and deploys the Pages artifact', () => {
    const deploy = read(deployPath);
    const steps = [
      'actions/checkout@v4',
      'actions/setup-node@v4',
      'npm ci',
      'npm run build',
      'actions/configure-pages@v5',
      'actions/upload-pages-artifact@v3',
      'actions/deploy-pages@v4',
    ];
    const positions = steps.map((step) => deploy.indexOf(step));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((left, right) => left - right)).toEqual(positions);
    expect(deploy).toMatch(/environment:\s*\n\s{6}name: github-pages/);
  });

  it('gates production behind the cutover variable', () => {
    const deploy = read(deployPath);

    expect(deploy).toMatch(/vars\.PAGES_DEPLOY_ENABLED == 'true'/);
    expect(deploy).toMatch(/vars\.PAGES_DEPLOY_ENABLED != 'true'/);
    expect(deploy).toMatch(/inputs\.confirmation != 'deploy'/);
  });

  it('builds previews at the project path without claiming the domain', () => {
    const deploy = read(deployPath);

    expect(deploy).toMatch(/base="\/\$\{repo\}\/"/);
    expect(deploy).toMatch(/rm -f build\/CNAME/);
    expect(deploy).toMatch(/test -f build\/\.nojekyll/);
    expect(deploy).toMatch(/BASE_URL="\$base" SITE_URL="\$url" npm run build/);
    expect(deploy).toMatch(/LEGACY_ALIASES_STRICT: '1'/);
  });

  it('never references repository secrets', () => {
    for (const path of [ciPath, deployPath]) {
      expect(read(path)).not.toMatch(/secrets\./);
    }
  });
});
