"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  IconShield,
  IconDeviceFloppy,
  IconEdit,
  IconBuildingStore,
} from "@tabler/icons-react";

export default function ProfilePage() {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingTwoFactor, setIsEditingTwoFactor] = useState(false);
  
  // Mock user data for display only
  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    businessName: "JD Enterprises",
  };

  // Mock business data for display only (read-only)
  const businessData = {
    businessName: "JD Enterprises",
    businessType: "Limited Company",
    registrationNumber: "RC-123456",
    taxId: "TIN-987654321",
    industry: "Retail",
    address: "123 Business Avenue, Lagos",
    website: "https://jdenterprises.com",
    establishedDate: "2020-01-15",
  };

  const handlePasswordEditToggle = () => {
    setIsEditingPassword(!isEditingPassword);
  };

  const handleTwoFactorEditToggle = () => {
    setIsEditingTwoFactor(!isEditingTwoFactor);
  };

  const handlePasswordSave = () => {
    // Handle password save logic here
    setIsEditingPassword(false);
  };

  const handleTwoFactorSave = () => {
    // Handle two-factor auth logic here
    setIsEditingTwoFactor(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account security settings
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto sm:mx-0">
            <AvatarImage src="/images/placeholder-avatar.png" alt="Profile" />
            <AvatarFallback className="text-lg sm:text-2xl">JD</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold">{userData.firstName} {userData.lastName}</h2>
            <p className="text-sm text-muted-foreground">{userData.businessName}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{userData.email}</p>
          </div>
        </div>
      </div>

      {/* Business Information - Read Only */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBuildingStore className="h-5 w-5" />
            Business Information
          </CardTitle>
          <CardDescription>
            Your business details (view only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input 
                id="businessName" 
                value={businessData.businessName} 
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Input 
                id="businessType" 
                value={businessData.businessType} 
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input 
                id="registrationNumber" 
                value={businessData.registrationNumber} 
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input 
                id="taxId" 
                value={businessData.taxId} 
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input 
                id="industry" 
                value={businessData.industry} 
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="establishedDate">Established Date</Label>
              <Input 
                id="establishedDate" 
                value={businessData.establishedDate} 
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Business Address</Label>
              <Input 
                id="address" 
                value={businessData.address} 
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                value={businessData.website} 
                disabled
                className="bg-muted"
              />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Business information is managed by administrators. Contact support if you need to update these details.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
          <CardTitle className="flex items-center gap-2">
            <IconShield className="h-5 w-5" />
                Change Password
          </CardTitle>
          <CardDescription>
                Update your account password
          </CardDescription>
            </div>
            <Button 
              variant={isEditingPassword ? "default" : "outline"} 
              onClick={isEditingPassword ? handlePasswordSave : handlePasswordEditToggle}
              className="flex items-center gap-2"
            >
              {isEditingPassword ? (
                <>
                  <IconDeviceFloppy className="h-4 w-4" />
                  Save Password
                </>
              ) : (
                <>
                  <IconEdit className="h-4 w-4" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" disabled={!isEditingPassword} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" disabled={!isEditingPassword} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" disabled={!isEditingPassword} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconShield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
            <Button 
              variant={isEditingTwoFactor ? "default" : "outline"} 
              onClick={isEditingTwoFactor ? handleTwoFactorSave : handleTwoFactorEditToggle}
              className="flex items-center gap-2"
            >
              {isEditingTwoFactor ? (
                <>
                  <IconDeviceFloppy className="h-4 w-4" />
                  Save Settings
                </>
              ) : (
                <>
                  <IconEdit className="h-4 w-4" />
                  Configure 2FA
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.
            </p>
            <Button variant={isEditingTwoFactor ? "default" : "outline"} disabled={!isEditingTwoFactor}>
              Enable Two-Factor Authentication
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Login Sessions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconShield className="h-5 w-5" />
            Login Sessions
          </CardTitle>
          <CardDescription>
            Manage your active login sessions across devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="rounded-md border p-4 mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-muted-foreground">Lagos, Nigeria • Chrome on Windows</p>
                  <p className="text-xs text-muted-foreground">Started: Today at 09:45 AM</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
