"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security settings</p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications from BluPay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive transaction updates via email</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifications" className="font-medium">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive transaction updates via SMS</p>
                </div>
                <Switch 
                  id="sms-notifications" 
                  checked={smsNotifications} 
                  onCheckedChange={setSmsNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="security-alerts" className="font-medium">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts for suspicious activities</p>
                </div>
                <Switch 
                  id="security-alerts" 
                  checked={securityAlerts} 
                  onCheckedChange={setSecurityAlerts} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails" className="font-medium">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                </div>
                <Switch 
                  id="marketing-emails" 
                  checked={marketingEmails} 
                  onCheckedChange={setMarketingEmails} 
                />
              </div>
              
              <Button className="mt-4">Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor-auth" className="font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require a verification code when logging in</p>
                </div>
                <Switch 
                  id="two-factor-auth" 
                  checked={twoFactorAuth} 
                  onCheckedChange={setTwoFactorAuth} 
                />
              </div>
              
              <div>
                <Label htmlFor="session-timeout" className="font-medium">Session Timeout (minutes)</Label>
                <p className="text-sm text-muted-foreground mb-2">Automatically log out after period of inactivity</p>
                <select
                  id="session-timeout"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
              
              <div className="pt-4">
                <Button className="w-full">Change Password</Button>
              </div>
              
              <Button className="mt-4">Save Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize your account display settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language" className="font-medium">Language</Label>
                  <select
                    id="language"
                    className="w-full p-2 border rounded-md mt-2"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="timezone" className="font-medium">Time Zone</Label>
                  <select
                    id="timezone"
                    className="w-full p-2 border rounded-md mt-2"
                  >
                    <option value="UTC+0">UTC+0 (London, Lisbon)</option>
                    <option value="UTC+1">UTC+1 (Paris, Berlin)</option>
                    <option value="UTC-5">UTC-5 (New York, Toronto)</option>
                    <option value="UTC+1">UTC+1 (West Africa Time)</option>
                    <option value="UTC+3">UTC+3 (East Africa Time)</option>
                  </select>
                </div>
                
                <Button className="mt-4">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
