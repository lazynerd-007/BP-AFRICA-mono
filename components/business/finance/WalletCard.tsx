"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconWallet, IconEye, IconEyeOff, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { useState } from "react"
import { WalletData } from "./types"

interface WalletCardProps {
  wallet: WalletData
  showBalance?: boolean
  onViewDetails?: () => void
  onFundWallet?: () => void
  onTransfer?: () => void
  className?: string
}

export function WalletCard({ 
  wallet, 
  showBalance = true, 
  onViewDetails, 
  onFundWallet, 
  onTransfer,
  className 
}: WalletCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(showBalance)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-900/30 dark:text-gray-400'
      case 'frozen':
        return 'bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-400'
      default:
        return ''
    }
  }

  const getWalletTypeIcon = (type: string) => {
    switch (type) {
      case 'collection':
        return <IconTrendingUp className="h-4 w-4" />
      case 'payout':
        return <IconTrendingDown className="h-4 w-4" />
      default:
        return <IconWallet className="h-4 w-4" />
    }
  }

  const formatBalance = (balance: string) => {
    return isBalanceVisible ? balance : "••••••••"
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getWalletTypeIcon(wallet.type)}
          {wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)} Wallet
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={getStatusColor(wallet.status)}
          >
            {wallet.status}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
          >
            {isBalanceVisible ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold">
              {wallet.currency} {formatBalance(wallet.balance)}
            </div>
            {wallet.accountNumber && (
              <p className="text-xs text-muted-foreground">
                Account: {wallet.accountNumber}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Last updated: {wallet.lastUpdated.toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex gap-2">
            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                View Details
              </Button>
            )}
            {onFundWallet && wallet.type === 'collection' && (
              <Button variant="outline" size="sm" onClick={onFundWallet}>
                Fund Wallet
              </Button>
            )}
            {onTransfer && (
              <Button variant="outline" size="sm" onClick={onTransfer}>
                Transfer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 