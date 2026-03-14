import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const bookService = {
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },
  getAvailableBooks: async () => {
    const response = await api.get('/books/available');
    return response.data;
  },
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },
  getUserBooks: async (userId) => {
    const response = await api.get(`/books/user/${userId}`);
    return response.data;
  },
  searchBooks: async (query) => {
    const response = await api.get(`/books/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
  publishBook: async (bookData, userId) => {
    const response = await api.post(`/books?userId=${userId}`, bookData);
    return response.data;
  },
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

export const requestService = {
  createRequest: async (requestData) => {
    const response = await api.post('/requests', requestData);
    return response.data;
  },
  getMyRequests: async (userId) => {
    const response = await api.get(`/requests/requester/${userId}`);
    return response.data;
  },
  getIncomingRequests: async (userId) => {
    const response = await api.get(`/requests/owner/${userId}`);
    return response.data;
  },
  approveRequest: async (requestId, ownerId) => {
    const response = await api.patch(`/requests/${requestId}/approve?ownerId=${ownerId}`);
    return response.data;
  },
  rejectRequest: async (requestId, ownerId, reason) => {
    const response = await api.patch(`/requests/${requestId}/reject?ownerId=${ownerId}&reason=${encodeURIComponent(reason || '')}`);
    return response.data;
  },
  markAsReturned: async (requestId, ownerId) => {
    const response = await api.patch(`/requests/${requestId}/return?ownerId=${ownerId}`);
    return response.data;
  },
};

export default api;

