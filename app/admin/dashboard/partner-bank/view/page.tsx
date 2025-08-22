"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { IconPencil, IconSearch, IconEye } from "@tabler/icons-react"
import { useState } from "react"
import Link from "next/link"

// Mock data for partner banks
const mockPartnerBanks = [
  {
    id: 1,
    name: "Ghana Commercial Bank",
    email: "gcb@example.com",
    accountManager: "John Mensah",
    commissionRatio: "0.05",
    settlements: 125,
    merchants: 48,
    status: "Active",
  },
  {
    id: 2,
    name: "Ecobank Ghana",
    email: "ecobank@example.com",
    accountManager: "Sarah Asante",
    commissionRatio: "0.04",
    settlements: 98,
    merchants: 32,
    status: "Active",
  },
  {
    id: 3,
    name: "Stanbic Bank Ghana",
    email: "stanbic@example.com",
    accountManager: "Michael Osei",
    commissionRatio: "0.045",
    settlements: 112,
    merchants: 41,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Zenith Bank Ghana",
    email: "zenith@example.com",
    accountManager: "Rebecca Adjei",
    commissionRatio: "0.05",
    settlements: 87,
    merchants: 29,
    status: "Active",
  },
  {
    id: 5,
    name: "Absa Bank Ghana",
    email: "absa@example.com",
    accountManager: "David Kwame",
    commissionRatio: "0.035",
    settlements: 76,
    merchants: 25,
    status: "Active",
  },
]

export default function ViewPartnerBanks() {
  const [searchTerm, setSearchTerm] = useState("")
  const [partnerBanks] = useState(mockPartnerBanks)
  
  const filteredBanks = partnerBanks.filter(
    bank => 
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <Card>
      <CardHeader className="bg-muted/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle className="text-xl font-semibold">Bank Details</CardTitle>
        <div className="relative max-w-xs w-full md:w-72">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search partner banks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Partner Bank</TableHead>
                <TableHead>Account Manager</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead className="text-center">Settlements</TableHead>
                <TableHead className="text-center">Merchants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBanks.length > 0 ? (
                filteredBanks.map((bank) => (
                  <TableRow key={bank.id}>
                    <TableCell className="font-medium">{bank.name}</TableCell>
                    <TableCell>{bank.accountManager}</TableCell>
                    <TableCell>{parseFloat(bank.commissionRatio) * 100}%</TableCell>
                    <TableCell className="text-center">{bank.settlements}</TableCell>
                    <TableCell className="text-center">{bank.merchants}</TableCell>
                    <TableCell>
                      <Badge
                        variant={bank.status === "Active" ? "secondary" : "outline"}
                      >
                        {bank.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/dashboard/partner-bank/view/${bank.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Bank Details">
                            <IconEye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit Bank">
                          <IconPencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No partner banks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 