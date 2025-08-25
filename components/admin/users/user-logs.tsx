"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconFilter, IconSearch, IconDeviceLaptop, IconMapPin, IconClock } from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User, UserLog, LogFilters, ACTION_TYPES } from "./types"

interface UserLogsProps {
  users: User[]
  userLogs: UserLog[]
  filters: LogFilters
  onFiltersChange: (filters: LogFilters) => void
}

export function UserLogs({ users, userLogs, filters, onFiltersChange }: UserLogsProps) {
  const { logSearchQuery, actionFilter, dateFilter, userFilter } = filters

  // Filter logs based on search, action, date, and user
  const filteredLogs = userLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(logSearchQuery.toLowerCase()) || 
      log.ip.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.device.toLowerCase().includes(logSearchQuery.toLowerCase())
    
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesUser = userFilter === "all" || log.userId.toString() === userFilter
    
    let matchesDate = true
    const today = new Date()
    const logDate = new Date(log.timestamp)
    
    if (dateFilter === "today") {
      matchesDate = logDate.toDateString() === today.toDateString()
    } else if (dateFilter === "yesterday") {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      matchesDate = logDate.toDateString() === yesterday.toDateString()
    } else if (dateFilter === "thisWeek") {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchesDate = logDate >= weekAgo
    }
    
    return matchesSearch && matchesAction && matchesDate && matchesUser
  })

  // Count user actions
  const userActionCounts = userLogs.reduce((acc, log) => {
    acc[log.userId] = (acc[log.userId] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
  }

  // Format date and time
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle className="text-xl font-semibold">User Activity Logs</CardTitle>
            <CardDescription>Track user activity across the system</CardDescription>
          </div>
          <div className="flex mt-4 md:mt-0">
            <Badge variant="outline" className="mr-2">
              Total Logs: {userLogs.length}
            </Badge>
            <Badge variant="secondary">
              Today: {userLogs.filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString()).length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-9"
              value={logSearchQuery}
              onChange={(e) => onFiltersChange({ ...filters, logSearchQuery: e.target.value })}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center">
              <IconFilter className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm mr-2">Filters:</span>
            </div>
            <Select 
              value={actionFilter} 
              onValueChange={(value) => onFiltersChange({ ...filters, actionFilter: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {ACTION_TYPES.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={dateFilter} 
              onValueChange={(value) => onFiltersChange({ ...filters, dateFilter: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={userFilter} 
              onValueChange={(value) => onFiltersChange({ ...filters, userFilter: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead className="w-[180px]">User</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
                <TableHead className="w-[130px]">IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead className="w-[180px]">Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{getInitials(log.userName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span>{log.userName}</span>
                          {userActionCounts[log.userId] > 2 && (
                            <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs bg-amber-50 text-amber-700 border-amber-200">
                              {userActionCounts[log.userId]}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">User #{log.userId}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        log.action.includes("Failed") 
                          ? "destructive" 
                          : log.action === "Login" || log.action === "Logout"
                            ? "outline" 
                            : log.action.includes("Password")
                              ? "secondary" 
                              : "default"
                      }
                      className="font-normal"
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center">
                      <IconDeviceLaptop className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {log.ip}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <IconMapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {log.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.device}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center">
                      <IconClock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {formatDateTime(log.timestamp)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No logs found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}