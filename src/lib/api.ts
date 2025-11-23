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
  token?: string,
  method: string = 'POST'
): Promise<T> {
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
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
  // Admin endpoints
  admin: {
    getAnalytics: (token: string) =>
      request<{
        totalRevenue: number;
        totalBookings: number;
        totalUsers: number;
        totalBusOwners: number;
        totalBuses: number;
        recentBookings: any[];
      }>('/admin/analytics', {
        method: 'GET',
        token,
      }),
    getUsers: (token: string, role?: string) =>
      request<{ users: any[] }>(`/admin/users${role ? `?role=${role}` : ''}`, {
        method: 'GET',
        token,
      }),
    getOwners: (token: string) =>
      request<{ owners: any[] }>('/admin/owners', {
        method: 'GET',
        token,
      }),
    updateOwnerStatus: (token: string, ownerId: string, isApproved: boolean) =>
      request<{ message: string; owner: any }>(`/admin/owners/${ownerId}/approve`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ isApproved }),
      }),
    deleteUser: (token: string, userId: string) =>
      request<{ message: string }>(`/admin/users/${userId}`, {
        method: 'DELETE',
        token,
      }),
  },
  // Bus endpoints
  bus: {
    getAll: (token?: string) =>
      request<{ buses: any[] }>('/buses', {
        method: 'GET',
        token,
      }),
    getById: (id: string, token?: string) =>
      request<{ bus: any }>(`/buses/${id}`, {
        method: 'GET',
        token,
      }),
    getByOwner: (token: string) =>
      request<{ buses: any[] }>('/buses/owner/list', {
        method: 'GET',
        token,
      }),
    create: (formData: FormData, token: string) =>
      requestFormData<{ message: string; bus: any }>('/buses', formData, token),
    update: (id: string, formData: FormData, token: string) =>
      requestFormData<{ message: string; bus: any }>(`/buses/${id}`, formData, token, 'PUT'),
    delete: (id: string, token: string) =>
      request<{ message: string }>(`/buses/${id}`, {
        method: 'DELETE',
        token,
      }),
  },
  // Schedule endpoints
  schedule: {
    getAll: (params?: { from?: string; to?: string; date?: string }, token?: string) => {
      const queryParams = new URLSearchParams();
      if (params?.from) queryParams.append('from', params.from);
      if (params?.to) queryParams.append('to', params.to);
      if (params?.date) queryParams.append('date', params.date);
      const query = queryParams.toString();
      return request<{ schedules: any[] }>(`/schedules${query ? `?${query}` : ''}`, {
        method: 'GET',
        token,
      });
    },
    getById: (id: string, token?: string) =>
      request<{ schedule: any }>(`/schedules/${id}`, {
        method: 'GET',
        token,
      }),
    getByBus: (busId: string, token?: string) =>
      request<{ schedules: any[] }>(`/schedules/bus/${busId}`, {
        method: 'GET',
        token,
      }),
    create: (data: any, token: string) =>
      request<{ message: string; schedule: any }>('/schedules', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any, token: string) =>
      request<{ message: string; schedule: any }>(`/schedules/${id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify(data),
      }),
    delete: (id: string, token: string) =>
      request<{ message: string }>(`/schedules/${id}`, {
        method: 'DELETE',
        token,
      }),
  },
  // Booking endpoints
  booking: {
    getBookedSeats: (scheduleId: string) =>
      request<{ bookedSeats: string[] }>(`/bookings/schedule/${scheduleId}/seats`, {
        method: 'GET',
      }),
    create: (data: { scheduleId: string; seats: string[] }, token: string) =>
      request<{ message: string; booking: any }>('/bookings', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),
    getAll: (token: string) =>
      request<{ bookings: any[] }>('/bookings', {
        method: 'GET',
        token,
      }),
    getById: (id: string, token: string) =>
      request<{ booking: any }>(`/bookings/${id}`, {
        method: 'GET',
        token,
      }),
    confirmPayment: (bookingId: string, paymentIntentId: string, token: string) =>
      request<{ message: string; paymentIntent: any }>('/bookings/confirm-payment', {
        method: 'POST',
        token,
        body: JSON.stringify({ bookingId, paymentIntentId }),
      }),
  },
  // Payment endpoints
  payment: {
    createIntent: (data: { amount: number; bookingId: string; currency?: string }, token: string) =>
      request<{ clientSecret: string; paymentIntentId: string }>('/payments/create-intent', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),
    confirm: (paymentIntentId: string, bookingId: string, token: string) =>
      request<{ message: string; paymentIntent: any }>('/payments/confirm', {
        method: 'POST',
        token,
        body: JSON.stringify({ paymentIntentId, bookingId }),
      }),
  },
};

export default api;

