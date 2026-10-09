export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code ?? defaultCode(statusCode);
    this.details = details;
  }

  static badRequest(message = 'Permintaan tidak valid', details?: unknown) {
    return new HttpError(400, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Tidak terautentikasi') {
    return new HttpError(401, message, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Akses ditolak') {
    return new HttpError(403, message, 'FORBIDDEN');
  }

  static notFound(message = 'Data tidak ditemukan') {
    return new HttpError(404, message, 'NOT_FOUND');
  }

  static conflict(message = 'Data sudah ada') {
    return new HttpError(409, message, 'CONFLICT');
  }

  static unprocessable(message = 'Data tidak dapat diproses', details?: unknown) {
    return new HttpError(422, message, 'UNPROCESSABLE_ENTITY', details);
  }

  static tooMany(message = 'Terlalu banyak permintaan') {
    return new HttpError(429, message, 'TOO_MANY_REQUESTS');
  }

  static internal(message = 'Kesalahan server internal') {
    return new HttpError(500, message, 'INTERNAL_ERROR');
  }
}

function defaultCode(status: number): string {
  const map: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'TOO_MANY_REQUESTS',
    500: 'INTERNAL_ERROR',
  };
  return map[status] ?? 'ERROR';
}
