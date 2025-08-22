import { apiClient } from '../client';
import { USER_ENDPOINTS, SETTINGS_ENDPOINTS, REPORTS_ENDPOINTS, AUDIT_ENDPOINTS } from '../endpoints';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserQueryParams,
  UserRole,
  UserStatus,
  PaginatedResponse,
  ApiResponse,
  SystemSettings,
  AuditLog,
  DashboardStats,
  ReportParams,
  PartnerBank,
  CreatePartnerBankDto,
  UpdatePartnerBankDto,
} from '../types';

/**
 * Admin Service
 * Handles all admin-specific API calls including user management, system settings, and reports
 */
export class AdminService {
  // ==================== USER MANAGEMENT ====================

  /**
   * Get all users with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated user list
   */
  async getUsers(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>(
        USER_ENDPOINTS.USERS,
        { params }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  /**
   * Get a specific user by ID
   * @param id - User ID
   * @returns Promise with user data
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        USER_ENDPOINTS.USER_BY_ID(id)
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param userData - User creation data
   * @returns Promise with created user
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const response = await apiClient.post<ApiResponse<User>>(
        USER_ENDPOINTS.CREATE_USER,
        userData
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  /**
   * Update an existing user
   * @param id - User ID
   * @param updateData - User update data
   * @returns Promise with updated user
   */
  async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(
        USER_ENDPOINTS.UPDATE_USER(id),
        updateData
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   * @param id - User ID
   * @returns Promise with API response
   */
  async deleteUser(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(
        USER_ENDPOINTS.DELETE_USER(id)
      );
      return response;
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update user status
   * @param id - User ID
   * @param status - New user status
   * @param reason - Optional reason for status change
   * @returns Promise with updated user
   */
  async updateUserStatus(
    id: string,
    status: UserStatus,
    reason?: string
  ): Promise<User> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(
        `${USER_ENDPOINTS.USER_BY_ID(id)}/status`,
        { status, reason }
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to update user status ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update user role
   * @param id - User ID
   * @param role - New user role
   * @returns Promise with updated user
   */
  async updateUserRole(id: string, role: UserRole): Promise<User> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(
        `${USER_ENDPOINTS.USER_BY_ID(id)}/role`,
        { role }
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to update user role ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get users by role
   * @param role - User role
   * @param params - Additional query parameters
   * @returns Promise with paginated users by role
   */
  async getUsersByRole(
    role: UserRole,
    params?: UserQueryParams
  ): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>(
        USER_ENDPOINTS.USERS,
        { params: { ...params, role } }
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch users with role ${role}:`, error);
      throw error;
    }
  }

  /**
   * Search users by name, email, or other criteria
   * @param searchTerm - Search term
   * @param params - Additional query parameters
   * @returns Promise with paginated search results
   */
  async searchUsers(
    searchTerm: string,
    params?: UserQueryParams
  ): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>(
        USER_ENDPOINTS.USERS,
        {
          params: {
            ...params,
            search: searchTerm
          }
        }
      );
      return response;
    } catch (error) {
      console.error(`Failed to search users with term "${searchTerm}":`, error);
      throw error;
    }
  }

  // ==================== SYSTEM SETTINGS ====================

  /**
   * Get system settings
   * @returns Promise with system settings
   */
  async getSystemSettings(): Promise<SystemSettings> {
    try {
      const response = await apiClient.get<ApiResponse<SystemSettings>>(
        SETTINGS_ENDPOINTS.SETTINGS
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to fetch system settings:', error);
      throw error;
    }
  }

  /**
   * Update system settings
   * @param settings - Updated system settings
   * @returns Promise with updated settings
   */
  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const response = await apiClient.put<ApiResponse<SystemSettings>>(
        SETTINGS_ENDPOINTS.UPDATE_SETTINGS,
        settings
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to update system settings:', error);
      throw error;
    }
  }

  // ==================== DASHBOARD & ANALYTICS ====================

  /**
   * Get admin dashboard statistics
   * @param params - Query parameters for filtering
   * @returns Promise with dashboard stats
   */
  async getDashboardStats(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'day' | 'week' | 'month' | 'year';
  }): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<ApiResponse<DashboardStats>>(
        REPORTS_ENDPOINTS.DASHBOARD_ANALYTICS,
        { params }
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }

  // ==================== AUDIT LOGS ====================

  /**
   * Get audit logs
   * @param params - Query parameters for filtering
   * @returns Promise with paginated audit logs
   */
  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    userId?: string;
    action?: string;
    resource?: string;
  }): Promise<PaginatedResponse<AuditLog>> {
    try {
      const response = await apiClient.get<PaginatedResponse<AuditLog>>(
        AUDIT_ENDPOINTS.AUDIT_LOGS,
        { params }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      throw error;
    }
  }

  // ==================== REPORTS ====================

  /**
   * Generate transaction report
   * @param params - Report parameters
   * @returns Promise with report data
   */
  async generateTransactionReport(params: ReportParams): Promise<{ reportUrl: string; reportId: string }> {
    try {
      const response = await apiClient.post<ApiResponse<{ reportUrl: string; reportId: string }>>(
        REPORTS_ENDPOINTS.TRANSACTION_REPORTS,
        params
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to generate transaction report:', error);
      throw error;
    }
  }

  /**
   * Generate merchant report
   * @param params - Report parameters
   * @returns Promise with report data
   */
  async generateMerchantReport(params: ReportParams): Promise<{ reportUrl: string; reportId: string }> {
    try {
      const response = await apiClient.post<ApiResponse<{ reportUrl: string; reportId: string }>>(
        REPORTS_ENDPOINTS.MERCHANT_REPORTS,
        params
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to generate merchant report:', error);
      throw error;
    }
  }

  /**
   * Generate financial report
   * @param params - Report parameters
   * @returns Promise with report data
   */
  async generateFinancialReport(params: ReportParams): Promise<{ reportUrl: string; reportId: string }> {
    try {
      const response = await apiClient.post<ApiResponse<{ reportUrl: string; reportId: string }>>(
        REPORTS_ENDPOINTS.REVENUE_REPORTS,
        params
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to generate financial report:', error);
      throw error;
    }
  }

  /**
   * Export report to file
   * @param reportType - Type of report
   * @param params - Report parameters
   * @param format - Export format
   * @returns Promise with file blob
   */
  async exportReport(
    reportType: 'transactions' | 'merchants' | 'financial',
    params: ReportParams,
    format: 'csv' | 'excel' | 'pdf' = 'csv'
  ): Promise<Blob> {
    try {
      const response = await apiClient.post(
        REPORTS_ENDPOINTS.EXPORT_TRANSACTIONS,
        {
          reportType,
          ...params,
          format
        },
        {
          responseType: 'blob'
        }
      );
      return response as unknown as Blob;
    } catch (error) {
      console.error('Failed to export report:', error);
      throw error;
    }
  }

  // ==================== PARTNER BANK MANAGEMENT ====================

  /**
   * Get all partner banks
   * @param params - Query parameters
   * @returns Promise with paginated partner banks
   */
  async getPartnerBanks(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<PartnerBank>> {
    try {
      const response = await apiClient.get<PaginatedResponse<PartnerBank>>(
        '/partner-banks',
        { params }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch partner banks:', error);
      throw error;
    }
  }

  /**
   * Get partner bank by ID
   * @param id - Partner bank ID
   * @returns Promise with partner bank data
   */
  async getPartnerBankById(id: string): Promise<PartnerBank> {
    try {
      const response = await apiClient.get<ApiResponse<PartnerBank>>(
        `/partner-banks/${id}`
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to fetch partner bank ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new partner bank
   * @param partnerBankData - Partner bank creation data
   * @returns Promise with created partner bank
   */
  async createPartnerBank(partnerBankData: CreatePartnerBankDto): Promise<PartnerBank> {
    try {
      const response = await apiClient.post<ApiResponse<PartnerBank>>(
        '/partner-banks',
        partnerBankData
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to create partner bank:', error);
      throw error;
    }
  }

  /**
   * Update partner bank
   * @param id - Partner bank ID
   * @param updateData - Update data
   * @returns Promise with updated partner bank
   */
  async updatePartnerBank(id: string, updateData: UpdatePartnerBankDto): Promise<PartnerBank> {
    try {
      const response = await apiClient.patch<ApiResponse<PartnerBank>>(
        `/partner-banks/${id}`,
        updateData
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to update partner bank ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete partner bank
   * @param id - Partner bank ID
   * @returns Promise with API response
   */
  async deletePartnerBank(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `/partner-banks/${id}`
      );
      return response;
    } catch (error) {
      console.error(`Failed to delete partner bank ${id}:`, error);
      throw error;
    }
  }

  // ==================== BULK OPERATIONS ====================

  /**
   * Bulk update user statuses
   * @param userIds - Array of user IDs
   * @param status - New status for all users
   * @param reason - Optional reason for bulk update
   * @returns Promise with API response
   */
  async bulkUpdateUserStatus(
    userIds: string[],
    status: UserStatus,
    reason?: string
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.patch<ApiResponse>(
        '/users/bulk-update',
        {
          userIds,
          status,
          reason
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to bulk update user statuses:', error);
      throw error;
    }
  }

  /**
   * Export users to CSV or Excel
   * @param params - Export parameters
   * @param format - Export format
   * @returns Promise with file blob
   */
  async exportUsers(
    params?: UserQueryParams,
    format: 'csv' | 'excel' = 'csv'
  ): Promise<Blob> {
    try {
      const response = await apiClient.get(
        '/users/export',
        {
          params: {
            ...params,
            format
          },
          responseType: 'blob'
        }
      );
      return response as unknown as Blob;
    } catch (error) {
      console.error('Failed to export users:', error);
      throw error;
    }
  }

  // ==================== SYSTEM MAINTENANCE ====================

  /**
   * Clear system cache
   * @returns Promise with API response
   */
  async clearCache(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string }>>(
        '/admin/clear-cache'
      );
      return response;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }

  /**
   * Get system health status
   * @returns Promise with system health data
   */
  async getSystemHealth(): Promise<{ status: string; uptime: number; memory: object; database: object }> {
    try {
      const response = await apiClient.get<ApiResponse<{ status: string; uptime: number; memory: object; database: object }>>(
        SETTINGS_ENDPOINTS.HEALTH_CHECK
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to fetch system health:', error);
      throw error;
    }
  }

  /**
   * Backup system data
   * @returns Promise with backup response
   */
  async backupSystem(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(
        '/admin/backup-system'
      );
      return response;
    } catch (error) {
      console.error('Failed to backup system:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;