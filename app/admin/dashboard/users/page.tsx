"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconUsers, IconPlus } from "@tabler/icons-react"
import { 
  UserStatsCards, 
  UserList, 
  UserForm,
  User, 
  UserFilters
} from "@/components/admin/users"

// Mock data for users
const mockUsers: User[] = [
  {
    id: 1,
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "+233 20 123 4567",
    role: "Super Administrator",
    status: "active",
    lastLogin: new Date("2023-11-10T14:32:18"),
    createdAt: new Date("2023-06-14T09:21:43"),
  },
  {
    id: 2,
    firstName: "Samantha",
    lastName: "Lee",
    email: "samantha.lee@example.com",
    phone: "+233 24 987 6543",
    role: "Administrator",
    status: "active",
    lastLogin: new Date("2023-11-09T11:15:27"),
    createdAt: new Date("2023-07-21T13:42:11"),
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@example.com",
    phone: "+233 26 555 1234",
    role: "Financial Administrator",
    status: "inactive",
    lastLogin: new Date("2023-10-28T09:54:06"),
    createdAt: new Date("2023-08-05T16:30:55"),
  },
  {
    id: 4,
    firstName: "Emily",
    lastName: "Wilson",
    email: "emily.wilson@example.com",
    phone: "+233 27 789 0123",
    role: "Manager",
    status: "active",
    lastLogin: new Date("2023-11-10T10:12:33"),
    createdAt: new Date("2023-09-12T08:22:41"),
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Rodriguez",
    email: "david.rodriguez@example.com",
    phone: "+233 50 456 7890",
    role: "Financial Administrator",
    status: "active",
    lastLogin: new Date("2023-11-07T16:48:22"),
    createdAt: new Date("2023-09-27T11:35:19"),
  },
]



export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  
  // User list filters
  const [userFilters, setUserFilters] = useState<UserFilters>({
    searchQuery: "",
    roleFilter: "all",
    statusFilter: "all"
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
      <UserStatsCards users={users} />
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="view">
            <IconUsers className="h-4 w-4 mr-2" />
            View Users
          </TabsTrigger>
          <TabsTrigger value="create">
            <IconPlus className="h-4 w-4 mr-2" />
            Create User
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
      </Tabs>
    </div>
  )
}