"use client"

import * as React from "react"
import { IconTrash, IconDownload, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TableAction, BaseData } from "../types"

interface TableActionsProps<TData extends BaseData = BaseData> {
  selectedRows: TData[]
  actions: TableAction<TData>[]
  className?: string
  disabled?: boolean
}

export function TableActions<TData extends BaseData = BaseData>({
  selectedRows,
  actions,
  className,
  disabled = false,
}: TableActionsProps<TData>) {
  const [confirmAction, setConfirmAction] = React.useState<TableAction<TData> | null>(null)
  
  const selectedCount = selectedRows.length
  const hasSelection = selectedCount > 0

  // Filter actions based on selection requirements
  const availableActions = actions.filter(action => {
    if (action.requiresSelection && !hasSelection) return false
    if (action.disabled?.(selectedRows)) return false
    return true
  })

  const handleActionClick = (action: TableAction<TData>) => {
    if (action.confirmationMessage) {
      setConfirmAction(action)
    } else {
      action.onClick(selectedRows)
    }
  }

  const handleConfirmAction = () => {
    if (confirmAction) {
      confirmAction.onClick(selectedRows)
      setConfirmAction(null)
    }
  }

  if (availableActions.length === 0) {
    return null
  }

  // If only one or two actions, show as buttons
  if (availableActions.length <= 2) {
    return (
      <>
        <div className={cn("flex items-center gap-2", className)}>
          {hasSelection && (
            <Badge variant="secondary" className="text-xs">
              {selectedCount} selected
            </Badge>
          )}
          {availableActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant={action.variant || "outline"}
                size="sm"
                onClick={() => handleActionClick(action)}
                disabled={disabled}
                className="h-8"
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {action.label}
              </Button>
            )
          })}
        </div>
        
        {/* Confirmation Dialog */}
        <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmAction?.confirmationMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmAction}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  // If more than two actions, use dropdown
  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        {hasSelection && (
          <Badge variant="secondary" className="text-xs">
            {selectedCount} selected
          </Badge>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={disabled} className="h-8">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {availableActions.map((action, index) => {
              const Icon = action.icon
              return (
                <React.Fragment key={index}>
                  <DropdownMenuItem
                    onClick={() => handleActionClick(action)}
                    className={cn(
                      action.variant === "destructive" && "text-destructive focus:text-destructive"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </DropdownMenuItem>
                  {index < availableActions.length - 1 && <DropdownMenuSeparator />}
                </React.Fragment>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.confirmationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Predefined common actions
export const commonTableActions = {
  delete: <TData extends BaseData = BaseData>(onDelete: (rows: TData[]) => void): TableAction<TData> => ({
    label: "Delete",
    icon: IconTrash,
    onClick: onDelete,
    variant: "destructive" as const,
    requiresSelection: true,
    confirmationMessage: "Are you sure you want to delete the selected items? This action cannot be undone.",
  }),
  
  export: <TData extends BaseData = BaseData>(onExport: (rows: TData[]) => void): TableAction<TData> => ({
    label: "Export",
    icon: IconDownload,
    onClick: onExport,
    variant: "outline" as const,
  }),
  
  refresh: <TData extends BaseData = BaseData>(onRefresh: () => void): TableAction<TData> => ({
    label: "Refresh",
    icon: IconRefresh,
    onClick: () => onRefresh(),
    variant: "outline" as const,
  }),
} 