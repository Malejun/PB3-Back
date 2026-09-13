import * as authService from '../services/auth.service.js';

function isProductionEnv() {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.COOKIE_SECURE === 'true' ||
    (typeof process.env.FRONTEND_URL === 'string' && /^https:\/\//i.test(process.env.FRONTEND_URL))
  );
}

export function getTokenCookieOptions(extraOptions = {}) {
  const isProduction = isProductionEnv();
  const cookieDomain = process.env.COOKIE_DOMAIN;

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    ...extraOptions,
  };

  if (cookieDomain) {
    options.domain = cookieDomain;
  }

  return options;
}

export async function registerController(req, res, next) {
  try {
    const user = await authService.register(req.body.email, req.body.password);
    res.status(201).json({
      ok: true,
      data: user,
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const data = await authService.login(req.body.email, req.body.password);

    res.cookie('token', data.token, getTokenCookieOptions({
      maxAge: 24 * 60 * 60 * 1000,
    }));

    res.json({
      ok: true,
      user: data.user,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutController(req, res, next) {
  try {
    const clearCookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
    };

    res.clearCookie('token', clearCookieOptions);

    res.json({ ok: true, message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    next(error);
  }
}

export async function meController(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    res.json({
      ok: true,
      data: user,
      user,
    });
  } catch (error) {
    next(error);
  }
}
