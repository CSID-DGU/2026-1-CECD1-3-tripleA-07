export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const url = `${baseUrl}${path}`;
  
  const response = await fetch(url, {
    ...options,
    headers: { 
      'Content-Type': 'application/json', 
      ...options.headers 
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
