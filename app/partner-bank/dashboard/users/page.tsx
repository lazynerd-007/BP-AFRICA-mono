"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconSearch,
  IconFilter,
  IconPlus,
  IconDots,
  IconUser,
  IconMail,
  IconPhone,
  IconCalendar,
  IconEdit,
  IconTrash,
  IconUserCheck,
  IconUserX,
} from "@tabler/icons-react";
import { format } from "date-fns";

// Sample data for users
const users = [
  {
    id: "U-001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+233 54 123 4567",
    role: "Admin",
    status: "Active",
    createdDate: "2023-01-15T10:30:00",
    lastLogin: "2023-10-15T14:30:00",
    createdBy: "System",
  },
  {
    id: "U-002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    phone: "+233 50 987 6543",
    role: "User",
    status: "Active",
    createdDate: "2023-02-10T09:15:00",
    lastLogin: "2023-10-14T11:15:00",
    createdBy: "John Doe",
  },
  {
    id: "U-003",
    firstName: "Michael",
    lastName: "Smith",
    email: "michael.smith@company.com",
    phone: "+233 55 456 7890",
    role: "User",
    status: "Inactive",
    createdDate: "2023-03-22T16:45:00",
    lastLogin: "2023-10-10T09:45:00",
    createdBy: "John Doe",
  },
  {
    id: "U-004",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma.wilson@company.com",
    phone: "+233 24 789 0123",
    role: "Admin",
    status: "Active",
    createdDate: "2023-04-05T14:20:00",
    lastLogin: "2023-10-15T16:20:00",
    createdBy: "John Doe",
  },
  {
    id: "U-005",
    firstName: "David",
    lastName: "Asante",
    email: "david.asante@company.com",
    phone: "+233 27 345 6789",
    role: "User",
    status: "Active",
    createdDate: "2023-05-18T11:10:00",
    lastLogin: "2023-10-13T10:05:00",
    createdBy: "Emma Wilson",
  },
];

interface CreateUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "Admin" | "User" | "";
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createUserForm, setCreateUserForm] = useState<CreateUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });
  const [usersList, setUsersList] = useState(users);
  
  // Filter users based on search and filters
  const filteredUsers = usersList.filter(user => {
    // Search filter
    const matchesSearch = 
      searchTerm === "" || 
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Role filter
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Status badge variant mapper
  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const statusMap: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      "Active": "default",
      "Inactive": "destructive"
    };
    
    return statusMap[status] || "secondary";
  };

  // Role badge variant mapper
  const getRoleVariant = (role: string): "default" | "destructive" | "outline" | "secondary" => {
    const roleMap: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      "Admin": "default",
      "User": "secondary"
    };
    
    return roleMap[role] || "outline";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  // Handle form input changes
  const handleFormChange = (field: keyof CreateUserForm, value: string) => {
    setCreateUserForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle create user
  const handleCreateUser = () => {
    if (createUserForm.firstName && createUserForm.lastName && createUserForm.email && createUserForm.role) {
      const newUser = {
        id: `U-${String(usersList.length + 1).padStart(3, '0')}`,
        firstName: createUserForm.firstName,
        lastName: createUserForm.lastName,
        email: createUserForm.email,
        phone: createUserForm.phone || "N/A",
        role: createUserForm.role as "Admin" | "User",
        status: "Active" as const,
        createdDate: new Date().toISOString(),
        lastLogin: "Never",
        createdBy: "Current User", // In real app, this would be the logged-in user
      };

      setUsersList(prev => [...prev, newUser]);
      setCreateUserForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
      });
      setShowCreateDialog(false);
    }
  };

  // Handle toggle user status
  const handleToggleStatus = (userId: string) => {
    setUsersList(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
        : user
    ));
  };

  // Handle delete user
  const handleDeleteUser = (userId: string) => {
    setUsersList(prev => prev.filter(user => user.id !== userId));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system with the appropriate role and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={createUserForm.firstName}
                    onChange={(e) => handleFormChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={createUserForm.lastName}
                    onChange={(e) => handleFormChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={createUserForm.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={createUserForm.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={createUserForm.role} onValueChange={(value) => handleFormChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <IconUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersList.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered users in system
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <IconUserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersList.filter(u => u.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <IconUserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersList.filter(u => u.role === "Admin").length}</div>
            <p className="text-xs text-muted-foreground">
              Users with admin privileges
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <IconUserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersList.filter(u => u.status === "Inactive").length}</div>
            <p className="text-xs text-muted-foreground">
              Users currently inactive
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle className="text-lg sm:text-xl">Users</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="relative">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-full sm:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto"
              >
                <IconFilter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="flex gap-4 mt-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">{user.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <IconMail className="w-4 h-4 mr-2 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <IconPhone className="w-4 h-4 mr-2 text-muted-foreground" />
                        {user.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <IconCalendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {formatDate(user.createdDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin === "Never" ? (
                        <span className="text-muted-foreground">Never</span>
                      ) : (
                        formatDateTime(user.lastLogin)
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <IconDots className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <IconEdit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                            {user.status === "Active" ? (
                              <>
                                <IconUserX className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <IconUserCheck className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <IconTrash className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 