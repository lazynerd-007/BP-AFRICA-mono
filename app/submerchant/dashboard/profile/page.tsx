"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  IconUser, 
  IconLock, 
  IconShield, 
  IconBuilding,
  IconMail,
  IconPhone,
  IconCalendar,
  IconInfoCircle
} from "@tabler/icons-react";

export default function SubmerchantProfilePage() {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Mock profile data
  const profileData = {
    id: "SUB-MER-001",
    businessName: "Quick Mart Store",
    ownerName: "John Doe",
    email: "john@quickmart.com",
    phone: "+233 24 123 4567",
    businessRegistration: "REG-2023-001",
    accountCreated: "2023-10-15",
    status: "Active",
    parentMerchant: {
      name: "BluWave Limited",
      id: "MERCHANT-001"
    },
    commissionRate: "2.5%"
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    
    // In a real app, this would make an API call
    console.log("Password change request");
    
    // Reset form and close modal
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setChangePasswordOpen(false);
    
    alert("Password changed successfully");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          View your submerchant account information and manage your password
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          As a submerchant, your business information is managed by your parent merchant. Only password changes are allowed.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              <CardTitle>Business Information</CardTitle>
            </div>
            <CardDescription>Your business details and registration information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Business Name</Label>
                <p className="text-lg font-semibold">{profileData.businessName}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Owner Name</Label>
                <p className="font-medium">{profileData.ownerName}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Business Registration</Label>
                <p className="font-mono text-sm">{profileData.businessRegistration}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Submerchant ID</Label>
                <p className="font-mono text-sm">{profileData.id}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                <div className="mt-1">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {profileData.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Account Created</Label>
                <div className="flex items-center gap-2 mt-1">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(profileData.accountCreated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconUser className="h-5 w-5" />
              <CardTitle>Contact Information</CardTitle>
            </div>
            <CardDescription>Your contact details (managed by parent merchant)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <IconMail className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.email}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                <div className="flex items-center gap-2 mt-1">
                  <IconPhone className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent Merchant Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              <CardTitle>Parent Merchant</CardTitle>
            </div>
            <CardDescription>Information about your parent merchant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Merchant Name</Label>
                <p className="text-lg font-semibold">{profileData.parentMerchant.name}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Merchant ID</Label>
                <p className="font-mono text-sm">{profileData.parentMerchant.id}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Commission Rate</Label>
                <p className="font-semibold text-lg">{profileData.commissionRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconShield className="h-5 w-5" />
                <div>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </div>
              </div>
              <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconLock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setChangePasswordOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handlePasswordChange}>
                      Change Password
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Security Information</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  Your account security is managed through your password. Transaction limits and other security settings are controlled by your parent merchant.
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  For questions about transaction limits or account restrictions, please contact your parent merchant: <strong>BluWave Limited</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 