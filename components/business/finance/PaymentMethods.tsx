"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  IconCreditCard, 
  IconPhone, 
  IconBuildingBank, 
  IconWallet,
  IconPlus,
  IconTrash,
  IconEdit,
  IconCheck,
  IconStar
} from "@tabler/icons-react"
import { PaymentMethod } from "./types"

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[]
  onAdd?: () => void
  onEdit?: (method: PaymentMethod) => void
  onDelete?: (method: PaymentMethod) => void
  onSetDefault?: (method: PaymentMethod) => void
  showActions?: boolean
  className?: string
}

export function PaymentMethods({
  paymentMethods,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  showActions = true,
  className
}: PaymentMethodsProps) {
  
  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'momo':
        return <IconPhone className="h-5 w-5" />
      case 'bank':
        return <IconBuildingBank className="h-5 w-5" />
      case 'card':
        return <IconCreditCard className="h-5 w-5" />
      case 'bluepay':
        return <IconWallet className="h-5 w-5" />
      default:
        return <IconCreditCard className="h-5 w-5" />
    }
  }

  const getMethodColor = (type: string) => {
    switch (type) {
      case 'momo':
        return 'text-blue-600 bg-blue-100'
      case 'bank':
        return 'text-green-600 bg-green-100'
      case 'card':
        return 'text-purple-600 bg-purple-100'
      case 'bluepay':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === 'active' ? 'default' : 'secondary'
  }

  const getStatusBadgeClasses = (status: string) => {
    if (status === 'active') {
      return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400"
    }
    return ""
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage your payment options
            </CardDescription>
          </div>
          {onAdd && showActions && (
            <Button onClick={onAdd}>
              <IconPlus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${getMethodColor(method.type)}`}>
                    {getMethodIcon(method.type)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{method.name}</span>
                      {method.isDefault && (
                        <Badge variant="outline" className="text-xs">
                          <IconStar className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {method.type.toUpperCase()} • 
                      {method.details.maskedNumber || method.details.accountNumber || method.details.phoneNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getStatusBadgeVariant(method.status)}
                    className={getStatusBadgeClasses(method.status)}
                  >
                    {method.status}
                  </Badge>
                  
                  {showActions && (
                    <div className="flex gap-1">
                      {!method.isDefault && onSetDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSetDefault(method)}
                          title="Set as default"
                        >
                          <IconCheck className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(method)}
                          title="Edit method"
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {onDelete && !method.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(method)}
                          title="Delete method"
                          className="text-destructive hover:text-destructive"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <IconCreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No payment methods</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a payment method to start processing transactions
            </p>
            {onAdd && (
              <Button onClick={onAdd}>
                <IconPlus className="h-4 w-4 mr-2" />
                Add Your First Method
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 