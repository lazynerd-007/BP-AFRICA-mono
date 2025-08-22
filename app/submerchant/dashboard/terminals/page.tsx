"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IconBuilding } from "@tabler/icons-react";

// Mock terminals data for submerchant
const mockTerminals = [
  {
    id: "TRM-SUB-001",
    model: "PAX A920",
    location: "Main Counter",
    serialNumber: "BLU87654321",
    status: "active",
    lastActive: "2023-11-15T15:40:22",
    assignedBy: "BluWave Limited",
  },
  {
    id: "TRM-SUB-002",
    model: "Verifone V240m",
    location: "Checkout Point 2",
    serialNumber: "VRT12345678",
    status: "active",
    lastActive: "2023-11-15T09:15:43",
    assignedBy: "BluWave Limited",
  },
  {
    id: "TRM-SUB-003",
    model: "PAX A920",
    location: "Mobile Unit",
    serialNumber: "BLU98765432",
    status: "maintenance",
    lastActive: "2023-11-10T11:30:15",
    assignedBy: "BluWave Limited",
  },
];

// Define proper type for badge variants
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export default function SubmerchantTerminalsPage() {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch(status) {
      case "active":
        return "default";
      case "inactive":
        return "outline";
      case "maintenance":
        return "secondary";
      default:
        return "default";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Terminal Devices</h1>
        <p className="text-muted-foreground">
          View and monitor your assigned payment terminals
        </p>
      </div>


      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Terminals</CardDescription>
            <CardTitle className="text-2xl">{mockTerminals.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Assigned to your account
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Terminals</CardDescription>
            <CardTitle className="text-2xl">
              {mockTerminals.filter(t => t.status === "active").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Maintenance</CardDescription>
            <CardTitle className="text-2xl">
              {mockTerminals.filter(t => t.status === "maintenance").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Under maintenance or repair
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive</CardDescription>
            <CardTitle className="text-2xl">
              {mockTerminals.filter(t => t.status === "inactive").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Disabled or offline
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Your Assigned Terminals</CardTitle>
              <CardDescription>Terminal devices assigned by your parent merchant</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconBuilding className="h-4 w-4" />
              <span>Managed by: BluWave Limited</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Terminal ID</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Assigned By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTerminals.map((terminal) => (
                  <TableRow key={terminal.id}>
                    <TableCell className="font-medium">{terminal.id}</TableCell>
                    <TableCell>{terminal.model}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {terminal.serialNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(terminal.status)} className={getStatusColor(terminal.status)}>
                        {terminal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(terminal.lastActive)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {terminal.assignedBy}
                    </TableCell>
                  </TableRow>
                ))}
                
                {mockTerminals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No terminals assigned yet. Contact your parent merchant to request terminal assignment.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Terminal Information */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Terminal Support</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              For terminal-related issues, maintenance requests, or to request additional terminals, please contact your parent merchant directly.
            </p>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p><strong>Parent Merchant:</strong> BluWave Limited</p>
              <p><strong>Support Hours:</strong> Monday - Friday, 8:00 AM - 6:00 PM</p>
              <p><strong>Emergency Support:</strong> Available 24/7 for critical issues</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 