"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconUsers, IconUserCheck, IconUserX, IconActivity } from "@tabler/icons-react"
import { User, UserLog } from "./types"

interface UserStatsCardsProps {
  users: User[]
  userLogs: UserLog[]
}

export function UserStatsCards({ users, userLogs }: UserStatsCardsProps) {
  const activeUsers = users.filter(u => u.status === "active").length
  const inactiveUsers = users.filter(u => u.status === "inactive").length
  const todayLogs = userLogs.filter(log => 
    new Date(log.timestamp).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <IconUsers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground">
            All registered users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <IconUserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            Currently active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
          <IconUserX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
          <p className="text-xs text-muted-foreground">
            Currently inactive
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Activity</CardTitle>
          <IconActivity className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{todayLogs}</div>
          <p className="text-xs text-muted-foreground">
            Actions today
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 