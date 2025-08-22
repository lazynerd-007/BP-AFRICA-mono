"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  IconSearch, 
  IconPlus, 
  IconAlertCircle,
  IconSortAscending,
  IconSortDescending
} from "@tabler/icons-react";

// Mock data
const mockTerminals = [
  {
    id: "TRM-001",
    serialNumber: "SN-12345678",
    model: "PAX A920",
    status: "Active",
    merchantId: "MERCH-001",
    merchantName: "Banco Limited",
    lastSeen: "2023-10-15T14:30:22",
    dateCreated: "2023-08-15T09:00:00",
    apkVersion: "2.3.1",
    location: "Accra, Ghana"
  },
  {
    id: "TRM-002",
    serialNumber: "SN-87654321",
    model: "Verifone V240m",
    status: "Active",
    merchantId: "MERCH-002",
    merchantName: "GreenWay Markets",
    lastSeen: "2023-10-14T09:15:30",
    dateCreated: "2023-07-20T11:30:00",
    apkVersion: "2.3.0",
    location: "Kumasi, Ghana"
  },
  {
    id: "TRM-003",
    serialNumber: "SN-11223344",
    model: "PAX A920",
    status: "Inactive",
    merchantId: null,
    merchantName: null,
    lastSeen: "2023-09-28T11:40:15",
    dateCreated: "2023-06-10T14:15:00",
    apkVersion: "2.2.5",
    location: "Warehouse"
  },
  {
    id: "TRM-004",
    serialNumber: "SN-55667788",
    model: "Ingenico Move 5000",
    status: "Deactivated",
    merchantId: "MERCH-003",
    merchantName: "TechCity Electronics",
    lastSeen: "2023-09-10T16:22:40",
    dateCreated: "2023-05-25T08:45:00",
    apkVersion: "2.2.5",
    location: "Tamale, Ghana"
  },
  {
    id: "TRM-005",
    serialNumber: "SN-99001122",
    model: "PAX A920",
    status: "Active",
    merchantId: "MERCH-001",
    merchantName: "Banco Limited",
    lastSeen: "2023-10-15T10:05:12",
    dateCreated: "2023-09-01T16:20:00",
    apkVersion: "2.3.1",
    location: "Accra, Ghana"
  }
];

// Type definitions
interface Terminal {
  id: string;
  serialNumber: string;
  model: string;
  status: string;
  merchantId: string | null;
  merchantName: string | null;
  lastSeen: string;
  dateCreated: string;
  apkVersion: string;
  location: string;
}




export default function TerminalDevicesPage() {
  const [terminals, setTerminals] = useState<Terminal[]>(mockTerminals);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("serialNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Dialog states
  const [newTerminalDialogOpen, setNewTerminalDialogOpen] = useState(false);
  
  // Form states
  const [newTerminalData, setNewTerminalData] = useState({
    serialNumber: ""
  });
  
  // Filter terminals based on search term and status
  const filteredTerminals = terminals.filter(terminal => {
    const matchesSearch = 
      terminal.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      terminal.merchantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      terminal.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || terminal.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort terminals
  const sortedTerminals = [...filteredTerminals].sort((a, b) => {
    const aValue = a[sortField as keyof Terminal] || "";
    const bValue = b[sortField as keyof Terminal] || "";
    
    if (sortDirection === "asc") {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const handleAddTerminal = () => {
    const newTerminal: Terminal = {
      id: `TRM-${String(terminals.length + 1).padStart(3, '0')}`,
      serialNumber: newTerminalData.serialNumber,
      model: "PAX A920", // Default model since selection is removed
      status: "Active",
      merchantId: null,
      merchantName: null,
      lastSeen: new Date().toISOString(),
      dateCreated: new Date().toISOString(),
      apkVersion: "2.3.1",
      location: "Unknown"
    };
    
    setTerminals([...terminals, newTerminal]);
    setNewTerminalDialogOpen(false);
    setNewTerminalData({ serialNumber: "" });
  };
  

  
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Device Manager</h2>
        <p className="text-muted-foreground">
          Monitor and manage POS terminals and payment devices
        </p>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative w-full md:w-64">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search terminals..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Deactivated">Deactivated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={newTerminalDialogOpen} onOpenChange={setNewTerminalDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <IconPlus className="h-4 w-4" />
                New Terminal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Terminal</DialogTitle>
                <DialogDescription>
                  Register a new POS terminal device to the system.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="terminal-id">Terminal ID</Label>
                  <Input
                    id="terminal-id"
                    placeholder="Enter terminal ID"
                    value={newTerminalData.serialNumber}
                    onChange={(e) => setNewTerminalData({...newTerminalData, serialNumber: e.target.value})}
                  />
                </div>
                

                

              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setNewTerminalDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddTerminal}
                  disabled={!newTerminalData.serialNumber}
                >
                  Add Terminal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Terminal Devices</CardTitle>
          <CardDescription>
            {sortedTerminals.length} terminal{sortedTerminals.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div 
                      className="flex items-center gap-1 cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("serialNumber")}
                    >
                      Terminal ID
                      {sortField === "serialNumber" && (
                        sortDirection === "asc" ? 
                        <IconSortAscending className="h-4 w-4" /> : 
                        <IconSortDescending className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div 
                      className="flex items-center gap-1 cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("merchantName")}
                    >
                      Merchant
                      {sortField === "merchantName" && (
                        sortDirection === "asc" ? 
                        <IconSortAscending className="h-4 w-4" /> : 
                        <IconSortDescending className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTerminals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <IconAlertCircle className="h-8 w-8" />
                        <p>No terminals found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedTerminals.map((terminal) => (
                    <TableRow key={terminal.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{terminal.serialNumber}</div>
                          <div className="text-sm text-muted-foreground">{terminal.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {terminal.merchantName || (
                          <span className="text-muted-foreground italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(terminal.dateCreated).toLocaleDateString('en-US', {
                          year: '2-digit',
                          month: 'numeric',
                          day: 'numeric'
                        }) + ', ' + new Date(terminal.dateCreated).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          terminal.merchantId ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {terminal.merchantId ? 'Allocated' : 'Not Allocated'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      

    </div>
  );
}