import type { DiagnosisResult, HealthStatus } from '../types/diagnosis';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function checkHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      model: 'gemma-4-9b-it',
      api_configured: false
    };
  }
}

export async function diagnoseImage(
  image: File | Blob,
  category: string = 'auto_detect',
  description: string = ''
): Promise<DiagnosisResult> {
  const formData = new FormData();
  formData.append('image', image, 'problem_photo.jpg');
  formData.append('category', category);
  if (description.trim()) {
    formData.append('description', description.trim());
  }

  const res = await fetch(`${API_BASE}/diagnose`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errorDetail = 'Failed to analyze image';
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  return await res.json();
}

export async function askFollowUp(
  question: string,
  diagnosis: DiagnosisResult,
  category: string,
  description?: string
) {
  const res = await fetch(`${API_BASE}/follow-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      diagnosis,
      category,
      description,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to get follow-up response');
  }

  return await res.json();
}
