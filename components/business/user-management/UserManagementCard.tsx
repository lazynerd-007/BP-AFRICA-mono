"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconCalendar, 
  IconSettings, 
  IconShield,
  IconDots,
  IconEdit,
  IconTrash,
  IconLock
} from "@tabler/icons-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAccount } from "./types"

interface UserManagementCardProps {
  user: UserAccount
  onEdit?: (user: UserAccount) => void
  onDelete?: (user: UserAccount) => void
  onViewActivity?: (user: UserAccount) => void
  onManagePermissions?: (user: UserAccount) => void
  onToggleStatus?: (user: UserAccount) => void
  showActions?: boolean
  compact?: boolean
  className?: string
}

export function UserManagementCard({
  user,
  onEdit,
  onDelete,
  onViewActivity,
  onManagePermissions,
  onToggleStatus,
  showActions = true,
  compact = false,
  className
}: UserManagementCardProps) {
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      case 'suspended':
        return 'destructive'
      case 'pending':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getStatusBadgeClasses = (status: string) => {
    if (status === 'active') {
      return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400"
    }
    return ""
  }

  const getRoleBadgeVariant = (roleLevel: number) => {
    if (roleLevel >= 5) return 'destructive' // Admin levels
    if (roleLevel >= 3) return 'default' // Manager levels
    return 'outline' // Regular user levels
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (compact) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={getStatusBadgeVariant(user.status)}
                className={getStatusBadgeClasses(user.status)}
              >
                {user.status}
              </Badge>
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <IconDots className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <IconEdit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                    )}
                    {onManagePermissions && (
                      <DropdownMenuItem onClick={() => onManagePermissions(user)}>
                        <IconShield className="h-4 w-4 mr-2" />
                        Permissions
                      </DropdownMenuItem>
                    )}
                    {onViewActivity && (
                      <DropdownMenuItem onClick={() => onViewActivity(user)}>
                        <IconCalendar className="h-4 w-4 mr-2" />
                        View Activity
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {onToggleStatus && (
                      <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                        <IconLock className="h-4 w-4 mr-2" />
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(user)}
                        className="text-destructive"
                      >
                        <IconTrash className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{user.firstName} {user.lastName}</CardTitle>
              <CardDescription>{user.role.name}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={getRoleBadgeVariant(user.role.level)}
            >
              {user.role.name}
            </Badge>
            <Badge 
              variant={getStatusBadgeVariant(user.status)}
              className={getStatusBadgeClasses(user.status)}
            >
              {user.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <IconMail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-sm">
              <IconPhone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
          )}
          {user.department && (
            <div className="flex items-center gap-2 text-sm">
              <IconUser className="h-4 w-4 text-muted-foreground" />
              <span>{user.department}</span>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <IconCalendar className="h-3 w-3" />
            <span>Created: {user.createdAt.toLocaleDateString()}</span>
          </div>
          {user.lastLogin && (
            <div className="flex items-center gap-2">
              <IconCalendar className="h-3 w-3" />
              <span>Last login: {user.lastLogin.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                <IconEdit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {onManagePermissions && (
              <Button variant="outline" size="sm" onClick={() => onManagePermissions(user)}>
                <IconShield className="h-4 w-4 mr-1" />
                Permissions
              </Button>
            )}
            {showActions && (onViewActivity || onToggleStatus || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconSettings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {onViewActivity && (
                    <DropdownMenuItem onClick={() => onViewActivity(user)}>
                      <IconCalendar className="h-4 w-4 mr-2" />
                      View Activity
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onToggleStatus && (
                    <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                      <IconLock className="h-4 w-4 mr-2" />
                      {user.status === 'active' ? 'Suspend' : 'Activate'}
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(user)}
                      className="text-destructive"
                    >
                      <IconTrash className="h-4 w-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 