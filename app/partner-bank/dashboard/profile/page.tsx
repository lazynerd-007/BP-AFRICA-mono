"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconBuildingBank,
  IconCamera,
  IconCheck,
  IconLock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define a schema for password change form
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

// Sample partner bank data
const partnerBankData = {
  id: "PB-12345",
  name: "First National Bank",
  email: "contact@firstnationalbank.com",
  phone: "+233 54 123 4567",
  address: "123 Banking Avenue, Accra, Ghana",
  logo: "/images/bank-logo-placeholder.png",
  website: "https://www.firstnationalbank.com",
  registrationDate: "2023-01-15",
  accountManager: "Sarah Johnson",
  accountManagerEmail: "sarah.johnson@blupay.com",
  accountManagerPhone: "+233 50 987 6543"
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("general");
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [logoUpdateSuccess, setLogoUpdateSuccess] = useState(false);
  
  // Initialize form
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  
  // Handle password form submission
  const onPasswordSubmit = async (values: PasswordFormValues) => {
    try {
      setIsUpdatingPassword(true);
      
      // In a real implementation, values would be sent to the API
      // For now, we're just simulating the password update
      console.log("Password update data:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form and show success message
      form.reset();
      setPasswordUpdateSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setPasswordUpdateSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  
  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Create a URL for the uploaded file
      const reader = new FileReader();
      reader.onload = (e) => {
        // Simulate upload delay
        setTimeout(() => {
          setUploadedLogo(e.target?.result as string);
          setIsUploading(false);
          setLogoUpdateSuccess(true);
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            setLogoUpdateSuccess(false);
          }, 5000);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your bank&apos;s profile and security settings
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="text-sm">General Information</TabsTrigger>
          <TabsTrigger value="security" className="text-sm">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconBuildingBank className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Bank Information</CardTitle>
                  <CardDescription>
                    View your bank details and contact information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="sm:w-1/3 flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage 
                      src={uploadedLogo || partnerBankData.logo} 
                      alt={partnerBankData.name} 
                    />
                    <AvatarFallback className="text-2xl">
                      {partnerBankData.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2 w-full max-w-xs">
                    <Label htmlFor="logo" className="block text-center mb-2">Bank Logo</Label>
                    <div className="relative">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById("logo")?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <IconUpload className="mr-2 h-4 w-4" />
                            Upload New Logo
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Recommended size: 512x512 pixels (PNG or JPG)
                      </p>
                    </div>
                    
                    {logoUpdateSuccess && (
                      <Alert className="bg-green-50 border-green-200 text-green-800 mt-4">
                        <IconCheck className="h-4 w-4 text-green-600" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>
                          Your bank logo has been updated successfully.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                
                <div className="md:w-2/3 space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-muted-foreground text-sm">Bank Name</Label>
                      <div className="font-medium">{partnerBankData.name}</div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-1.5">
                      <Label className="text-muted-foreground text-sm">Bank ID</Label>
                      <div className="font-medium">{partnerBankData.id}</div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-muted-foreground text-sm">Email Address</Label>
                        <div className="flex items-center gap-1.5">
                          <IconMail className="h-4 w-4 text-muted-foreground" />
                          <span>{partnerBankData.email}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label className="text-muted-foreground text-sm">Phone Number</Label>
                        <div className="flex items-center gap-1.5">
                          <IconPhone className="h-4 w-4 text-muted-foreground" />
                          <span>{partnerBankData.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-1.5">
                      <Label className="text-muted-foreground text-sm">Address</Label>
                      <div className="flex items-center gap-1.5">
                        <IconMapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{partnerBankData.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                To update your bank&apos;s general information (name, email, phone, address), 
                please contact your BluPay account manager.
              </p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconUser className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Account Manager</CardTitle>
                  <CardDescription>
                    Your dedicated BluPay representative
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">Name</Label>
                  <div className="font-medium">{partnerBankData.accountManager}</div>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">Email</Label>
                  <div className="flex items-center gap-1.5">
                    <IconMail className="h-4 w-4 text-muted-foreground" />
                    <span>{partnerBankData.accountManagerEmail}</span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">Phone</Label>
                  <div className="flex items-center gap-1.5">
                    <IconPhone className="h-4 w-4 text-muted-foreground" />
                    <span>{partnerBankData.accountManagerPhone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconLock className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {passwordUpdateSuccess && (
                <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
                  <IconCheck className="h-4 w-4 text-green-600" />
                  <AlertTitle>Password Updated</AlertTitle>
                  <AlertDescription>
                    Your password has been changed successfully.
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters and include uppercase, lowercase, 
                          number, and special character.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating Password...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconCamera className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p>
                Two-factor authentication adds an additional layer of security to your account by requiring 
                a verification code in addition to your password when you sign in.
              </p>
              
              <Button variant="outline">
                Enable Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 