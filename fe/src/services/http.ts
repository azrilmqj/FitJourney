export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export async function api<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot connect. Check your connection and try again.', 0);
  }
  const data = await response
    .json()
    .catch(() => ({ message: 'The server is unavailable. Please try again.' }));
  if (!response.ok) throw new ApiError(data.message || 'Something went wrong.', response.status);
  return data as T;
}
