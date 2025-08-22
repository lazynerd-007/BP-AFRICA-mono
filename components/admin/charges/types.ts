export interface ChargeData {
  amount: number
  percentage: number
  cap: number
  chargeType: "fixed" | "percentage"
  status: "Active" | "Inactive"
  lastUpdated: string
}

export interface ChargeFormData {
  amount: number
  percentage: number
  cap: number
  chargeType: "fixed" | "percentage"
  status: "Active" | "Inactive"
}

export interface ChargeCardProps {
  title: string
  icon: React.ReactNode
  charge: ChargeData
  chargeType: string
  isEditing: boolean
  onEdit: (chargeType: string) => void
  onCancel: () => void
  onSave: (chargeType: string, formData: ChargeFormData) => void
  currency: string
}

export interface ChargesData {
  walletToWallet: ChargeData
  momoSettlement: ChargeData
  bankSettlement: ChargeData
  momoPayout: ChargeData
  bankPayout: ChargeData
  bankCollection: ChargeData
  momoCollection: ChargeData
}

// Mock data for current active charges (only one per settlement type)
export const mockCharges: ChargesData = {
  walletToWallet: {
    amount: 2.00,
    percentage: 1.0,
    cap: 10.00,
    chargeType: "fixed",
    status: "Active",
    lastUpdated: "2024-01-15"
  },
  momoSettlement: {
    amount: 5.00,
    percentage: 0.8,
    cap: 15.00,
    chargeType: "percentage",
    status: "Active",
    lastUpdated: "2024-01-12"
  },
  bankSettlement: {
    amount: 10.00,
    percentage: 1.5,
    cap: 20.00,
    chargeType: "percentage",
    status: "Active",
    lastUpdated: "2024-01-10"
  },
  momoPayout: {
    amount: 3.00,
    percentage: 0.5,
    cap: 12.00,
    chargeType: "percentage",
    status: "Active",
    lastUpdated: "2024-01-15"
  },
  bankPayout: {
    amount: 8.00,
    percentage: 1.2,
    cap: 25.00,
    chargeType: "percentage",
    status: "Active",
    lastUpdated: "2024-01-15"
  },
  bankCollection: {
    amount: 2.50,
    percentage: 0.7,
    cap: 18.00,
    chargeType: "percentage",
    status: "Active",
    lastUpdated: "2024-01-15"
  },
  momoCollection: {
    amount: 1.50,
    percentage: 0.6,
    cap: 14.00,
    chargeType: "percentage",
    status: "Active",
    lastUpdated: "2024-01-15"
  }
} 