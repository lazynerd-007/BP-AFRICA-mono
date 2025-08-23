import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * API Client configuration for BluPay Africa Backend API
 * Handles authentication, request/response interceptors, and base configuration
 */
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.blupayafrica.com/api';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling common errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Validate JSON response
        if (response.data && typeof response.data === 'string' && response.headers['content-type']?.includes('application/json')) {
          try {
            response.data = JSON.parse(response.data);
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Response length:', response.data.length);
            console.error('Raw response (first 500 chars):', response.data.substring(0, 500));
            console.error('Raw response (last 500 chars):', response.data.substring(Math.max(0, response.data.length - 500)));
            
            // Check for specific JSON parsing issues
            if (parseError instanceof Error) {
              if (parseError.message.includes('unterminated string')) {
                console.error('Unterminated string detected at character position:', parseError.message.match(/\d+/)?.[0]);
                console.error('This indicates the API response was cut off or malformed');
              }
            }
            
            throw new Error(`Invalid JSON response: ${parseError}`);
          }
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.handleUnauthorized();
        }
        
        // Enhanced JSON parsing error handling
        if (error.message?.includes('JSON') || error.name === 'SyntaxError') {
          console.error('JSON parsing error in API response:', error);
          console.error('Error type:', error.name);
          console.error('Error message:', error.message);
          
          if (error.message.includes('unterminated string')) {
            console.error('Unterminated string error - API response was likely truncated or malformed');
          }
          
          error.message = 'Server returned invalid JSON data. Please try again.';
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get authentication token from localStorage or session storage
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Handle unauthorized access (401 errors)
   */
  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      // Redirect to login page
      window.location.href = '/login';
    }
  }

  /**
   * Set authentication token
   */
  public setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Remove authentication token
   */
  public removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
  }

  /**
   * Make GET request
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Make POST request
   */
  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make PUT request
   */
  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make PATCH request
   */
  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Make DELETE request
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Make request with secret key authentication (for transaction processing)
   */
  public async requestWithSecretKey<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    secretKey: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Authorization': `Secret ${secretKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
    };

    let response: AxiosResponse<T>;
    switch (method) {
      case 'GET':
        response = await this.client.get<T>(url, requestConfig);
        break;
      case 'POST':
        response = await this.client.post<T>(url, data, requestConfig);
        break;
      case 'PUT':
        response = await this.client.put<T>(url, data, requestConfig);
        break;
      case 'PATCH':
        response = await this.client.patch<T>(url, data, requestConfig);
        break;
      case 'DELETE':
        response = await this.client.delete<T>(url, requestConfig);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
  }

  /**
   * Get the axios instance for advanced usage
   */
  public getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;