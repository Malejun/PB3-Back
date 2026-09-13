import * as authService from '../services/auth.service.js';

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

    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      ok: true,
      user: data.user,
      data,
      token: data.token,
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutController(req, res, next) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

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
