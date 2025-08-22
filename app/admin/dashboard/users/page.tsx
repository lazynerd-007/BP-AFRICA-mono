"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconUsers, IconPlus, IconActivity } from "@tabler/icons-react"
import { 
  UserStatsCards, 
  UserList, 
  UserForm, 
  UserLogs,
  User, 
  UserLog,
  UserFilters,
  LogFilters 
} from "@/components/admin/users"

// Mock data for users
const mockUsers: User[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Super Administrator",
    status: "active",
    lastLogin: new Date("2023-11-10T14:32:18"),
    createdAt: new Date("2023-06-14T09:21:43"),
  },
  {
    id: 2,
    name: "Samantha Lee",
    email: "samantha.lee@example.com",
    role: "Administrator",
    status: "active",
    lastLogin: new Date("2023-11-09T11:15:27"),
    createdAt: new Date("2023-07-21T13:42:11"),
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "Financial Administrator",
    status: "inactive",
    lastLogin: new Date("2023-10-28T09:54:06"),
    createdAt: new Date("2023-08-05T16:30:55"),
  },
  {
    id: 4,
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    role: "Manager",
    status: "active",
    lastLogin: new Date("2023-11-10T10:12:33"),
    createdAt: new Date("2023-09-12T08:22:41"),
  },
  {
    id: 5,
    name: "David Rodriguez",
    email: "david.rodriguez@example.com",
    role: "Financial Administrator",
    status: "active",
    lastLogin: new Date("2023-11-07T16:48:22"),
    createdAt: new Date("2023-09-27T11:35:19"),
  },
]

// Mock data for user logs
const mockUserLogs: UserLog[] = [
  {
    id: 1,
    userId: 1,
    userName: "Alex Johnson",
    action: "Login",
    ip: "192.168.1.105",
    location: "Accra, Greater Accra, Ghana",
    device: "Chrome on macOS",
    timestamp: new Date("2023-11-10T14:32:18"),
  },
  {
    id: 2,
    userId: 2,
    userName: "Samantha Lee",
    action: "Password Change",
    ip: "172.16.254.1",
    location: "Kumasi, Ashanti Region, Ghana",
    device: "Firefox on Windows",
    timestamp: new Date("2023-11-09T11:15:27"),
  },
  {
    id: 3,
    userId: 1,
    userName: "Alex Johnson",
    action: "Created User",
    ip: "192.168.1.105",
    location: "Accra, Greater Accra, Ghana",
    device: "Chrome on macOS",
    timestamp: new Date("2023-11-08T16:42:53"),
  },
  {
    id: 4,
    userId: 4,
    userName: "Emily Wilson",
    action: "Login",
    ip: "192.168.0.1",
    location: "Takoradi, Western Region, Ghana",
    device: "Safari on iOS",
    timestamp: new Date("2023-11-10T10:12:33"),
  },
  {
    id: 5,
    userId: 3,
    userName: "Michael Chen",
    action: "Password Reset Request",
    ip: "10.0.0.1",
    location: "Tamale, Northern Region, Ghana",
    device: "Edge on Windows",
    timestamp: new Date("2023-10-28T09:54:06"),
  },
  {
    id: 6,
    userId: 5,
    userName: "David Rodriguez",
    action: "Login Failed",
    ip: "192.168.2.254",
    location: "Cape Coast, Central Region, Ghana",
    device: "Chrome on Android",
    timestamp: new Date("2023-11-07T16:48:22"),
  },
  {
    id: 7,
    userId: 5,
    userName: "David Rodriguez",
    action: "Login",
    ip: "192.168.2.254",
    location: "Cape Coast, Central Region, Ghana",
    device: "Chrome on Android",
    timestamp: new Date("2023-11-07T16:50:03"),
  },
  {
    id: 8,
    userId: 2,
    userName: "Samantha Lee",
    action: "Updated User Role",
    ip: "172.16.254.1",
    location: "Kumasi, Ashanti Region, Ghana",
    device: "Firefox on Windows",
    timestamp: new Date("2023-11-06T14:22:19"),
  },
  {
    id: 9,
    userId: 1,
    userName: "Alex Johnson",
    action: "Logout",
    ip: "192.168.1.105",
    location: "Accra, Greater Accra, Ghana",
    device: "Chrome on macOS",
    timestamp: new Date("2023-11-10T18:15:42"),
  },
  {
    id: 10,
    userId: 4,
    userName: "Emily Wilson",
    action: "Changed Settings",
    ip: "192.168.0.1",
    location: "Takoradi, Western Region, Ghana",
    device: "Safari on iOS",
    timestamp: new Date("2023-11-09T15:37:11"),
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [userLogs] = useState<UserLog[]>(mockUserLogs)
  
  // User list filters
  const [userFilters, setUserFilters] = useState<UserFilters>({
    searchQuery: "",
    roleFilter: "all",
    statusFilter: "all"
  })
  
  // Log filters
  const [logFilters, setLogFilters] = useState<LogFilters>({
    logSearchQuery: "",
    actionFilter: "all",
    dateFilter: "all",
    userFilter: "all"
  })

  const handleUserCreated = (newUser: User) => {
    setUsers(prev => [...prev, newUser])
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage system users, roles, and activity logs</p>
        </div>
      </div>

      {/* Stats Cards */}
      <UserStatsCards users={users} userLogs={userLogs} />
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="view">
            <IconUsers className="h-4 w-4 mr-2" />
            View Users
          </TabsTrigger>
          <TabsTrigger value="create">
            <IconPlus className="h-4 w-4 mr-2" />
            Create User
          </TabsTrigger>
          <TabsTrigger value="logs">
            <IconActivity className="h-4 w-4 mr-2" />
            User Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <UserList 
            users={users} 
            filters={userFilters}
            onFiltersChange={setUserFilters}
          />
        </TabsContent>
        
        <TabsContent value="create">
          <UserForm onUserCreated={handleUserCreated} />
        </TabsContent>
        
        <TabsContent value="logs">
          <UserLogs 
            users={users}
            userLogs={userLogs}
            filters={logFilters}
            onFiltersChange={setLogFilters}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 