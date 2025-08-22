export interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  lastLogin: Date | null
  createdAt: Date
}

export interface UserLog {
  id: number
  userId: number
  userName: string
  action: string
  ip: string
  location: string
  device: string
  timestamp: Date
}

export interface UserFormData {
  name: string
  email: string
  role: string
  bdmTag?: string
  password: string
  confirmPassword: string
}

export interface UserFilters {
  searchQuery: string
  roleFilter: string
  statusFilter: string
}

export interface LogFilters {
  logSearchQuery: string
  actionFilter: string
  dateFilter: string
  userFilter: string
}

export const ROLES = [
  "Super Administrator",
  "Administrator",
  "Financial Administrator",
  "Manager",
  "Business Development Manager"
] as const

export const ACTION_TYPES = [
  "Login",
  "Logout",
  "Password Change",
  "Password Reset Request",
  "Created User",
  "Updated User Role",
  "Login Failed",
  "Changed Settings"
] as const

export type UserRole = typeof ROLES[number]
export type ActionType = typeof ACTION_TYPES[number] 