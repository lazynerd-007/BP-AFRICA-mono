// User Management Business Component Types

export interface UserAccount {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  lastLogin?: Date
  createdAt: Date
  createdBy?: string
  department?: string
  permissions: UserPermission[]
  avatar?: string
}

export interface UserRole {
  id: string
  name: string
  description: string
  level: number
  color?: string
  permissions: string[]
}

export interface UserActivity {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  ip: string
  location: string
  device: string
  timestamp: Date
  status: 'success' | 'failed' | 'warning'
}

export interface UserPermission {
  id: string
  name: string
  description: string
  module: string
  level: 'read' | 'write' | 'admin'
  granted: boolean
}

export interface UserFiltersState {
  searchQuery: string
  roleFilter: string
  statusFilter: string
  departmentFilter: string
  dateFilter: string
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  adminUsers: number
  recentLogins: number
  pendingApprovals: number
}

export interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  department?: string
  permissions: string[]
  sendWelcomeEmail: boolean
} 