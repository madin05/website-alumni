export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: Record<string, unknown>;
}

export function successResponse<T>(data: T, message = 'Berhasil', meta?: Record<string, unknown>): ApiResponse<T> {
  return { success: true, message, data, meta };
}

export function errorResponse(message = 'Gagal', errors?: Record<string, string[]>, meta?: Record<string, unknown>): ApiResponse {
  return { success: false, message, errors, meta };
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message = 'Berhasil'
): ApiResponse<T[]> {
  return {
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}