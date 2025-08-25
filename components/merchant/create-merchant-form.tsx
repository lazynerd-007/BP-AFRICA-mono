"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  IconBuilding, 
  IconBuildingBank,
  IconDeviceMobile,
  IconArrowLeft
} from "@tabler/icons-react";
import { useCurrency } from "@/lib/currency-context";

const formSchema = z.object({
  // Merchant Details
  merchantCode: z.string().min(1, { message: "Merchant code is required" }),
  merchantName: z.string().min(3, { message: "Merchant name is required" }),
  merchantAddress: z.string().min(5, { message: "Address is required" }),
  notificationEmail: z.string().email({ message: "Valid email is required" }),
  country: z.string({ required_error: "Country is required" }),
  tinNumber: z.string().optional(),
  settlementFrequency: z.string({ required_error: "Settlement frequency is required" }),
  partnerBank: z.string({ required_error: "Partner bank is required" }),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required" }),
  organizationType: z.string({ required_error: "Organization type is required" }),
  merchantCategory: z.string({ required_error: "Merchant category is required" }),
  
  // OVA Settings
  mtn: z.string().optional(),
  airtel: z.string().optional(),
  telecel: z.string().optional(),
  
  // User Details
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  
  // Settlement Details
  settlementType: z.string({ required_error: "Settlement type is required" }),
  // Bank Settlement fields
  merchantBank: z.string().optional(),
  branch: z.string().optional(),
  accountType: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  // MOMO Settlement fields
  momoProvider: z.string().optional(),
  momoNumber: z.string().optional(),
  momoAccountName: z.string().optional(),
}).refine(
  (data) => {
    if (data.settlementType === "bank") {
      return !!data.merchantBank && !!data.branch && !!data.accountType && !!data.accountNumber && !!data.accountName;
    }
    if (data.settlementType === "momo") {
      return !!data.momoProvider && !!data.momoNumber && !!data.momoAccountName;
    }
    return true;
  },
  {
    message: "Settlement details are required based on selected settlement type",
    path: ["settlementType"],
  }
);

export function CreateMerchant() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const merchantId = searchParams.get('id');
  const isEditMode = Boolean(merchantId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [settlementType, setSettlementType] = useState<string>("");

  useCurrency();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchantCode: "",
      merchantName: "",
      merchantAddress: "",
      notificationEmail: "",
      country: "",
      tinNumber: "",
      settlementFrequency: "",
      partnerBank: "",
      phoneNumber: "",
      organizationType: "",
      merchantCategory: "",
      mtn: "",
      airtel: "",
      telecel: "",
      firstName: "",
      lastName: "",
      email: "",
      settlementType: "",
      merchantBank: "",
      branch: "",
      accountType: "",
      accountNumber: "",
      accountName: "",
      momoProvider: "",
      momoNumber: "",
      momoAccountName: "",
    },
  });

  const loadMerchantData = useCallback(async (merchantId: string) => {
    try {
      setIsLoading(true);
      
      // Mock merchant data - in production, this would be an API call using merchantId
      console.log("Loading merchant data for ID:", merchantId);
      const mockMerchantData = {
        merchantCode: "BLUPAY1000",
        merchantName: "Banco Limited",
        merchantAddress: "123 Main Street, Accra, Ghana",
        notificationEmail: "info@bancolimited.com",
        country: "ghana",
        tinNumber: "TAX8765432",
        settlementFrequency: "daily",
        partnerBank: "gcb",
        phoneNumber: "+233 55 123 4567",
        organizationType: "business",
        merchantCategory: "services",
        mtn: "mtn_ova_001",
        airtel: "airtel_ova_001",
        telecel: "telecel_ova_001",
        firstName: "John",
        lastName: "Doe",
        email: "john@bancolimited.com",
        settlementType: "bank",
        merchantBank: "gcb",
        branch: "Accra Main Branch",
        accountType: "current",
        accountNumber: "1234567890",
        accountName: "Banco Limited",
        momoProvider: "mtn",
        momoNumber: "024 123 4567",
        momoAccountName: "John Doe",
      };
      
      // Set form values
      form.reset(mockMerchantData);
      setSettlementType(mockMerchantData.settlementType);
      
    } catch (error) {
      console.error("Error loading merchant data:", error);
      toast.error("Failed to load merchant data");
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  // Load merchant data when in edit mode
  useEffect(() => {
    if (isEditMode && merchantId) {
      loadMerchantData(merchantId);
    }
  }, [isEditMode, merchantId, loadMerchantData]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      
      if (isEditMode) {
        toast.success("Merchant updated successfully");
        router.push(`/admin/dashboard/merchant/${merchantId}`);
      } else {
        toast.success("Merchant created successfully");
        // Reset form only on create
        form.reset();
        router.push("/admin/dashboard/merchant");
      }
      
      setIsSubmitting(false);
    }, 1500);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading merchant data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {isEditMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="mr-2"
              >
                <IconArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconBuilding className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isEditMode ? "Edit Merchant" : "Create New Merchant"}
              </h1>
              <p className="text-muted-foreground">
                {isEditMode 
                  ? "Update merchant account information and configuration"
                  : "Set up a new BluPay merchant account with complete configuration"
                }
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline" className="text-xs">
              <IconBuilding className="h-3 w-3 mr-1" />
              Merchant Setup
            </Badge>
            <Badge variant="outline" className="text-xs">
              User Account
            </Badge>
            <Badge variant="outline" className="text-xs">
              Payment Config
            </Badge>
          </div>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              
              {/* Left Column - Business Information */}
            <div className="space-y-8">
                {/* Business Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Business Information
                  </CardTitle>
                </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="merchantCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Merchant Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter merchant code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="merchantName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Business Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter business name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="merchantAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Business Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter complete business address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="organizationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Organization Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select organization type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="individual">Individual</SelectItem>
                                <SelectItem value="ngo">NGO</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="merchantCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Business Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select business category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="food">Food & Beverage</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="services">Services</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ghana">Ghana</SelectItem>
                                <SelectItem value="nigeria">Nigeria</SelectItem>
                                <SelectItem value="kenya">Kenya</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tinNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">TIN Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Tax identification number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Business phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Admin User Setup */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Admin User Setup
                  </CardTitle>
                </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Admin first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Admin last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notificationEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Notification Email</FormLabel>
                          <FormControl>
                            <Input placeholder="notifications@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Configuration */}
            <div className="space-y-8">

                {/* Settlement Configuration */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Settlement Configuration
                  </CardTitle>
                </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="settlementFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Settlement Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="partnerBank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Partner Bank</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select partner bank" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="gcb">GCB Bank</SelectItem>
                                <SelectItem value="ecobank">Ecobank</SelectItem>
                                <SelectItem value="absa">Absa Bank</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="settlementType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Settlement Method</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            setSettlementType(value);
                          }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select settlement method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bank">
                                <div className="flex items-center gap-2">
                                  <IconBuildingBank className="h-4 w-4" />
                                  Bank Transfer
                                </div>
                              </SelectItem>
                              <SelectItem value="momo">
                                <div className="flex items-center gap-2">
                                  <IconDeviceMobile className="h-4 w-4" />
                                  Mobile Money
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bank Settlement Details */}
                    {settlementType === "bank" && (
                      <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <IconBuildingBank className="h-4 w-4" />
                          Bank Account Details
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="merchantBank"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Bank Name</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select bank" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="gcb">GCB Bank</SelectItem>
                                    <SelectItem value="ecobank">Ecobank</SelectItem>
                                    <SelectItem value="absa">Absa Bank</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="branch"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Branch</FormLabel>
                                <FormControl>
                                  <Input placeholder="Bank branch" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-3">
                          <FormField
                            control={form.control}
                            name="accountType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Account Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="current">Current</SelectItem>
                                    <SelectItem value="savings">Savings</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Account Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Account number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="accountName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Account Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Account holder name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* MOMO Settlement Details */}
                    {settlementType === "momo" && (
                      <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <IconDeviceMobile className="h-4 w-4" />
                          Mobile Money Details
                        </h4>
                        <div className="grid gap-4 md:grid-cols-3">
                          <FormField
                            control={form.control}
                            name="momoProvider"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Provider</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select provider" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="mtn">MTN MoMo</SelectItem>
                                    <SelectItem value="airtel">AirtelTigo Money</SelectItem>
                                    <SelectItem value="telecel">Telecel Cash</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="momoNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Mobile Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="0244123456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="momoAccountName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Account Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Account holder name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* OVA Configuration */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    OVA Configuration
                  </CardTitle>
                </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="mtn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">MTN OVA</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mtn_ova_001">EGANOW</SelectItem>
                                <SelectItem value="mtn_ova_002">BLUPAY</SelectItem>
                               
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="airtel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">AirtelTigo OVA</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select " />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="airtel_ova_001">AIRTEL BLUPAY</SelectItem>
                              
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="telecel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Telecel OVA</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select " />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="telecel_ova_001">BLUPAY3</SelectItem>
                              
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>



            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Please review all information before {isEditMode ? "updating" : "creating"} the merchant account.
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={isSubmitting} 
                  onClick={() => router.back()}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[140px]"
                >
                  {isSubmitting 
                    ? (isEditMode ? "Updating..." : "Creating...") 
                    : (isEditMode ? "Update Merchant" : "Create Merchant")
                  }
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}