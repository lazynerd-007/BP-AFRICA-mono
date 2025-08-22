"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconEdit, IconDeviceFloppy, IconX } from "@tabler/icons-react"
import { ChargeCardProps } from "./types"

export function ChargeCard({ 
  title, 
  icon, 
  charge, 
  chargeType, 
  isEditing, 
  onEdit, 
  onCancel, 
  onSave, 
  currency 
}: ChargeCardProps) {
  const [formData, setFormData] = useState({
    amount: charge.amount.toString(),
    percentage: charge.percentage.toString(),
    cap: charge.cap.toString(),
    chargeType: charge.chargeType,
    status: charge.status
  })

  const handleSubmit = () => {
    onSave(chargeType, {
      amount: parseFloat(formData.amount),
      percentage: parseFloat(formData.percentage),
      cap: parseFloat(formData.cap),
      chargeType: formData.chargeType,
      status: formData.status
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">
                  {charge.chargeType === "fixed" ? "Fixed Amount" : "Percentage"}
                </Label>
                <p className="text-lg font-semibold">
                  {charge.chargeType === "fixed" ? `${currency}${charge.amount.toFixed(2)}` : `${charge.percentage}%`}
                </p>
              </div>
              {charge.chargeType === "percentage" && (
                <div>
                  <Label className="text-sm text-muted-foreground">Cap Amount</Label>
                  <p className="text-lg font-semibold">{currency}{charge.cap.toFixed(2)}</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Charge Type</Label>
                <p className="text-sm font-medium capitalize">{charge.chargeType}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge variant={charge.status === "Active" ? "default" : "secondary"}>
                    {charge.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Last Updated</Label>
              <p className="text-sm">{charge.lastUpdated}</p>
            </div>
            
            <Button onClick={() => onEdit(chargeType)} className="w-full">
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Charge
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${chargeType}-chargeType`}>Charge Type</Label>
              <Select 
                value={formData.chargeType} 
                onValueChange={(value) => setFormData({...formData, chargeType: value as "fixed" | "percentage"})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount Only</SelectItem>
                  <SelectItem value="percentage">Percentage Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.chargeType === "fixed" && (
              <div className="space-y-2">
                <Label htmlFor={`${chargeType}-amount`}>Fixed Amount ({currency})</Label>
                <Input
                  id={`${chargeType}-amount`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            )}
            
            {formData.chargeType === "percentage" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor={`${chargeType}-percentage`}>Percentage (%)</Label>
                  <Input
                    id={`${chargeType}-percentage`}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.percentage}
                    onChange={(e) => setFormData({...formData, percentage: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${chargeType}-cap`}>Cap Amount ({currency})</Label>
                  <Input
                    id={`${chargeType}-cap`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cap}
                    onChange={(e) => setFormData({...formData, cap: e.target.value})}
                    placeholder="Maximum charge amount"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor={`${chargeType}-status`}>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value as "Active" | "Inactive"})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onCancel}>
                <IconX className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                <IconDeviceFloppy className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 