"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  IconUsers, 
  IconUserCheck, 
  IconUserOff, 
  IconShield, 
  IconClock, 
  IconUserPlus,
  IconTrendingUp,
  IconTrendingDown
} from "@tabler/icons-react"
import { UserStats } from "./types"

interface UserStatsGridProps {
  stats: UserStats
  loading?: boolean
  className?: string
}

export function UserStatsGrid({ stats, loading = false, className }: UserStatsGridProps) {
  
  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: IconUsers,
      variant: 'default' as const,
      description: "All registered users"
    },
    {
      title: "Active Users", 
      value: stats.activeUsers,
      icon: IconUserCheck,
      variant: 'success' as const,
      description: "Currently active users",
      trend: stats.activeUsers > 0 ? 'up' : undefined
    },
    {
      title: "Inactive Users",
      value: stats.inactiveUsers, 
      icon: IconUserOff,
      variant: 'warning' as const,
      description: "Inactive user accounts"
    },
    {
      title: "Administrators",
      value: stats.adminUsers,
      icon: IconShield,
      variant: 'danger' as const, 
      description: "Users with admin privileges"
    },
    {
      title: "Recent Logins",
      value: stats.recentLogins,
      icon: IconClock,
      variant: 'info' as const,
      description: "Logins in last 24 hours",
      trend: stats.recentLogins > 10 ? 'up' : 'down'
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: IconUserPlus,
      variant: 'warning' as const,
      description: "Awaiting approval"
    }
  ]

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50/50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50/50'
      case 'danger':
        return 'border-red-200 bg-red-50/50'
      case 'info':
        return 'border-blue-200 bg-blue-50/50'
      default:
        return ''
    }
  }

  const getIconColor = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'danger':
        return 'text-red-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') {
      return <IconTrendingUp className="h-3 w-3 text-green-600" />
    }
    if (trend === 'down') {
      return <IconTrendingDown className="h-3 w-3 text-red-600" />
    }
    return null
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {statsCards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className={getVariantStyles(card.variant)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${getIconColor(card.variant)}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{card.value}</div>
                {getTrendIcon(card.trend)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 