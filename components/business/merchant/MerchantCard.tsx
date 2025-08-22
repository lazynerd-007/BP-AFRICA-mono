"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  IconBuildingStore, 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconCalendar, 
  IconSettings, 
  IconEye,
  IconDots,
  IconEdit,
  IconUserPlus,
  IconBan,
  IconCheck
} from "@tabler/icons-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MerchantData } from "./types"

interface MerchantCardProps {
  merchant: MerchantData
  onView?: (merchant: MerchantData) => void
  onEdit?: (merchant: MerchantData) => void
  onCreateSubMerchant?: (merchant: MerchantData) => void
  onToggleStatus?: (merchant: MerchantData) => void
  onManageSettings?: (merchant: MerchantData) => void
  showActions?: boolean
  compact?: boolean
  className?: string
}

export function MerchantCard({
  merchant,
  onView,
  onEdit,
  onCreateSubMerchant,
  onToggleStatus,
  onManageSettings,
  showActions = true,
  compact = false,
  className
}: MerchantCardProps) {
  
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

  const getKYCBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'pending':
        return 'outline'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getKYCBadgeClasses = (status: string) => {
    if (status === 'approved') {
      return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400"
    }
    return ""
  }

  if (compact) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={merchant.merchantName} />
                <AvatarFallback>
                  <IconBuildingStore className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{merchant.merchantName}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <span>{merchant.merchantCode}</span>
                  <span>•</span>
                  <span>{merchant.merchantCategory}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={getStatusBadgeVariant(merchant.status)}
                className={getStatusBadgeClasses(merchant.status)}
              >
                {merchant.status}
              </Badge>
              <Badge 
                variant={getKYCBadgeVariant(merchant.kyc.status)}
                className={getKYCBadgeClasses(merchant.kyc.status)}
              >
                KYC: {merchant.kyc.status}
              </Badge>
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <IconDots className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(merchant)}>
                        <IconEye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(merchant)}>
                        <IconEdit className="h-4 w-4 mr-2" />
                        Edit Merchant
                      </DropdownMenuItem>
                    )}
                    {onCreateSubMerchant && (
                      <DropdownMenuItem onClick={() => onCreateSubMerchant(merchant)}>
                        <IconUserPlus className="h-4 w-4 mr-2" />
                        Create Sub-Merchant
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {onToggleStatus && (
                      <DropdownMenuItem onClick={() => onToggleStatus(merchant)}>
                        {merchant.status === 'active' ? (
                          <>
                            <IconBan className="h-4 w-4 mr-2" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <IconCheck className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
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
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" alt={merchant.merchantName} />
              <AvatarFallback>
                <IconBuildingStore className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{merchant.merchantName}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>{merchant.merchantCode}</span>
                <span>•</span>
                <span>{merchant.merchantCategory}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={getStatusBadgeVariant(merchant.status)}
              className={getStatusBadgeClasses(merchant.status)}
            >
              {merchant.status}
            </Badge>
            <Badge 
              variant={getKYCBadgeVariant(merchant.kyc.status)}
              className={getKYCBadgeClasses(merchant.kyc.status)}
            >
              KYC: {merchant.kyc.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <IconMail className="h-4 w-4 text-muted-foreground" />
            <span>{merchant.notificationEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IconPhone className="h-4 w-4 text-muted-foreground" />
            <span>{merchant.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IconMapPin className="h-4 w-4 text-muted-foreground" />
            <span>{merchant.merchantAddress}</span>
          </div>
        </div>

        {/* Business Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Partner Bank:</span>
            <div className="font-medium">{merchant.partnerBank}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Settlement:</span>
            <div className="font-medium">{merchant.settlementFrequency}</div>
          </div>
        </div>

        {/* Sub-merchants count */}
        {merchant.subMerchants && merchant.subMerchants.length > 0 && (
          <div className="text-sm">
            <span className="text-muted-foreground">Sub-merchants:</span>
            <span className="font-medium ml-2">{merchant.subMerchants.length}</span>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <IconCalendar className="h-3 w-3" />
            <span>Created: {merchant.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(merchant)}>
                <IconEye className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(merchant)}>
                <IconEdit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {showActions && (onCreateSubMerchant || onToggleStatus || onManageSettings) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconSettings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {onCreateSubMerchant && (
                    <DropdownMenuItem onClick={() => onCreateSubMerchant(merchant)}>
                      <IconUserPlus className="h-4 w-4 mr-2" />
                      Create Sub-Merchant
                    </DropdownMenuItem>
                  )}
                  {onManageSettings && (
                    <DropdownMenuItem onClick={() => onManageSettings(merchant)}>
                      <IconSettings className="h-4 w-4 mr-2" />
                      Manage Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onToggleStatus && (
                    <DropdownMenuItem onClick={() => onToggleStatus(merchant)}>
                      {merchant.status === 'active' ? (
                        <>
                          <IconBan className="h-4 w-4 mr-2" />
                          Suspend Merchant
                        </>
                      ) : (
                        <>
                          <IconCheck className="h-4 w-4 mr-2" />
                          Activate Merchant
                        </>
                      )}
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