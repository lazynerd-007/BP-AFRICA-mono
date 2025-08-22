// Workflow Business Component Types

export interface WorkflowRequest {
  id: string
  type: 'fund_transfer' | 'user_approval' | 'merchant_approval' | 'reversal' | 'settlement'
  title: string
  description: string
  requestedBy: string
  requesterId: string
  amount?: string
  currency?: string
  status: WorkflowStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
  steps: ApprovalStep[]
  metadata: Record<string, unknown>
  tags?: string[]
}

export interface ApprovalStep {
  id: string
  stepNumber: number
  title: string
  description: string
  approverRole: string
  approverName?: string
  approverId?: string
  status: 'pending' | 'approved' | 'rejected' | 'skipped'
  action?: ApprovalAction
  timestamp?: Date
  comments?: string
  requiredDocuments?: string[]
  attachments?: string[]
}

export interface ApprovalAction {
  type: 'approve' | 'reject' | 'request_info' | 'escalate'
  reason?: string
  comments: string
  otpRequired: boolean
  documentVerification?: boolean
  timestamp: Date
  ipAddress?: string
  location?: string
}

export type WorkflowStatus = 
  | 'draft' 
  | 'submitted' 
  | 'pending_approval' 
  | 'approved' 
  | 'rejected' 
  | 'cancelled' 
  | 'expired'
  | 'in_progress'
  | 'completed'

export interface WorkflowMetrics {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  averageApprovalTime: number // in hours
  urgentRequests: number
  expiringSoon: number
}

export interface WorkflowFilters {
  status: string
  type: string
  priority: string
  assignee: string
  dateRange: {
    from?: Date
    to?: Date
  }
  searchQuery: string
}

export interface WorkflowConfiguration {
  type: string
  steps: WorkflowStepConfig[]
  autoAssignment: boolean
  escalationRules: EscalationRule[]
  notifications: NotificationConfig[]
}

export interface WorkflowStepConfig {
  id: string
  name: string
  approverRole: string
  required: boolean
  parallel: boolean
  timeLimit?: number // hours
  conditions?: Record<string, unknown>
}

export interface EscalationRule {
  triggersAfter: number // hours
  escalateTo: string
  notificationMessage: string
}

export interface NotificationConfig {
  event: string
  recipients: string[]
  template: string
  channels: ('email' | 'sms' | 'push')[]
} 