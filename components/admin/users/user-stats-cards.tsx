"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconUsers, IconUserCheck, IconUserX } from "@tabler/icons-react"
import { User } from "./types"

interface UserStatsCardsProps {
  users: User[]
}

export function UserStatsCards({ users }: UserStatsCardsProps) {
  const activeUsers = users.filter(u => u.status === "active").length
  const inactiveUsers = users.filter(u => u.status === "inactive").length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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


    </div>
  )
}