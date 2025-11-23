const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Request with FormData (for file uploads)
async function requestFormData<T>(
  endpoint: string,
  formData: FormData,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth endpoints
  auth: {
    register: (formData: FormData) => requestFormData<{ user: any; token: string; message: string }>('/auth/register', formData),
    login: (email: string, password: string) => 
      request<{ user: any; token: string; message: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    getMe: (token: string) => 
      request<{ user: any }>('/auth/me', {
        method: 'GET',
        token,
      }),
    verifyEmail: (token: string) =>
      request<{ message: string; user: any }>(`/auth/verify-email?token=${token}`, {
        method: 'GET',
      }),
  },
};

export default api;

