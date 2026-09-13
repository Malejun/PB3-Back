import test from 'node:test';
import assert from 'node:assert/strict';

import { logoutController } from '../src/controllers/auth.controller.js';

test('logout clears the auth cookie using the same path as the login cookie', async () => {
  let clearCookieOptions;

  const req = {};
  const res = {
    clearCookie(name, options) {
      clearCookieOptions = { name, options };
    },
    json(payload) {
      this.payload = payload;
    },
  };

  await logoutController(req, res, () => {
    throw new Error('next should not be called');
  });

  assert.equal(res.payload.ok, true);
  assert.equal(clearCookieOptions.name, 'token');
  assert.equal(clearCookieOptions.options.path, '/');
  assert.equal(clearCookieOptions.options.maxAge, 0);
});
