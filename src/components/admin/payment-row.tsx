"use client"

import { useState } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Building2, CreditCard, Check, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Employee = {
    id: string
    name: string | null
    employeeId: string | null
    email: string | null
    designation: string | null
    department: string | null
    bankName: string | null
    bankAccountName: string | null
    accountNumber: string | null
    branchName: string | null
    routingNumber: string | null
    swiftCode: string | null
}

type LastPayment = {
    amount: number
    currency: string
    month: string
    type: string
} | null

// Generate month options
function getMonthOptions() {
    const options = []
    const now = new Date()

    for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        options.push({ value, label })
    }

    return options
}

export function PaymentRow({ employee, lastPayment }: { employee: Employee; lastPayment: LastPayment }) {
    const router = useRouter()
    const [paymentType, setPaymentType] = useState<string>("Salary")
    const [currency, setCurrency] = useState<string>(lastPayment?.currency || "BDT")
    const [amount, setAmount] = useState<string>(lastPayment?.amount?.toString() || "50000")
    const [isProcessing, setIsProcessing] = useState(false)
    const [isPaid, setIsPaid] = useState(false)

    // Set default month to previous month
    const now = new Date()
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const defaultMonth = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`
    const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth)

    const monthOptions = getMonthOptions()

    // Check if employee has been paid for the selected month
    const isPaidForSelectedMonth = () => {
        if (!lastPayment) return false

        const selectedDate = new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]) - 1, 1)
        const selectedMonthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

        return lastPayment.month === selectedMonthName
    }

    const handleProcessPayment = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert("Please enter a valid amount")
            return
        }

        setIsProcessing(true)

        try {
            const response = await fetch('/api/admin/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId: employee.id,
                    amount: parseFloat(amount),
                    currency,
                    month: selectedMonth,
                    paymentType,
                }),
            })

            if (response.ok) {
                setIsPaid(true)
                // Refresh the page to show updated data
                router.refresh()
            } else {
                const error = await response.json()
                alert(`Error: ${error.message || 'Failed to process payment'}`)
            }
        } catch (error) {
            console.error('Payment processing error:', error)
            alert('Failed to process payment. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <TableRow className={isPaid ? "bg-green-50 dark:bg-green-950/20" : ""}>
            <TableCell>
                <div className="space-y-1">
                    <Link
                        href={`/admin/employees/${employee.id}/view`}
                        className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline block"
                    >
                        {employee.name || 'N/A'}
                    </Link>
                    {employee.designation && (
                        <div className="text-xs text-muted-foreground">{employee.designation}</div>
                    )}
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${isPaidForSelectedMonth() || isPaid ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <span className={`text-sm font-medium ${isPaidForSelectedMonth() || isPaid ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}`}>
                        {isPaidForSelectedMonth() || isPaid ? 'Paid this month' : 'Pending payment'}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <div className="space-y-1.5 text-sm">
                    <div className="flex items-start gap-2">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <span className="text-muted-foreground">Bank Name: </span>
                            <span className="font-medium">{employee.bankName || 'Not set'}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <CreditCard className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <span className="text-muted-foreground">Account Number: </span>
                            <span className="font-medium font-mono">{employee.accountNumber || 'Not set'}</span>
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                {lastPayment ? (
                    <div className="text-sm space-y-1">
                        <div className="font-medium">{lastPayment.type}</div>
                        <div className="text-xs text-muted-foreground">{lastPayment.amount} {lastPayment.currency}</div>
                        <div className="text-xs text-muted-foreground">{lastPayment.month}</div>
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">No payment yet</span>
                )}
            </TableCell>

            <TableCell>
                <Select value={paymentType} onValueChange={setPaymentType} disabled={isPaid}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Salary">Salary</SelectItem>
                        <SelectItem value="Bonus">Bonus</SelectItem>
                    </SelectContent>
                </Select>
            </TableCell>

            <TableCell>
                <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={isPaid}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {monthOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>

            <TableCell>
                <Select value={currency} onValueChange={setCurrency} disabled={isPaid}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="BDT">BDT (৳)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                </Select>
            </TableCell>

            <TableCell>
                <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full"
                    min="0"
                    step="0.01"
                    disabled={isPaid}
                />
            </TableCell>

            <TableCell className="text-right">
                <Button
                    size="sm"
                    onClick={handleProcessPayment}
                    disabled={isProcessing || isPaid || !amount}
                    className="w-full"
                    variant={isPaid ? "outline" : "default"}
                >
                    {isPaid ? (
                        <>
                            <Check className="h-3 w-3 mr-1" />
                            Added
                        </>
                    ) : isProcessing ? (
                        "Adding..."
                    ) : (
                        <>
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                        </>
                    )}
                </Button>
            </TableCell>
        </TableRow>
    )
}
