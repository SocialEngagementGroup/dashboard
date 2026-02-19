"use client"

import { useState } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Building2, CreditCard, Check, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

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

export function PaymentRow({ employee, lastPayment, lastSalaryPayment, lastBonusPayment, commonRemarks = [] }: { employee: Employee; lastPayment: LastPayment; lastSalaryPayment?: LastPayment; lastBonusPayment?: LastPayment; commonRemarks?: string[] }) {
    const router = useRouter()
    const [paymentType, setPaymentType] = useState<string>("Salary")
    const [currency, setCurrency] = useState<string>(lastPayment?.currency || "BDT")
    const [amount, setAmount] = useState<string>(lastPayment?.amount?.toString() || "50000")
    const [remarks, setRemarks] = useState<string>("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [isPaid, setIsPaid] = useState(false)

    // Determine which last payment to show based on selected type
    const displayedLastPayment = paymentType === 'Bonus' ? lastBonusPayment : lastSalaryPayment

    // Set default month to previous month
    const now = new Date()
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const defaultMonth = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`
    const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth)

    const monthOptions = getMonthOptions()

    // Check if employee has been paid for the selected month
    const isPaidForSelectedMonth = () => {
        // Only check for Salary payments
        if (!lastSalaryPayment) return false

        const selectedDate = new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]) - 1, 1)
        const selectedMonthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

        return lastSalaryPayment.month === selectedMonthName
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
                    remarks: paymentType === 'Bonus' ? remarks : undefined,
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
        <TableRow className={cn("transition-colors", isPaid ? "bg-green-50/50 dark:bg-green-950/20" : "")}>
            <TableCell>
                <div className="space-y-0.5">
                    <Link
                        href={`/admin/employees/${employee.id}/view`}
                        className="font-bold text-sm tracking-tight hover:underline text-[#3d2222] dark:text-indigo-400 block"
                    >
                        {employee.name || 'N/A'}
                    </Link>
                    {employee.designation && (
                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight">{employee.designation}</div>
                    )}
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${isPaidForSelectedMonth() || isPaid ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-orange-500 shadow-[0_0_8px_#f59e0b]'}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isPaidForSelectedMonth() || isPaid ? 'text-emerald-700 dark:text-emerald-400' : 'text-orange-700 dark:text-orange-400'}`}>
                        {isPaidForSelectedMonth() || isPaid ? 'Paid' : 'Pending'}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{employee.bankName || 'Not set'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <CreditCard className="h-3 w-3 text-slate-400" />
                        <span className="font-mono text-slate-600 dark:text-slate-300">{employee.accountNumber || 'Not set'}</span>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                {displayedLastPayment ? (
                    <div className="text-[11px] space-y-0.5">
                        <div className="font-bold text-slate-700 dark:text-slate-200">{displayedLastPayment.type}</div>
                        <div className="font-medium text-[#5c3333] dark:text-indigo-400">{displayedLastPayment.amount} {displayedLastPayment.currency}</div>
                        <div className="text-slate-500">{displayedLastPayment.month}</div>
                    </div>
                ) : (
                    <span className="text-[11px] font-medium text-slate-400 italic">No {paymentType.toLowerCase()} yet</span>
                )}
            </TableCell>

            <TableCell>
                <Select value={paymentType} onValueChange={setPaymentType} disabled={isPaid}>
                    <SelectTrigger className="w-full h-8 text-xs font-medium">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Salary">Salary</SelectItem>
                        <SelectItem value="Bonus">Bonus</SelectItem>
                    </SelectContent>
                </Select>
            </TableCell>

            <TableCell>
                {paymentType === 'Bonus' ? (
                    <div className="relative">
                        <Input
                            type="text"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Remarks"
                            className="w-full h-8 text-xs"
                            list={`remarks-list-${employee.id}`}
                            disabled={isPaid}
                        />
                        <datalist id={`remarks-list-${employee.id}`}>
                            {commonRemarks.map((remark) => (
                                <option key={remark} value={remark} />
                            ))}
                        </datalist>
                    </div>
                ) : (
                    <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={isPaid}>
                        <SelectTrigger className="w-full h-8 text-xs font-medium">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {monthOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </TableCell>

            <TableCell>
                <Select value={currency} onValueChange={setCurrency} disabled={isPaid}>
                    <SelectTrigger className="w-full h-8 text-xs font-medium">
                        <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="BDT">BDT (৳)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                </Select>
            </TableCell>

            <TableCell>
                <div className="relative">
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-full h-8 text-xs font-bold pr-8"
                        min="0"
                        step="0.01"
                        disabled={isPaid}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                        {currency}
                    </div>
                </div>
            </TableCell>

            <TableCell className="text-right">
                <Button
                    size="sm"
                    onClick={handleProcessPayment}
                    disabled={isProcessing || isPaid || !amount}
                    className={cn(
                        "h-8 px-4 text-xs font-bold transition-all duration-300",
                        isPaid
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none"
                            : "bg-[#5c3333] hover:bg-[#3d2222] shadow-sm hover:shadow-md"
                    )}
                >
                    {isPaid ? (
                        <>
                            <Check className="h-3.5 w-3.5 mr-1.5" />
                            Added
                        </>
                    ) : isProcessing ? (
                        "Adding..."
                    ) : (
                        <>
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Add
                        </>
                    )}
                </Button>
            </TableCell>
        </TableRow>
    )
}
