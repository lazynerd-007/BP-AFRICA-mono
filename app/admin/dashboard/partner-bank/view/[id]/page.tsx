"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconArrowLeft, IconBuilding, IconCash, IconUsers, IconCalendar } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Define TypeScript interfaces for our data
interface MerchantData {
  id: string;
  name: string;
  date: string;
}

interface SettlementData {
  id: string;
  amount: string;
  date: string;
  status: string;
}

interface MerchantPayouts {
  daily: number;
  weekly: number;
  monthly: number;
}

interface PartnerBank {
  id: string;
  name: string;
  email: string;
  accountManager: string;
  commissionRatio: string;
  settlements: number;
  merchants: number;
  status: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  onboardingDate: string;
  lastSettlementDate: string;
  swiftCode: string;
  merchantPayouts: MerchantPayouts;
  recentMerchants: MerchantData[];
  recentSettlements: SettlementData[];
}

// Mock data for partner banks
const mockPartnerBanks = [
  {
    id: "1",
    name: "Ghana Commercial Bank",
    email: "gcb@example.com",
    accountManager: "John Mensah",
    commissionRatio: "0.05",
    settlements: 125,
    merchants: 48,
    status: "Active",
    contactPerson: "John Mensah",
    contactPhone: "+233 20 123 4567",
    address: "P.O. Box 134, High Street, Accra",
    onboardingDate: "2023-02-15",
    lastSettlementDate: "2025-06-15",
    swiftCode: "GHCBGHAC",
    merchantPayouts: {
      daily: 18,
      weekly: 126,
      monthly: 540
    },
    recentMerchants: [
      { id: "m1", name: "Chensha City Ghana Ltd", date: "2025-05-10" },
      { id: "m2", name: "BluWave Limited", date: "2025-05-05" },
      { id: "m3", name: "Timings Ltd", date: "2025-04-25" }
    ],
    recentSettlements: [
      { id: "s1", amount: "45,230.00", date: "2025-06-15", status: "Completed" },
      { id: "s2", amount: "38,750.00", date: "2025-06-10", status: "Completed" },
      { id: "s3", amount: "52,450.00", date: "2025-06-05", status: "Completed" }
    ]
  },
  {
    id: "2",
    name: "Ecobank Ghana",
    email: "ecobank@example.com",
    accountManager: "Sarah Asante",
    commissionRatio: "0.04",
    settlements: 98,
    merchants: 32,
    status: "Active",
    contactPerson: "Sarah Owusu",
    contactPhone: "+233 24 987 6543",
    address: "Independence Avenue, Accra",
    onboardingDate: "2023-04-10",
    lastSettlementDate: "2025-06-12",
    swiftCode: "ECOCGHAC",
    merchantPayouts: {
      daily: 12,
      weekly: 84,
      monthly: 360
    },
    recentMerchants: [
      { id: "m4", name: "Digital Plus", date: "2025-05-15" },
      { id: "m5", name: "Future Tech Ghana", date: "2025-05-01" },
      { id: "m6", name: "PayExpress Ghana", date: "2025-04-20" }
    ],
    recentSettlements: [
      { id: "s4", amount: "32,150.00", date: "2025-06-12", status: "Completed" },
      { id: "s5", amount: "28,750.00", date: "2025-06-07", status: "Completed" },
      { id: "s6", amount: "41,300.00", date: "2025-06-02", status: "Completed" }
    ]
  },
  {
    id: "3",
    name: "Stanbic Bank Ghana",
    email: "stanbic@example.com",
    accountManager: "Michael Osei",
    commissionRatio: "0.045",
    settlements: 112,
    merchants: 41,
    status: "Inactive",
    contactPerson: "Michael Amoah",
    contactPhone: "+233 55 765 4321",
    address: "Stanbic Heights, Airport City, Accra",
    onboardingDate: "2023-03-05",
    lastSettlementDate: "2025-05-30",
    swiftCode: "SBICGHAC",
    merchantPayouts: {
      daily: 14,
      weekly: 98,
      monthly: 420
    },
    recentMerchants: [
      { id: "m7", name: "QuickServe Ltd", date: "2025-05-12" },
      { id: "m8", name: "TechCity Electronics", date: "2025-04-28" },
      { id: "m9", name: "GreenWay Markets", date: "2025-04-15" }
    ],
    recentSettlements: [
      { id: "s7", amount: "39,850.00", date: "2025-05-30", status: "Completed" },
      { id: "s8", amount: "35,200.00", date: "2025-05-25", status: "Completed" },
      { id: "s9", amount: "42,750.00", date: "2025-05-20", status: "Completed" }
    ]
  },
  {
    id: "4",
    name: "Zenith Bank Ghana",
    email: "zenith@example.com",
    accountManager: "Rebecca Adjei",
    commissionRatio: "0.05",
    settlements: 87,
    merchants: 29,
    status: "Active",
    contactPerson: "Abena Kwarteng",
    contactPhone: "+233 26 543 2109",
    address: "Premier Towers, Liberia Road, Accra",
    onboardingDate: "2023-05-20",
    lastSettlementDate: "2025-06-14",
    swiftCode: "ZEBLGHAC",
    merchantPayouts: {
      daily: 10,
      weekly: 70,
      monthly: 300
    },
    recentMerchants: [
      { id: "m10", name: "Coastal Pharmacy", date: "2025-05-18" },
      { id: "m11", name: "Sunrise Supermarket", date: "2025-05-08" },
      { id: "m12", name: "Urban Lifestyle", date: "2025-04-30" }
    ],
    recentSettlements: [
      { id: "s10", amount: "28,500.00", date: "2025-06-14", status: "Completed" },
      { id: "s11", amount: "31,750.00", date: "2025-06-09", status: "Completed" },
      { id: "s12", amount: "26,300.00", date: "2025-06-04", status: "Completed" }
    ]
  },
  {
    id: "5",
    name: "Absa Bank Ghana",
    email: "absa@example.com",
    accountManager: "David Kwame",
    commissionRatio: "0.035",
    settlements: 76,
    merchants: 25,
    status: "Active",
    contactPerson: "Kofi Agyeman",
    contactPhone: "+233 50 321 0987",
    address: "Absa Heights, Accra",
    onboardingDate: "2023-07-12",
    lastSettlementDate: "2025-06-10",
    swiftCode: "ABSAGHAC",
    merchantPayouts: {
      daily: 8,
      weekly: 56,
      monthly: 240
    },
    recentMerchants: [
      { id: "m13", name: "Ghana Tech Solutions", date: "2025-05-20" },
      { id: "m14", name: "Accra Fresh Foods", date: "2025-05-10" },
      { id: "m15", name: "Golden Star Logistics", date: "2025-04-30" }
    ],
    recentSettlements: [
      { id: "s13", amount: "24,750.00", date: "2025-06-10", status: "Completed" },
      { id: "s14", amount: "26,300.00", date: "2025-06-05", status: "Completed" },
      { id: "s15", amount: "22,150.00", date: "2025-05-31", status: "Completed" }
    ]
  }
]

export default function PartnerBankDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [bank, setBank] = useState<PartnerBank | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // In a real app, you would fetch data from API
    const bankId = params.id as string
    const foundBank = mockPartnerBanks.find(b => b.id === bankId)
    
    if (foundBank) {
      setBank(foundBank as PartnerBank)
    }
    
    setLoading(false)
  }, [params.id])
  
  const handleGoBack = () => {
    router.back()
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading bank details...</p>
      </div>
    )
  }
  
  if (!bank) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <IconArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Partner Bank Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>The partner bank you are looking for does not exist or has been removed.</p>
          <Button className="mt-4" onClick={handleGoBack}>Go Back</Button>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleGoBack}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{bank.name}</h2>
          <p className="text-muted-foreground">Partner Bank Details</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              Bank Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                <p>{bank.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                <p>{bank.contactPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{bank.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Manager</p>
                <p>{bank.accountManager}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Swift Code</p>
                <p>{bank.swiftCode}</p>
              </div>
              <div className="col-span-1">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{bank.address}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Onboarding Date</p>
                <p>{new Date(bank.onboardingDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={bank.status === "Active" ? "secondary" : "outline"}>
                  {bank.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Commission Rate</p>
                <p>{parseFloat(bank.commissionRatio) * 100}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Settlement</p>
                <p>{new Date(bank.lastSettlementDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCash className="h-5 w-5" />
              Transaction Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded p-3">
                <p className="text-sm font-medium text-muted-foreground">Daily Payouts</p>
                <p className="text-2xl font-bold">{bank.merchantPayouts.daily}</p>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <p className="text-sm font-medium text-muted-foreground">Weekly Payouts</p>
                <p className="text-2xl font-bold">{bank.merchantPayouts.weekly}</p>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <p className="text-sm font-medium text-muted-foreground">Monthly Payouts</p>
                <p className="text-2xl font-bold">{bank.merchantPayouts.monthly}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded p-3">
                <p className="text-sm font-medium text-muted-foreground">Total Settlements</p>
                <p className="text-2xl font-bold">{bank.settlements}</p>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <p className="text-sm font-medium text-muted-foreground">Total Merchants</p>
                <p className="text-2xl font-bold">{bank.merchants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUsers className="h-5 w-5" />
              Recent Merchants
            </CardTitle>
            <CardDescription>
              Recently onboarded merchants with this partner bank
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant Name</TableHead>
                  <TableHead className="text-right">Onboarding Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bank.recentMerchants.map((merchant: MerchantData) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.name}</TableCell>
                    <TableCell className="text-right">{new Date(merchant.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCalendar className="h-5 w-5" />
              Recent Settlements
            </CardTitle>
            <CardDescription>
              Most recent settlement transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount (GHS)</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bank.recentSettlements.map((settlement: SettlementData) => (
                  <TableRow key={settlement.id}>
                    <TableCell>{new Date(settlement.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{settlement.amount}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{settlement.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleGoBack}>
          Go Back
        </Button>
        <Button variant="default" onClick={() => router.push(`/admin/dashboard/partner-bank/create?id=${params.id}`)}>
          Edit Bank Details
        </Button>
      </div>
    </div>
  )
} 