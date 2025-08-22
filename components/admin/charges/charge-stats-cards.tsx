"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconWallet, IconDeviceMobile, IconBuildingBank, IconArrowUp } from "@tabler/icons-react"
import { ChargesData, ChargeData } from "./types"

interface ChargeStatsCardsProps {
  charges: ChargesData
  currency: string
}

export function ChargeStatsCards({ charges, currency }: ChargeStatsCardsProps) {
  const formatAmount = (amount: number) => `${currency}${amount.toFixed(2)}`

  const formatChargeDisplay = (charge: ChargeData) => {
    return charge.chargeType === "fixed" 
      ? formatAmount(charge.amount) 
      : `${charge.percentage}% (Cap: ${formatAmount(charge.cap)})`
  }

  const getStatusColor = (status: string) => {
    return status === "Active" ? "text-green-600" : "text-gray-500"
  }

  const chargeCards = [
    {
      title: "Wallet to Wallet",
      subtitle: "Internal transfers",
      icon: <IconWallet className="h-5 w-5" />,
      charge: charges.walletToWallet,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "MOMO Settlement",
      subtitle: "Mobile money settlements",
      icon: <IconDeviceMobile className="h-5 w-5" />,
      charge: charges.momoSettlement,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Bank Settlement",
      subtitle: "Bank account settlements",
      icon: <IconBuildingBank className="h-5 w-5" />,
      charge: charges.bankSettlement,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "MOMO Payout",
      subtitle: "Mobile money payouts",
      icon: (
        <div className="relative">
          <IconDeviceMobile className="h-5 w-5" />
          <IconArrowUp className="h-3 w-3 absolute -top-1 -right-1" />
        </div>
      ),
      charge: charges.momoPayout,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      title: "Bank Payout",
      subtitle: "Bank account payouts",
      icon: (
        <div className="relative">
          <IconBuildingBank className="h-5 w-5" />
          <IconArrowUp className="h-3 w-3 absolute -top-1 -right-1" />
        </div>
      ),
      charge: charges.bankPayout,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    }
  ]

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">Current Charge Overview</h2>
        <p className="text-sm text-muted-foreground">Active charges across all settlement and payout methods</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {chargeCards.map((card, index) => (
          <Card key={index} className={`${card.borderColor} border-2 ${card.bgColor} hover:shadow-lg transition-all duration-200 hover:scale-105`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-900">
                  {card.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className={`text-xl font-bold ${card.color}`}>
                {formatChargeDisplay(card.charge)}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {card.charge.chargeType === "fixed" ? "Fixed charge" : "Percentage charge"}
                </p>
                <span className={`text-xs font-medium ${getStatusColor(card.charge.status)}`}>
                  {card.charge.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Updated: {card.charge.lastUpdated}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {chargeCards.filter(card => card.charge.status === "Active").length}
          </div>
          <div className="text-sm text-muted-foreground">Active Charges</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {chargeCards.filter(card => card.charge.chargeType === "percentage").length}
          </div>
          <div className="text-sm text-muted-foreground">Percentage Based</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {chargeCards.filter(card => card.charge.chargeType === "fixed").length}
          </div>
          <div className="text-sm text-muted-foreground">Fixed Amount</div>
        </div>
      </div>
    </div>
  )
} 