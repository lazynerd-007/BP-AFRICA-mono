"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  IconCheck, 
  IconX, 
  IconClock, 
  IconAlertCircle, 
  IconEye,
  IconLockAccess,
  IconInfoCircle
} from "@tabler/icons-react"
import { WorkflowRequest, ApprovalAction } from "./types"

interface ApprovalWorkflowProps {
  request: WorkflowRequest
  onApprove?: (request: WorkflowRequest, action: ApprovalAction) => void
  onReject?: (request: WorkflowRequest, action: ApprovalAction) => void
  onRequestInfo?: (request: WorkflowRequest, action: ApprovalAction) => void
  onViewDetails?: (request: WorkflowRequest) => void
  currentUserRole?: string
  allowActions?: boolean
  className?: string
}

export function ApprovalWorkflow({
  request,
  onApprove,
  onReject, 
  onRequestInfo,
  onViewDetails,
  currentUserRole,
  allowActions = true,
  className
}: ApprovalWorkflowProps) {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [comments, setComments] = useState("")
  const [otp, setOtp] = useState("")
  const [processing, setProcessing] = useState(false)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return 'outline'
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      case 'in_progress':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400"
      case 'pending_approval':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return ""
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive'
      case 'high':
        return 'default'
      case 'medium':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getCurrentStep = () => {
    return request.steps.find(step => step.status === 'pending')
  }

  const canUserApprove = () => {
    const currentStep = getCurrentStep()
    return currentStep && currentUserRole && currentStep.approverRole === currentUserRole
  }

  const handleAction = async (type: 'approve' | 'reject' | 'request_info') => {
    if (!comments.trim() && type !== 'approve') {
      alert("Please provide comments")
      return
    }

    if (type === 'approve' && otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP")
      return
    }

    setProcessing(true)

    const action: ApprovalAction = {
      type,
      comments,
      reason: type === 'reject' ? comments : undefined,
      otpRequired: type === 'approve',
      timestamp: new Date(),
      documentVerification: type === 'approve'
    }

    // Simulate API call
    setTimeout(() => {
      setProcessing(false)
      
      // Call appropriate handler
      switch (type) {
        case 'approve':
          onApprove?.(request, action)
          setShowApprovalDialog(false)
          break
        case 'reject':
          onReject?.(request, action)
          setShowRejectionDialog(false)
          break
        case 'request_info':
          onRequestInfo?.(request, action)
          setShowInfoDialog(false)
          break
      }

      // Reset form
      setComments("")
      setOtp("")
    }, 1500)
  }

  const openActionDialog = (type: 'approve' | 'reject' | 'request_info') => {
    switch (type) {
      case 'approve':
        setShowApprovalDialog(true)
        break
      case 'reject':
        setShowRejectionDialog(true)
        break
      case 'request_info':
        setShowInfoDialog(true)
        break
    }
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{request.title}</CardTitle>
              <CardDescription>{request.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityBadgeVariant(request.priority)}>
                {request.priority}
              </Badge>
              <Badge 
                variant={getStatusBadgeVariant(request.status)}
                className={getStatusBadgeClasses(request.status)}
              >
                {request.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Request Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Requested by:</span>
              <div className="font-medium">{request.requestedBy}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span>
              <div className="font-medium">{request.createdAt.toLocaleDateString()}</div>
            </div>
            {request.amount && (
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <div className="font-medium">{request.currency} {request.amount}</div>
              </div>
            )}
            {request.dueDate && (
              <div>
                <span className="text-muted-foreground">Due date:</span>
                <div className="font-medium">{request.dueDate.toLocaleDateString()}</div>
              </div>
            )}
          </div>

          {/* Current Step */}
          {getCurrentStep() && (
            <Alert>
              <IconClock className="h-4 w-4" />
              <AlertTitle>Current Step</AlertTitle>
              <AlertDescription>
                {getCurrentStep()?.title} - Awaiting approval from {getCurrentStep()?.approverRole}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={() => onViewDetails(request)}>
                <IconEye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            )}
            
            {allowActions && canUserApprove() && (
              <>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => openActionDialog('approve')}
                >
                  <IconCheck className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => openActionDialog('reject')}
                >
                  <IconX className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openActionDialog('request_info')}
                >
                  <IconInfoCircle className="h-4 w-4 mr-2" />
                  Request Info
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <IconLockAccess className="mr-2 h-5 w-5" />
              Approve Request
            </DialogTitle>
            <DialogDescription>
              Confirm approval of this {request.type.replace('_', ' ')} request
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Alert className="bg-blue-50 border-blue-200">
              <IconAlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle>Confirm Details</AlertTitle>
              <AlertDescription>
                <div className="space-y-1 mt-2">
                  <p>Request: <span className="font-medium">{request.title}</span></p>
                  {request.amount && (
                    <p>Amount: <span className="font-medium">{request.currency} {request.amount}</span></p>
                  )}
                  <p>Requested by: <span className="font-medium">{request.requestedBy}</span></p>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="approval-comments">Comments (Optional)</Label>
              <Textarea
                id="approval-comments"
                placeholder="Add any comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="approval-otp">One-Time Password (OTP)</Label>
              <Input
                id="approval-otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center font-mono text-lg"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                An OTP has been sent to your registered mobile number
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleAction('approve')} 
              disabled={otp.length !== 6 || processing}
            >
              {processing ? "Processing..." : "Approve Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <IconX className="mr-2 h-5 w-5" />
              Reject Request
            </DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this request
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide a detailed reason..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleAction('reject')} 
              disabled={!comments.trim() || processing}
            >
              {processing ? "Processing..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <IconInfoCircle className="mr-2 h-5 w-5" />
              Request Additional Information
            </DialogTitle>
            <DialogDescription>
              Request more information from the requester
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="info-request">Information Needed *</Label>
              <Textarea
                id="info-request"
                placeholder="Specify what additional information is required..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInfoDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleAction('request_info')} 
              disabled={!comments.trim() || processing}
            >
              {processing ? "Sending..." : "Request Information"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 