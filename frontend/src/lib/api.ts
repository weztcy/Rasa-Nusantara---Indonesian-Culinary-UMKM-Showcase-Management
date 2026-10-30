const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('umkm_auth_token');
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('umkm_auth_token', token);
  } else {
    localStorage.removeItem('umkm_auth_token');
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; errors?: any }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Request failed with status ${res.status}`,
        errors: data?.errors,
      };
    }

    return data || { success: true };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Tidak dapat terhubung ke server backend',
    };
  }
}

// 1. Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return request<{
      token: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: 'ADMIN' | 'PARTNER' | 'USER';
        brandName?: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    brandName?: string;
  }) => {
    return request<{
      token: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: 'ADMIN' | 'PARTNER' | 'USER';
        brandName?: string;
      };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMe: async () => {
    return request<any>('/auth/me');
  },
};

// 2. Products API
export const productsApi = {
  getAll: async (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/products${query ? `?${query}` : ''}`;
    return request<any[]>(endpoint);
  },

  getById: async (id: string) => {
    return request<any>(`/products/${id}`);
  },

  create: async (payload: any) => {
    return request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: any) => {
    return request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string) => {
    return request<any>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// 3. Categories API
export const categoriesApi = {
  getAll: async () => {
    return request<any[]>('/categories');
  },
};

// 4. Orders API
export const ordersApi = {
  create: async (payload: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerNotes?: string;
    items: { productId: string; quantity: number; note?: string }[];
  }) => {
    return request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getAll: async (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<any[]>(`/orders${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return request<any>(`/orders/${id}`);
  },

  updateStatus: async (
    id: string,
    payload: { status: string; shippingCourier?: string; trackingNumber?: string }
  ) => {
    return request<any>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string) => {
    return request<any>(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// 5. Partners API
export const partnersApi = {
  submit: async (payload: {
    brandName: string;
    ownerName: string;
    city: string;
    waNumber: string;
    category: string;
    certification: string;
    description: string;
  }) => {
    return request<any>('/partners', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getAll: async (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<any[]>(`/partners${query ? `?${query}` : ''}`);
  },

  updateStatus: async (id: string, status: 'APPROVED' | 'REJECTED') => {
    return request<any>(`/partners/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// 6. Settings API
export const settingsApi = {
  get: async () => {
    return request<any>('/settings');
  },

  update: async (payload: any) => {
    return request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};

// 7. Backend Health API
export const healthApi = {
  check: async () => {
    try {
      const url = typeof window !== 'undefined' ? '/health' : 'http://localhost:5000/health';
      const res = await fetch(url, {
        cache: 'no-store',
      });
      return res.ok;
    } catch {
      try {
        const res = await fetch('http://localhost:5000/health', {
          cache: 'no-store',
        });
        return res.ok;
      } catch {
        return false;
      }
    }
  },
};
