import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpError } from '../utils/errors.js';
import { env } from '../../config/env.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

// Extend FastifyRequest for multipart
declare module 'fastify' {
  interface FastifyRequest {
    file?: (options?: { limits?: { fileSize?: number } }) => Promise<{
      filename: string;
      mimetype: string;
      toBuffer: () => Promise<Buffer>;
    } | null>;
  }
}

export async function uploadFile(request: FastifyRequest, reply: FastifyReply, options: {
  fieldName?: string;
  allowedTypes?: string[];
  maxSize?: number;
  subDir?: string;
} = {}): Promise<{ url: string; filename: string }> {
  if (!request.file) {
    throw HttpError.badRequest('Multipart tidak didukung - pastikan plugin multipart terdaftar');
  }

  const data = await request.file({
    limits: {
      fileSize: options.maxSize ?? env.MAX_FILE_SIZE,
    },
  });

  if (!data) {
    throw HttpError.badRequest('File tidak ditemukan');
  }

  const allowedTypes = options.allowedTypes ?? ALLOWED_TYPES;
  if (!allowedTypes.includes(data.mimetype)) {
    throw HttpError.unprocessable(`Tipe file tidak diizinkan. Diizinkan: ${allowedTypes.join(', ')}`);
  }

  const ext = path.extname(data.filename).toLowerCase();
  const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
  const subDir = options.subDir ?? 'uploads';
  const uploadDir = path.join(env.UPLOAD_DIR, subDir);

  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);

  await fs.writeFile(filePath, await data.toBuffer());

  const url = `/${subDir}/${filename}`.replace(/\\/g, '/');
  return { url, filename };
}

export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
    const fullPath = path.join(env.UPLOAD_DIR, relativePath);
    await fs.unlink(fullPath);
    return true;
  } catch {
    return false;
  }
}