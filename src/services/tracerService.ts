import { TracerSubmissionPayload, SubmissionResponse } from '@/types/tracer';
import { completeTracerFormSchema } from '@/schemas/tracerSchema';
import { useAuthStore } from '@/store/authStore';

/**
 * Service to handle Tracer Study submission adhering to PRD Section 5.1
 * Method: POST
 * Path: /api/v1/tracer-study
 */
export async function submitTracerStudy(
  payload: TracerSubmissionPayload & { agreement: boolean }
): Promise<SubmissionResponse> {
  // Validate schema locally before submission
  const validationResult = completeTracerFormSchema.safeParse(payload);

  if (!validationResult.success) {
    const formattedErrors: Record<string, string[]> = {};
    validationResult.error.issues.forEach((issue) => {
      const pathKey = issue.path.join('.');
      if (!formattedErrors[pathKey]) {
        formattedErrors[pathKey] = [];
      }
      formattedErrors[pathKey].push(issue.message);
    });

    return {
      success: false,
      message: 'Validasi gagal.',
      errors: formattedErrors,
    };
  }

  const { accessToken } = useAuthStore.getState();

  try {
    const res = await fetch('/api/v1/tracer-study', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error('Submit tracer study failed:', err);
    return {
      success: false,
      message: 'Gagal mengirim data. Silakan coba lagi.',
      errors: { network: ['Tidak dapat terhubung ke server'] },
    };
  }
}

export async function getMySubmission(): Promise<SubmissionResponse> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res = await fetch('/api/v1/tracer-study/me', {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: 'include',
    });
    return await res.json();
  } catch (err) {
    console.error('Get my submission failed:', err);
    return {
      success: false,
      message: 'Gagal mengambil riwayat pengisian.',
    };
  }
}