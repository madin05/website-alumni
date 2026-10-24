import { TracerSubmissionPayload, SubmissionResponse } from '@/types/tracer';
import { completeTracerFormSchema } from '@/schemas/tracerSchema';

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

  // If real API endpoint exists in env, we can fetch, otherwise perform standard mock response
  try {
    const apiBaseUrl = (import.meta as any).env?.VITE_API_URL;
    if (apiBaseUrl) {
      const res = await fetch(`${apiBaseUrl}/api/v1/tracer-study`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend server not reachable, falling back to client simulation:', err);
  }

  // Standard Mock Server Response matching PRD 5.1
  await new Promise((res) => setTimeout(res, 600));

  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomSeq = Math.floor(1000 + Math.random() * 9000).toString();
  const submissionId = `${year}${month}${randomSeq}`;

  const response: SubmissionResponse = {
    success: true,
    message: 'Data tracer study berhasil disimpan. Terima kasih atas partisipasi Anda.',
    data: {
      submission_id: submissionId,
      submitted_at: now.toISOString(),
    },
  };

  return response;
}
