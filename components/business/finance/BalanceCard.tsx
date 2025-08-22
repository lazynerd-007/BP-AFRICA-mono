"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconWallet, IconTrendingUp, IconClock, IconEye, IconEyeOff } from "@tabler/icons-react"
import { useState } from "react"
import { BalanceInfo } from "./types"

interface BalanceCardProps {
  title: string
  balance: BalanceInfo
  icon?: React.ReactNode
  showDetails?: boolean
  onViewDetails?: () => void
  onQuickAction?: () => void
  quickActionLabel?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

export function BalanceCard({
  title,
  balance,
  icon,
  showDetails = true,
  onViewDetails,
  onQuickAction,
  quickActionLabel = "View Details",
  variant = 'default',
  className
}: BalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50/50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50/50'
      case 'danger':
        return 'border-red-200 bg-red-50/50'
      default:
        return ''
    }
  }

  const formatBalance = (amount: string) => {
    return isBalanceVisible ? amount : "••••••••"
  }

  const defaultIcon = <IconWallet className="h-4 w-4 text-muted-foreground" />

  return (
    <Card className={`${getVariantStyles()} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon || defaultIcon}
          {title}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsBalanceVisible(!isBalanceVisible)}
        >
          {isBalanceVisible ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main Balance */}
          <div>
            <div className="text-2xl font-bold">
              {balance.currency} {formatBalance(balance.available)}
            </div>
            <p className="text-xs text-muted-foreground">Available Balance</p>
          </div>

          {/* Additional Balance Details */}
          {showDetails && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <IconClock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Pending</span>
                </div>
                <span className="font-medium">
                  {balance.currency} {formatBalance(balance.pending)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <IconTrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Total</span>
                </div>
                <span className="font-medium">
                  {balance.currency} {formatBalance(balance.total)}
                </span>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground">
            Last updated: {balance.lastUpdated.toLocaleDateString()} at {balance.lastUpdated.toLocaleTimeString()}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                {quickActionLabel}
              </Button>
            )}
            {onQuickAction && (
              <Button size="sm" onClick={onQuickAction}>
                Quick Action
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 