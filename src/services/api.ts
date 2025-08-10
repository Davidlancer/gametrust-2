import axios from 'axios';

// Create axios instance with base URL from environment variable
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      // You can add navigation logic here if needed
    }
    return Promise.reject(error);
  }
);

export default API;

// Export common API methods for convenience
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) => 
      API.post('/api/auth/login', credentials),
    register: (userData: { username: string; email: string; password: string; firstName: string; lastName: string }) => 
      API.post('/api/auth/register', userData),
    logout: () => API.post('/api/auth/logout'),
    refreshToken: () => API.post('/api/auth/refresh'),
  },

  // User endpoints
  users: {
    getProfile: (userId: string) => API.get(`/api/users/${userId}`),
    updateProfile: (userId: string, data: Record<string, unknown>) => API.put(`/api/users/${userId}`, data),
    getUsers: () => API.get('/api/users'),
  },

  // Products
  products: {
    getAll: (params?: Record<string, unknown>) => API.get('/api/products', { params }),
    getById: (id: string) => API.get(`/api/products/${id}`),
    create: (data: Record<string, unknown>) => API.post('/api/products', data),
    update: (id: string, data: Record<string, unknown>) => API.put(`/api/products/${id}`, data),
    delete: (id: string) => API.delete(`/api/products/${id}`),
    getRelated: (gameType: string) => API.get(`/api/products/related?game=${gameType}`),
  },

  // Orders
  orders: {
    getAll: () => API.get('/api/orders'),
    getById: (id: string) => API.get(`/api/orders/${id}`),
    create: (data: Record<string, unknown>) => API.post('/api/orders', data),
    update: (id: string, data: Record<string, unknown>) => API.put(`/api/orders/${id}`, data),
    getUserOrders: (userId: string) => API.get(`/api/orders/user/${userId}`),
  },

  // Reviews
  reviews: {
    getAll: () => API.get('/api/reviews'),
    getByProduct: (productId: string) => API.get(`/api/reviews/product/${productId}`),
    create: (data: Record<string, unknown>) => API.post('/api/reviews', data),
    update: (id: string, data: Record<string, unknown>) => API.put(`/api/reviews/${id}`, data),
    delete: (id: string) => API.delete(`/api/reviews/${id}`),
  },

  // Messages
  messages: {
    getConversations: () => API.get('/api/messages/conversations'),
    getMessages: (conversationId: string) => API.get(`/api/messages/${conversationId}`),
    send: (data: Record<string, unknown>) => API.post('/api/messages', data),
  },

  // Admin endpoints
  admin: {
    getStats: () => API.get('/api/admin/stats'),
    getUsers: () => API.get('/api/admin/users'),
    getOrders: () => API.get('/api/admin/orders'),
    getReports: () => API.get('/api/admin/reports'),
  },

  // Health check
  health: () => API.get('/api/health'),
};