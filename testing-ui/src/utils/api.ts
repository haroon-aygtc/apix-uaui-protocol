import axios, { AxiosResponse } from 'axios';
import { HealthResponse, StatusResponse } from '@/types/apix';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_VERSION = '/api/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('apix-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API Functions
export const healthCheck = async (): Promise<HealthResponse> => {
  const response: AxiosResponse<HealthResponse> = await apiClient.get('/');
  return response.data;
};

export const getStatus = async (): Promise<StatusResponse> => {
  const response: AxiosResponse<StatusResponse> = await apiClient.get('/status');
  return response.data;
};

// Generic API test function
export const testApiEndpoint = async (
  endpoint: string,
  method: string = 'GET',
  data?: any,
  headers?: Record<string, string>
) => {
  const startTime = Date.now();
  
  try {
    const config = {
      method: method.toLowerCase() as any,
      url: endpoint,
      data,
      headers: headers || {},
    };

    const response = await apiClient.request(config);
    const endTime = Date.now();
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      headers: response.headers,
      responseTime: endTime - startTime,
      size: JSON.stringify(response.data).length,
    };
  } catch (error: any) {
    const endTime = Date.now();
    
    return {
      success: false,
      status: error.response?.status || 0,
      data: error.response?.data || null,
      error: error.message,
      responseTime: endTime - startTime,
      size: 0,
    };
  }
};

// WebSocket URL
export const getWebSocketUrl = () => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsHost = import.meta.env.VITE_WS_HOST || 'localhost:3001';
  return `${wsProtocol}//${wsHost}/ws`;
};
