"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  IconSearch,
  IconFilter,
  IconDownload,
  IconEye,
  IconBuildingStore,
  IconPhone,
  IconMail,
  IconMapPin,
  IconBriefcase,
  IconCalendar,
} from "@tabler/icons-react";
import { format } from "date-fns";

// Sample data for merchants
const merchants = [
  {
    id: "M-12345",
    name: "BluWave Limited",
    businessType: "Retail",
    status: "Active",
    onboardDate: "2023-01-15",
    contactName: "John Doe",
    email: "contact@bluwave.com",
    phone: "+233 54 123 4567",
    address: "123 Main St, Accra, Ghana",
    transactionVolume: "GHS42,350,000.00",
    lastTransaction: "2023-10-15T14:30:00",
    commissionRate: "1.2%",
  },
  {
    id: "M-12346",
    name: "Chensha City Ghana Ltd",
    businessType: "E-commerce",
    status: "Active",
    onboardDate: "2023-02-10",
    contactName: "Sarah Johnson",
    email: "info@chenshacity.com",
    phone: "+233 50 987 6543",
    address: "456 Market Ave, Kumasi, Ghana",
    transactionVolume: "GHS38,750,000.00",
    lastTransaction: "2023-10-15T11:15:00",
    commissionRate: "1.3%",
  },
  {
    id: "M-12347",
    name: "Blu Penguin",
    businessType: "Technology",
    status: "Active",
    onboardDate: "2023-03-22",
    contactName: "Michael Smith",
    email: "hello@blupenguin.com",
    phone: "+233 55 456 7890",
    address: "789 Tech Lane, Accra, Ghana",
    transactionVolume: "GHS56,250,000.00",
    lastTransaction: "2023-10-14T09:45:00",
    commissionRate: "1.1%",
  },
  {
    id: "M-12348",
    name: "Timings Ltd",
    businessType: "Food & Beverage",
    status: "Inactive",
    onboardDate: "2023-04-05",
    contactName: "Emma Wilson",
    email: "support@timings.com",
    phone: "+233 24 789 0123",
    address: "101 Food Court, Takoradi, Ghana",
    transactionVolume: "GHS12,500,000.00",
    lastTransaction: "2023-10-14T16:20:00",
    commissionRate: "1.4%",
  },
  {
    id: "M-12349",
    name: "QuickServe Ltd",
    businessType: "Services",
    status: "Active",
    onboardDate: "2023-05-18",
    contactName: "David Asante",
    email: "info@quickserve.com",
    phone: "+233 27 345 6789",
    address: "222 Service Road, Tamale, Ghana",
    transactionVolume: "GHS28,950,000.00",
    lastTransaction: "2023-10-13T10:05:00",
    commissionRate: "1.2%",
  },
  {
    id: "M-12350",
    name: "GhanaTech Solutions",
    businessType: "Technology",
    status: "Active",
    onboardDate: "2023-06-30",
    contactName: "Samuel Boateng",
    email: "hello@ghanatech.com",
    phone: "+233 54 890 1234",
    address: "333 Tech Park, Accra, Ghana",
    transactionVolume: "GHS34,850,000.00",
    lastTransaction: "2023-10-13T13:45:00",
    commissionRate: "1.1%",
  },
];

// Business types for filtering
const businessTypes = [
  "Retail",
  "E-commerce",
  "Technology",
  "Food & Beverage",
  "Services",
  "Finance",
  "Healthcare",
  "Education",
  "Hospitality",
  "Transportation",
];

export default function MerchantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<typeof merchants[0] | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Filter merchants based on search and filters
  const filteredMerchants = merchants.filter(merchant => {
    // Search filter
    const matchesSearch = 
      searchTerm === "" || 
      merchant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || merchant.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Business type filter
    const matchesBusinessType = businessTypeFilter === "all" || merchant.businessType === businessTypeFilter;
    
    return matchesSearch && matchesStatus && matchesBusinessType;
  });

  // Status badge variant mapper
  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const statusMap: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      "Active": "default",
      "Inactive": "destructive"
    };
    
    return statusMap[status] || "secondary";
  };

  // Get badge classes based on status
  const getStatusClasses = (status: string): string => {
    if (status === "Active") {
      return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/20 dark:text-green-400";
    }
    return "";
  };

  // Format date string
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // Format datetime string
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy • h:mm a");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Connected Merchants</h1>
        <p className="text-sm text-muted-foreground">
          View and monitor all merchants connected to your bank
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <div>
              <CardTitle className="text-lg sm:text-xl">Merchant List</CardTitle>
              <CardDescription className="text-sm">
                All merchants that process payments through your bank
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search merchants..."
                  className="pl-8 w-full sm:w-[240px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-muted" : ""}
                >
                  <IconFilter className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" className="flex items-center gap-1 flex-1 sm:flex-none">
                  <IconDownload className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                  <span className="sm:hidden">Export</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 p-4 border rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Type</label>
                <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {businessTypes.map((type, index) => (
                      <SelectItem key={index} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-1 sm:col-span-2 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("all");
                    setBusinessTypeFilter("all");
                  }}
                  className="mr-2"
                >
                  Reset Filters
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Transaction Volume</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMerchants.length > 0 ? (
                filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.id}</TableCell>
                    <TableCell>{merchant.name}</TableCell>
                    <TableCell>{merchant.businessType}</TableCell>
                    <TableCell>{merchant.transactionVolume}</TableCell>
                    <TableCell>{merchant.commissionRate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(merchant.status)}
                        className={getStatusClasses(merchant.status)}
                      >
                        {merchant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedMerchant(merchant);
                          setShowDetailsDialog(true);
                          setActiveTab("overview");
                        }}
                        title="View Details"
                      >
                        <IconEye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No merchants found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {filteredMerchants.length > 0 ? (
              filteredMerchants.map((merchant) => (
                <Card key={merchant.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-sm">{merchant.id}</p>
                      <p className="text-xs text-muted-foreground">{merchant.businessType}</p>
                    </div>
                    <Badge 
                      variant={getStatusVariant(merchant.status)}
                      className={getStatusClasses(merchant.status)}
                    >
                      {merchant.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold">{merchant.name}</p>
                      <p className="text-sm text-muted-foreground">{merchant.transactionVolume}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Commission: {merchant.commissionRate}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedMerchant(merchant);
                          setShowDetailsDialog(true);
                          setActiveTab("overview");
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <IconEye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No merchants found.</p>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredMerchants.length}</strong> of <strong>{merchants.length}</strong> merchants
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="px-4">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Merchant Details Dialog */}
      {selectedMerchant && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <IconBuildingStore className="h-5 w-5 text-primary" />
                  <DialogTitle className="text-lg sm:text-xl">{selectedMerchant.name}</DialogTitle>
                </div>
                <DialogDescription className="text-sm">
                  {selectedMerchant.id} • {selectedMerchant.businessType}
                </DialogDescription>
              </div>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                <TabsTrigger value="contact" className="text-sm">Contact Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium">Status</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <Badge 
                        variant={getStatusVariant(selectedMerchant.status)}
                        className={getStatusClasses(selectedMerchant.status)}
                      >
                        {selectedMerchant.status}
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium">Onboarded On</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 flex items-center gap-2">
                      <IconCalendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(selectedMerchant.onboardDate)}</span>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium">Last Transaction</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      {formatDateTime(selectedMerchant.lastTransaction)}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="text-2xl font-bold">{selectedMerchant.transactionVolume}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="text-2xl font-bold">{selectedMerchant.commissionRate}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Note: Commission rates are set by BluPay administration
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                          <IconBriefcase className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedMerchant.contactName}</p>
                          <p className="text-sm text-muted-foreground">Primary Contact</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                          <IconMail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedMerchant.email}</p>
                          <p className="text-sm text-muted-foreground">Email Address</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                          <IconPhone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedMerchant.phone}</p>
                          <p className="text-sm text-muted-foreground">Phone Number</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                          <IconMapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedMerchant.address}</p>
                          <p className="text-sm text-muted-foreground">Business Address</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <p className="text-xs text-muted-foreground mr-auto">
                Note: Only BluPay admin can modify merchant information
              </p>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 