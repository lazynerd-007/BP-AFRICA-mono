"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback, Suspense } from "react"
import { toast } from "sonner"
import { IconArrowLeft, IconBuilding } from "@tabler/icons-react"

function CreatePartnerBankContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bankId = searchParams.get('id')
  const isEditMode = Boolean(bankId)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [formData, setFormData] = useState<{
    bankName: string;
    emailAddress: string;
    accountManager: string;
    settlementFileDR: File | null;
    settlementFileCR: File | null;
    settlementFrequency: string;
    settlementType: string;
    commissionRatio: string;
    settlementBankName: string;
    settlementAccountName: string;
    settlementAccountNumber: string;
    momoProvider: string;
    momoNumber: string;
    momoAccountName: string;
  }>({
    // Partner Bank Details
    bankName: "",
    emailAddress: "",
    accountManager: "",
    settlementFileDR: null,
    settlementFileCR: null,
    settlementFrequency: "",
    settlementType: "",
    commissionRatio: "",
    
    // Settlement Bank Details
    settlementBankName: "",
    settlementAccountName: "",
    settlementAccountNumber: "",
    
    // MOMO Settlement Details
    momoProvider: "",
    momoNumber: "",
    momoAccountName: "",
  })
  
  const loadPartnerBankData = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      
      // Mock partner bank data - in production, this would be an API call using id
      console.log("Loading partner bank data for ID:", id)
      const mockPartnerBankData = {
        bankName: "Ghana Commercial Bank",
        emailAddress: "gcb@example.com",
        accountManager: "John Mensah",
        settlementFileDR: null,
        settlementFileCR: null,
        settlementFrequency: "daily",
        settlementType: "bank",
        commissionRatio: "0.05",
        settlementBankName: "Ghana Commercial Bank",
        settlementAccountName: "GCB Settlement Account",
        settlementAccountNumber: "1234567890",
        momoProvider: "MTN Mobile Money",
        momoNumber: "0244123456",
        momoAccountName: "GCB MOMO",
      }
      
      // Set form values
      setFormData(mockPartnerBankData)
      
    } catch (error) {
      console.error("Error loading partner bank data:", error)
      toast.error("Failed to load partner bank data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load partner bank data when in edit mode
  useEffect(() => {
    if (isEditMode && bankId) {
      loadPartnerBankData(bankId)
    }
  }, [isEditMode, bankId, loadPartnerBankData])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [name]: e.target.files![0] }))
    }
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      if (isEditMode) {
        toast.success("Partner Bank updated successfully!")
        router.push(`/admin/dashboard/partner-bank/view/${bankId}`)
      } else {
        toast.success("Partner Bank created successfully!")
        resetForm()
        router.push("/admin/dashboard/partner-bank")
      }
      setIsSubmitting(false)
    }, 1500)
  }
  
  const resetForm = () => {
    setFormData({
      bankName: "",
      emailAddress: "",
      accountManager: "",
      settlementFileDR: null,
      settlementFileCR: null,
      settlementFrequency: "",
      settlementType: "",
      commissionRatio: "",
      settlementBankName: "",
      settlementAccountName: "",
      settlementAccountNumber: "",
      momoProvider: "",
      momoNumber: "",
      momoAccountName: "",
    })
    
    // Reset file inputs
    const fileInputDR = document.getElementById("settlementFileDR") as HTMLInputElement
    const fileInputCR = document.getElementById("settlementFileCR") as HTMLInputElement
    if (fileInputDR) fileInputDR.value = ""
    if (fileInputCR) fileInputCR.value = ""
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading partner bank data...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-5xl mx-auto py-8 px-4">
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
                {isEditMode ? "Edit Partner Bank" : "Create New Partner Bank"}
              </h1>
              <p className="text-muted-foreground">
                {isEditMode 
                  ? "Update partner bank information and configuration"
                  : "Setup new partner bank with the appropriate information"
                }
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              {/* Partner Bank Details Section */}
              <h3 className="text-lg font-medium mb-4">Partner Bank Details</h3>
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Partner Bank Name</Label>
                  <Input 
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <Input 
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountManager">Account Manager</Label>
                  <Input 
                    id="accountManager"
                    name="accountManager"
                    value={formData.accountManager}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commissionRatio">Commission Ratio</Label>
                  <Input 
                    id="commissionRatio"
                    name="commissionRatio"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.commissionRatio}
                    onChange={handleChange}
                    placeholder="e.g., 0.15 for 15%"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="settlementFrequency">Settlement Frequency</Label>
                  <Select value={formData.settlementFrequency} onValueChange={(value) => handleSelectChange("settlementFrequency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="settlementType">Settlement Type</Label>
                  <Select value={formData.settlementType} onValueChange={(value) => handleSelectChange("settlementType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Settlement</SelectItem>
                      <SelectItem value="momo">MOMO Settlement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Settlement Files Section */}
              <h3 className="text-lg font-medium mb-4">Settlement Files</h3>
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="settlementFileDR">Settlement File (DR - Debit)</Label>
                  <Input 
                    id="settlementFileDR"
                    name="settlementFileDR"
                    type="file"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    accept=".csv,.xlsx,.xls"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload debit settlement file (CSV, Excel)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="settlementFileCR">Settlement File (CR - Credit)</Label>
                  <Input 
                    id="settlementFileCR"
                    name="settlementFileCR"
                    type="file"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    accept=".csv,.xlsx,.xls"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload credit settlement file (CSV, Excel)
                  </p>
                </div>
              </div>
              
              {/* Settlement Bank Details Section */}
              <h3 className="text-lg font-medium mb-4">Settlement Bank Details</h3>
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="settlementBankName">Bank Name</Label>
                  <Input 
                    id="settlementBankName"
                    name="settlementBankName"
                    value={formData.settlementBankName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="settlementAccountName">Account Name</Label>
                  <Input 
                    id="settlementAccountName"
                    name="settlementAccountName"
                    value={formData.settlementAccountName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="settlementAccountNumber">Account Number</Label>
                  <Input 
                    id="settlementAccountNumber"
                    name="settlementAccountNumber"
                    value={formData.settlementAccountNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* MOMO Settlement Details Section */}
              <h3 className="text-lg font-medium mb-4">MOMO Settlement Details</h3>
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="momoProvider">MOMO Provider</Label>
                  <Select value={formData.momoProvider} onValueChange={(value) => handleSelectChange("momoProvider", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MTN Mobile Money">MTN Mobile Money</SelectItem>
                      <SelectItem value="Vodafone Cash">Vodafone Cash</SelectItem>
                      <SelectItem value="AirtelTigo Money">AirtelTigo Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="momoNumber">MOMO Number</Label>
                  <Input 
                    id="momoNumber"
                    name="momoNumber"
                    value={formData.momoNumber}
                    onChange={handleChange}
                    placeholder="e.g., 0244123456"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="momoAccountName">MOMO Account Name</Label>
                  <Input 
                    id="momoAccountName"
                    name="momoAccountName"
                    value={formData.momoAccountName}
                    onChange={handleChange}
                    placeholder="Account holder name"
                    required
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={isSubmitting} 
                  onClick={() => router.back()}
                  className="sm:order-1 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  {isSubmitting 
                    ? (isEditMode ? "Updating..." : "Creating...") 
                    : (isEditMode ? "Update Partner Bank" : "Create Partner Bank")
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CreatePartnerBank() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <CreatePartnerBankContent />
    </Suspense>
  )
}