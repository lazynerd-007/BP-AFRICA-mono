import { apiClient } from '../client';
import { AUTH_ENDPOINTS } from '../endpoints';
import {
  AuthEmailLoginDto,
  LoginResponse,
  User,
  RequestOtpDto,
  VerifyOtpDto,
  InitiatePwdReset,
  CompleteResetPasswordDto,
  ApiResponse,
} from '../types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService {
  /**
   * User login with email and password
   * @param credentials - User login credentials
   * @returns Promise with login response containing token and user data
   */
  async login(credentials: AuthEmailLoginDto): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );
      
      // Store the token in the API client and localStorage
      if (response.data?.token) {
        apiClient.setAuthToken(response.data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
      }
      
      return response.data!;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Partner bank specific login
   * @param partnerbank - Partner bank slug
   * @param credentials - User login credentials
   * @returns Promise with login response
   */
  async partnerBankLogin(
    partnerbank: string,
    credentials: AuthEmailLoginDto
  ): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        AUTH_ENDPOINTS.PARTNER_BANK_LOGIN(partnerbank),
        credentials
      );
      
      // Store the token in the API client and localStorage
      if (response.data?.token) {
        apiClient.setAuthToken(response.data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
      }
      
      return response.data!;
    } catch (error) {
      console.error('Partner bank login failed:', error);
      throw error;
    }
  }

  /**
   * Get current user profile information
   * @returns Promise with current user data
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(AUTH_ENDPOINTS.ME);
      return response.data!;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }

  /**
   * Request OTP for various purposes
   * @param otpRequest - OTP request data
   * @returns Promise with API response
   */
  async requestOtp(otpRequest: RequestOtpDto): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(
        AUTH_ENDPOINTS.OTP_REQUEST,
        otpRequest
      );
      return response;
    } catch (error) {
      console.error('Failed to request OTP:', error);
      throw error;
    }
  }

  /**
   * Verify OTP
   * @param otpData - OTP verification data
   * @returns Promise with API response
   */
  async verifyOtp(otpData: VerifyOtpDto): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(
        '/auth/verify-otp', // This endpoint might need to be added to the spec
        otpData
      );
      return response;
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      throw error;
    }
  }

  /**
   * Initiate password reset process
   * @param resetData - Password reset initiation data
   * @returns Promise with API response
   */
  async initiatePasswordReset(resetData: InitiatePwdReset): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(
        AUTH_ENDPOINTS.INITIATE_RESET_PASSWORD,
        resetData
      );
      return response;
    } catch (error) {
      console.error('Failed to initiate password reset:', error);
      throw error;
    }
  }

  /**
   * Complete password reset with token
   * @param resetData - Password reset completion data
   * @returns Promise with API response
   */
  async completePasswordReset(resetData: CompleteResetPasswordDto): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(
        AUTH_ENDPOINTS.COMPLETE_RESET_PASSWORD,
        resetData
      );
      return response;
    } catch (error) {
      console.error('Failed to complete password reset:', error);
      throw error;
    }
  }

  /**
   * Logout user and clear authentication token
   * @returns Promise with API response
   */
  async logout(): Promise<void> {
    try {
      // Clear the token from the API client
      apiClient.removeAuthToken();
      
      // Optionally call a logout endpoint if it exists
      // await apiClient.post('/auth/logout');
      
      // Clear any additional user data from local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, we should still clear local data
      apiClient.removeAuthToken();
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Get stored authentication token
   * @returns Authentication token or null
   */
  getAuthToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Refresh authentication token
   * @returns Promise with new login response
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      // This endpoint might need to be added to the API spec
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh');
      
      if (response.data?.token) {
        apiClient.setAuthToken(response.data.token);
      }
      
      return response.data!;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout the user
      await this.logout();
      throw error;
    }
  }

  /**
   * Change user password
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @param confirmPassword - Confirm new password
   * @returns Promise with API response
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return response;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param profileData - Updated profile data
   * @returns Promise with updated user data
   */
  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>('/auth/profile', profileData);
      return response.data!;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;