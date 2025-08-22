"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  IconUser, 
  IconCreditCard, 
  IconSettings, 
  IconBuildingBank,
  IconDeviceMobile,
  IconPhone,
  IconWallet,
  IconCoins,
  IconUpload,
  IconUserCheck,
  IconArrowLeft
} from "@tabler/icons-react";
import { mockCharges } from "@/components/admin/charges/types";
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
  surchargeOn: z.string({ required_error: "Surcharge setting is required" }),
  partnerBankSplit: z.boolean().default(false),
  partnerBank: z.string({ required_error: "Partner bank is required" }),
  bdm: z.string().optional(),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required" }),
  organizationType: z.string({ required_error: "Organization type is required" }),
  merchantCategory: z.string({ required_error: "Merchant category is required" }),
  
  // Charge Configuration Type
  chargeConfigType: z.string({ required_error: "Charge configuration type is required" }),
  
  // Custom Surcharge Details (only required if custom is selected)
  totalSurcharge: z.string().optional(),
  merchantSurcharge: z.string().optional(),
  customerSurcharge: z.string().optional(),
  noSurchargeCap: z.boolean().default(false),
  
  // Custom Charge Fields for all charge types
  customWalletToWalletAmount: z.string().optional(),
  customWalletToWalletPercentage: z.string().optional(),
  customWalletToWalletCap: z.string().optional(),
  customWalletToWalletType: z.string().optional(),
  
  customMomoSettlementAmount: z.string().optional(),
  customMomoSettlementPercentage: z.string().optional(),
  customMomoSettlementCap: z.string().optional(),
  customMomoSettlementType: z.string().optional(),
  
  customBankSettlementAmount: z.string().optional(),
  customBankSettlementPercentage: z.string().optional(),
  customBankSettlementCap: z.string().optional(),
  customBankSettlementType: z.string().optional(),
  
  customMomoPayoutAmount: z.string().optional(),
  customMomoPayoutPercentage: z.string().optional(),
  customMomoPayoutCap: z.string().optional(),
  customMomoPayoutType: z.string().optional(),
  
  customBankPayoutAmount: z.string().optional(),
  customBankPayoutPercentage: z.string().optional(),
  customBankPayoutCap: z.string().optional(),
  customBankPayoutType: z.string().optional(),
  
  customBankCollectionAmount: z.string().optional(),
  customBankCollectionPercentage: z.string().optional(),
  customBankCollectionCap: z.string().optional(),
  customBankCollectionType: z.string().optional(),
  
  customMomoCollectionAmount: z.string().optional(),
  customMomoCollectionPercentage: z.string().optional(),
  customMomoCollectionCap: z.string().optional(),
  customMomoCollectionType: z.string().optional(),
  
  // OVA Settings
  mtn: z.string().optional(),
  airtel: z.string().optional(),
  telecel: z.string().optional(),
  
  // KYC Information
  ssnNumber: z.string().optional(),
  ghanaIdNumber: z.string().min(1, { message: "Ghana ID number is required" }),
  frontIdCard: z.any().optional(), // File upload
  backIdCard: z.any().optional(), // File upload
  profileImage: z.any().optional(), // File upload
  signature: z.any().optional(), // File upload
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  
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
).refine(
  (data) => {
    if (data.chargeConfigType === "custom") {
      return !!data.totalSurcharge && !!data.merchantSurcharge && !!data.customerSurcharge;
    }
    return true;
  },
  {
    message: "Custom charge details are required when custom configuration is selected",
    path: ["totalSurcharge"],
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
  const [chargeConfigType, setChargeConfigType] = useState<string>("");
  const { currency } = useCurrency();

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
      surchargeOn: "",
      partnerBankSplit: false,
      partnerBank: "",
      bdm: "",
      phoneNumber: "",
      organizationType: "",
      merchantCategory: "",
      chargeConfigType: "",
      totalSurcharge: "1.5",
      merchantSurcharge: "0",
      customerSurcharge: "0",
      noSurchargeCap: false,
      
      // Custom charge defaults
      customWalletToWalletAmount: "",
      customWalletToWalletPercentage: "",
      customWalletToWalletCap: "",
      customWalletToWalletType: "fixed",
      
      customMomoSettlementAmount: "",
      customMomoSettlementPercentage: "",
      customMomoSettlementCap: "",
      customMomoSettlementType: "percentage",
      
      customBankSettlementAmount: "",
      customBankSettlementPercentage: "",
      customBankSettlementCap: "",
      customBankSettlementType: "percentage",
      
      customMomoPayoutAmount: "",
      customMomoPayoutPercentage: "",
      customMomoPayoutCap: "",
      customMomoPayoutType: "percentage",
      
      customBankPayoutAmount: "",
      customBankPayoutPercentage: "",
      customBankPayoutCap: "",
      customBankPayoutType: "percentage",
      
      customBankCollectionAmount: "",
      customBankCollectionPercentage: "",
      customBankCollectionCap: "",
      customBankCollectionType: "percentage",
      
      customMomoCollectionAmount: "",
      customMomoCollectionPercentage: "",
      customMomoCollectionCap: "",
      customMomoCollectionType: "percentage",
      mtn: "",
      airtel: "",
      telecel: "",
      
      // KYC defaults
      ssnNumber: "",
      ghanaIdNumber: "",
      frontIdCard: null,
      backIdCard: null,
      profileImage: null,
      signature: null,
      dateOfBirth: "",
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
        surchargeOn: "merchant",
        partnerBankSplit: false,
        partnerBank: "gcb",
        bdm: "john_asante",
        phoneNumber: "+233 55 123 4567",
        organizationType: "business",
        merchantCategory: "services",
        chargeConfigType: "default",
        totalSurcharge: "2.5",
        merchantSurcharge: "1.5",
        customerSurcharge: "1.0",
        noSurchargeCap: false,
        mtn: "mtn_ova_001",
        airtel: "airtel_ova_001",
        telecel: "telecel_ova_001",
        ssnNumber: "",
        ghanaIdNumber: "GHA-123456789-0",
        dateOfBirth: "1990-01-01",
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
      setChargeConfigType(mockMerchantData.chargeConfigType);
      
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
    
    // If default charges are selected, include the default charges in the submission
    const submissionData = {
      ...values,
      ...(values.chargeConfigType === "default" && {
        defaultCharges: mockCharges
      })
    };
    
    // Simulate API call
    setTimeout(() => {
      console.log(submissionData);
      
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
              <IconUser className="h-3 w-3 mr-1" />
              User Account
            </Badge>
            <Badge variant="outline" className="text-xs">
              <IconCreditCard className="h-3 w-3 mr-1" />
              Payment Config
            </Badge>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
              
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Business Information */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconBuilding className="h-5 w-5" />
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
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconUser className="h-5 w-5" />
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

                {/* Settlement Configuration */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconCreditCard className="h-5 w-5" />
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
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconPhone className="h-5 w-5" />
                      OVA Configuration
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Select OVA accounts for mobile money providers
                    </p>
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

                            {/* Right Column - Configuration */}
              <div className="space-y-6">
                
                {/* KYC Information */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconUserCheck className="h-5 w-5" />
                      KYC Information
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Know Your Customer verification documents and details
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ssnNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">SSN Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Social Security Number (Optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ghanaIdNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Ghana ID Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="GHA-123456789-0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Date of Birth *</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              className="block w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="frontIdCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Front Page of ID Card</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <IconUpload className="w-8 h-8 mb-2 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> front of ID
                                  </p>
                                  <p className="text-xs text-muted-foreground">PNG, JPG or PDF</p>
                                </div>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*,application/pdf"
                                  onChange={(e) => field.onChange(e.target.files?.[0])}
                                />
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="backIdCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Back Page of ID Card</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <IconUpload className="w-8 h-8 mb-2 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> back of ID
                                  </p>
                                  <p className="text-xs text-muted-foreground">PNG, JPG or PDF</p>
                                </div>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*,application/pdf"
                                  onChange={(e) => field.onChange(e.target.files?.[0])}
                                />
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="profileImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Profile Image</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <IconUpload className="w-8 h-8 mb-2 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> profile image
                                  </p>
                                  <p className="text-xs text-muted-foreground">PNG, JPG (Max 5MB)</p>
                                </div>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => field.onChange(e.target.files?.[0])}
                                />
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="signature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Signature</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <IconUpload className="w-8 h-8 mb-2 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> signature
                                  </p>
                                  <p className="text-xs text-muted-foreground">PNG, JPG or PDF</p>
                                </div>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*,application/pdf"
                                  onChange={(e) => field.onChange(e.target.files?.[0])}
                                />
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Additional Settings */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Additional Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="bdm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Business Development Manager</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select BDM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="john_asante">John Asante</SelectItem>
                              <SelectItem value="sarah_mensah">Sarah Mensah</SelectItem>
                              <SelectItem value="michael_osei">Michael Osei</SelectItem>
                              <SelectItem value="rebecca_adjei">Rebecca Adjei</SelectItem>
                              <SelectItem value="david_kwame">David Kwame</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Charges Configuration - Full Width Bottom Section */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <IconSettings className="h-6 w-6" />
                  Charges Configuration
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Configure transaction charges for this merchant - use default system charges or set custom rates
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Charge Configuration Type Selection */}
                <div className="max-w-md">
                  <FormField
                    control={form.control}
                    name="chargeConfigType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Charge Configuration</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          setChargeConfigType(value);
                        }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select configuration type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="default">
                              <div className="flex items-center gap-2">
                                <IconSettings className="h-4 w-4" />
                                Use Default Charges
                              </div>
                            </SelectItem>
                            <SelectItem value="custom">
                              <div className="flex items-center gap-2">
                                <IconWallet className="h-4 w-4" />
                                Custom Charges
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Default Charges Display */}
                {chargeConfigType === "default" && (
                  <div className="space-y-6">
                    <div className="p-6 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
                        <IconSettings className="h-5 w-5" />
                        Applied Default Charges
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(mockCharges).map(([key, charge]) => (
                          <div key={key} className="p-4 bg-background rounded-lg border shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              {key.includes('wallet') && <IconWallet className="h-5 w-5 text-blue-600" />}
                              {key.includes('momo') && !key.includes('Collection') && <IconDeviceMobile className="h-5 w-5 text-green-600" />}
                              {key.includes('bank') && !key.includes('Collection') && <IconBuildingBank className="h-5 w-5 text-purple-600" />}
                              {key.includes('Collection') && key.includes('momo') && <IconCoins className="h-5 w-5 text-orange-600" />}
                              {key.includes('Collection') && key.includes('bank') && <IconCoins className="h-5 w-5 text-red-600" />}
                              <span className="font-medium text-sm">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Type</span>
                                <Badge variant="secondary" className="text-xs">
                                  {charge.chargeType}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Rate</span>
                                <span className="font-medium text-sm">
                                  {charge.chargeType === "fixed" 
                                    ? `${currency}${charge.amount.toFixed(2)}` 
                                    : `${charge.percentage}%`}
                                </span>
                              </div>
                              {charge.chargeType === "percentage" && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-muted-foreground">Cap</span>
                                  <span className="text-sm font-medium">{currency}{charge.cap.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Status</span>
                                <Badge variant={charge.status === "Active" ? "default" : "secondary"} className="text-xs">
                                  {charge.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
                      <FormField
                        control={form.control}
                        name="surchargeOn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Surcharge Applied To</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="merchant">Merchant</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="partnerBankSplit"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-medium">Partner Bank Split</FormLabel>
                              <p className="text-xs text-muted-foreground">
                                Enable revenue sharing with partner bank
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Custom Charges Form */}
                {chargeConfigType === "custom" && (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
                      <FormField
                        control={form.control}
                        name="surchargeOn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Surcharge Applied To</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="merchant">Merchant</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="partnerBankSplit"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-medium">Partner Bank Split</FormLabel>
                              <p className="text-xs text-muted-foreground">
                                Enable revenue sharing with partner bank
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Custom Charges Grid */}
                    <div className="space-y-6">
                      {Object.entries(mockCharges).map(([key, defaultCharge]) => {
                        const fieldPrefix = `custom${key.charAt(0).toUpperCase() + key.slice(1)}`;
                        const chargeTypeField = `${fieldPrefix}Type` as keyof z.infer<typeof formSchema>;
                        const currentChargeType = form.watch(chargeTypeField) || defaultCharge.chargeType;
                        
                        return (
                          <div key={key} className="p-6 bg-muted/30 rounded-lg border">
                            <div className="flex items-center gap-2 mb-4">
                              {key.includes('wallet') && <IconWallet className="h-5 w-5 text-blue-600" />}
                              {key.includes('momo') && !key.includes('Collection') && <IconDeviceMobile className="h-5 w-5 text-green-600" />}
                              {key.includes('bank') && !key.includes('Collection') && <IconBuildingBank className="h-5 w-5 text-purple-600" />}
                              {key.includes('Collection') && key.includes('momo') && <IconCoins className="h-5 w-5 text-orange-600" />}
                              {key.includes('Collection') && key.includes('bank') && <IconCoins className="h-5 w-5 text-red-600" />}
                              <h4 className="font-medium text-lg">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Charges
                              </h4>
                              <Badge variant="outline" className="text-xs ml-auto">
                                Default: {defaultCharge.chargeType === "fixed" 
                                  ? `${currency}${defaultCharge.amount.toFixed(2)}` 
                                  : `${defaultCharge.percentage}%`}
                              </Badge>
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-4">
                              <FormField
                                control={form.control}
                                name={chargeTypeField}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">Charge Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value || defaultCharge.chargeType}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                        <SelectItem value="percentage">Percentage</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {currentChargeType === "fixed" && (
                                <FormField
                                  control={form.control}
                                  name={`${fieldPrefix}Amount` as keyof z.infer<typeof formSchema>}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">Fixed Amount ({currency})</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          step="0.01" 
                                          placeholder={defaultCharge.amount.toString()} 
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                              
                              {currentChargeType === "percentage" && (
                                <>
                                  <FormField
                                    control={form.control}
                                    name={`${fieldPrefix}Percentage` as keyof z.infer<typeof formSchema>}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-sm font-medium">Percentage (%)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.01" 
                                            placeholder={defaultCharge.percentage.toString()} 
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name={`${fieldPrefix}Cap` as keyof z.infer<typeof formSchema>}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-sm font-medium">Cap Amount ({currency})</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.01" 
                                            placeholder={defaultCharge.cap.toString()} 
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                 
                  </div>
                )}
              </CardContent>
            </Card>

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