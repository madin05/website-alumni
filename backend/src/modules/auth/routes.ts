import { FastifyInstance } from 'fastify';
import { authenticate } from '../../core/middleware/auth.js';
import { validateBody } from '../../core/middleware/validate.js';
import { loginSchema, registerSchema, refreshSchema, changePasswordSchema } from './schemas.js';
import { login, register, refreshAccessToken, getMe, changePassword } from './service.js';
import { successResponse } from '../../core/utils/response.js';
import { z } from 'zod';

type RegisterBody = z.infer<typeof registerSchema>;
type LoginBody = z.infer<typeof loginSchema>;
type RefreshBody = z.infer<typeof refreshSchema>;
type ChangePasswordBody = z.infer<typeof changePasswordSchema>;

export async function authRoutes(app: FastifyInstance) {
  // POST /auth/login
  app.post('/auth/login', {
    config: {
      rateLimit: {
        max: 15,
        timeWindow: '1 minute',
      },
    },
    preHandler: validateBody(loginSchema),
  }, async (request, reply) => {
    const body = request.body as LoginBody;
    const { alumni, accessToken, refreshToken } = await login(app, body);

    reply.setCookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return reply.send(successResponse({
      user: alumni,
      accessToken,
      refreshToken,
    }, 'Login berhasil'));
  });

  // POST /auth/register
  app.post('/auth/register', {
    preHandler: validateBody(registerSchema),
  }, async (request, reply) => {
    const body = request.body as RegisterBody;
    const { alumni, accessToken, refreshToken } = await register(app, body);

    reply.setCookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return reply.status(201).send(successResponse({
      user: alumni,
      accessToken,
      refreshToken,
    }, 'Registrasi berhasil'));
  });

  // POST /auth/refresh
  app.post('/auth/refresh', {
    preHandler: validateBody(refreshSchema),
  }, async (request, reply) => {
    const body = request.body as RefreshBody;
    const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(app, body.refreshToken);

    reply.setCookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    reply.setCookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return reply.send(successResponse({ accessToken, refreshToken: newRefreshToken }, 'Token diperbarui'));
  });

  // POST /auth/logout
  app.post('/auth/logout', async (request, reply) => {
    reply.clearCookie('accessToken', { path: '/' });
    reply.clearCookie('refreshToken', { path: '/' });
    return reply.send(successResponse(null, 'Logout berhasil'));
  });

  // GET /auth/me (protected)
  app.get('/auth/me', { preHandler: authenticate }, async (request, reply) => {
    const user = await getMe(request.user!.id);
    return reply.send(successResponse(user, 'Profil berhasil diambil'));
  });

  // PUT /auth/me/password (protected)
  app.put('/auth/me/password', {
    preHandler: [authenticate, validateBody(changePasswordSchema)],
  }, async (request, reply) => {
    const body = request.body as ChangePasswordBody;
    await changePassword(request.user!.id, body);
    return reply.send(successResponse(null, 'Password berhasil diubah'));
  });
}