import test from 'node:test';
import assert from 'node:assert/strict';

import { getTokenCookieOptions } from '../src/controllers/auth.controller.js';

test('cookie settings are consistent between login and logout without NODE_ENV in .env', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalDomain = process.env.COOKIE_DOMAIN;
  const originalSecure = process.env.COOKIE_SECURE;
  const originalFrontendUrl = process.env.FRONTEND_URL;

  delete process.env.NODE_ENV;
  process.env.COOKIE_SECURE = 'true';
  process.env.COOKIE_DOMAIN = 'example.com';
  process.env.FRONTEND_URL = 'https://app.example.com';

  try {
    const loginOptions = getTokenCookieOptions({ maxAge: 24 * 60 * 60 * 1000 });
    const logoutOptions = getTokenCookieOptions();

    assert.equal(loginOptions.httpOnly, true);
    assert.equal(loginOptions.secure, true);
    assert.equal(loginOptions.sameSite, 'none');
    assert.equal(loginOptions.path, '/');
    assert.equal(loginOptions.domain, 'example.com');
    assert.equal(loginOptions.maxAge, 24 * 60 * 60 * 1000);

    assert.equal(logoutOptions.httpOnly, true);
    assert.equal(logoutOptions.secure, true);
    assert.equal(logoutOptions.sameSite, 'none');
    assert.equal(logoutOptions.path, '/');
    assert.equal(logoutOptions.domain, 'example.com');
    assert.equal(logoutOptions.maxAge, undefined);
  } finally {
    if (originalEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalEnv;

    if (originalSecure === undefined) delete process.env.COOKIE_SECURE;
    else process.env.COOKIE_SECURE = originalSecure;

    if (originalDomain === undefined) delete process.env.COOKIE_DOMAIN;
    else process.env.COOKIE_DOMAIN = originalDomain;

    if (originalFrontendUrl === undefined) delete process.env.FRONTEND_URL;
    else process.env.FRONTEND_URL = originalFrontendUrl;
  }
});
