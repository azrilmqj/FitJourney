import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import { verifyOrigin } from '../src/middleware/origin.middleware.js';

test('development accepts the primary and fallback frontend ports, not arbitrary origins', () => {
  for (const origin of ['http://localhost:5000', 'http://localhost:5001']) {
    let passed = false;
    verifyOrigin({ method: 'POST', get: () => origin }, {}, () => {
      passed = true;
    });
    assert.equal(passed, true);
  }
  for (const origin of [
    undefined,
    'https://example.com',
    'http://localhost:5002',
    'http://localhost:5001.evil.test',
  ]) {
    assert.throws(() => verifyOrigin({ method: 'POST', get: () => origin }, {}, () => {}), {
      status: 403,
    });
  }
});

test('production ignores development origins', () => {
  const moduleUrl = new URL('../src/config/env.js', import.meta.url).href;
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import assert from 'node:assert/strict'; import { env } from ${JSON.stringify(moduleUrl)}; assert.deepEqual(env.allowedOrigins, ['https://miqora.example']);`,
    ],
    {
      env: {
        ...process.env,
        NODE_ENV: 'production',
        APP_ORIGIN: 'https://miqora.example',
        DEV_APP_ORIGINS: 'http://localhost:5001',
      },
    },
  );
});
