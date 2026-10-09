import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, ZodError } from 'zod';
import { HttpError } from '../utils/errors.js';

export function validateBody<T>(schema: ZodSchema<T>) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      request.body = schema.parse(request.body);
    } catch (err) {
      if (err instanceof ZodError) {
        const formatted: Record<string, string[]> = {};
        for (const issue of err.issues) {
          const key = issue.path.join('.');
          if (!formatted[key]) formatted[key] = [];
          formatted[key].push(issue.message);
        }
        throw HttpError.unprocessable('Validasi body gagal', formatted);
      }
      throw err;
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      request.query = schema.parse(request.query);
    } catch (err) {
      if (err instanceof ZodError) {
        const formatted: Record<string, string[]> = {};
        for (const issue of err.issues) {
          const key = issue.path.join('.');
          if (!formatted[key]) formatted[key] = [];
          formatted[key].push(issue.message);
        }
        throw HttpError.unprocessable('Validasi query gagal', formatted);
      }
      throw err;
    }
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      request.params = schema.parse(request.params);
    } catch (err) {
      if (err instanceof ZodError) {
        const formatted: Record<string, string[]> = {};
        for (const issue of err.issues) {
          const key = issue.path.join('.');
          if (!formatted[key]) formatted[key] = [];
          formatted[key].push(issue.message);
        }
        throw HttpError.unprocessable('Validasi params gagal', formatted);
      }
      throw err;
    }
  };
}