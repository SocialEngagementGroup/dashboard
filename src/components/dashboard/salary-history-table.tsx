"use client"

import { useState, useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, Eye, Search, Trash2, Edit, MoreHorizontal, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface PaymentRecord {
    id: string
    title: string
    url: string
    createdAt: Date
    type: string
    month: string
    year: number
    amount?: number
    currency?: string
}

interface SalaryHistoryTableProps {
    documents: any[]
    isAdmin?: boolean
}

export function SalaryHistoryTable({ documents, isAdmin = false }: SalaryHistoryTableProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [yearFilter, setYearFilter] = useState<string>("all")

    // Edit State
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<PaymentRecord | null>(null)
    const [editAmount, setEditAmount] = useState("")
    const [editRemarks, setEditRemarks] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Delete State
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Parse documents into payment records
    const paymentRecords: PaymentRecord[] = useMemo(() => {
        return documents.map(doc => {
            // Split title by " - " to handle different formats
            // Format 1: "Salary - Month Year" (Old)
            // Format 2: "Salary - Month Year - Amount Currency" (New)
            // Format 3: "Bonus - Remarks - Amount Currency" (New)

            const parts = doc.title.split(' - ')
            const type = parts[0] || "Salary"

            let month = "Unknown"
            let year = new Date(doc.createdAt).getFullYear()
            let amount = undefined
            let currency = "BDT"

            if (type === "Salary") {
                // Try to parse "Month Year" from the second part
                const datePart = parts[1] || ""
                const dateMatch = datePart.match(/([A-Z][a-z]+)\s*(\d{4})/)
                if (dateMatch) {
                    month = dateMatch[1]
                    year = parseInt(dateMatch[2])
                } else {
                    month = datePart
                }
            } else if (type === "Bonus") {
                // For Bonus, the second part is the Remarks
                // We'll display Remarks in the "Month" column as requested
                month = parts[1] || "Bonus"
            }

            // Try to extract amount from title if present (it might be in the 3rd part or anywhere)
            const amountMatch = doc.title.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(BDT|USD|EUR|GBP)/)
            if (amountMatch) {
                amount = parseFloat(amountMatch[1].replace(/,/g, ''))
                currency = amountMatch[2]
            }

            return {
                id: doc.id,
                title: doc.title,
                url: doc.url,
                createdAt: new Date(doc.createdAt),
                type,
                month,
                year,
                amount,
                currency
            }
        })
    }, [documents])

    // Get unique years for filter
    const availableYears = useMemo(() => {
        const years = [...new Set(paymentRecords.map(record => record.year))]
        return years.sort((a, b) => b - a) // Most recent first
    }, [paymentRecords])

    // Filter records
    const filteredRecords = useMemo(() => {
        return paymentRecords.filter(record => {
            // Year filter
            if (yearFilter !== "all" && record.year.toString() !== yearFilter) {
                return false
            }

            // Search filter (search in type, month, or amount)
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                const searchableText = `${record.type} ${record.month} ${record.amount || ''} ${record.currency}`.toLowerCase()
                if (!searchableText.includes(query)) {
                    return false
                }
            }

            return true
        })
    }, [paymentRecords, yearFilter, searchQuery])

    const getCurrencySymbol = (currency: string) => {
        const symbols: { [key: string]: string } = {
            'BDT': '৳',
            'USD': '$',
            'EUR': '€',
            'GBP': '£'
        }
        return symbols[currency] || currency
    }

    const formatAmount = (amount: number | undefined, currency: string) => {
        if (amount === undefined) return 'N/A'
        return `${getCurrencySymbol(currency)} ${amount.toLocaleString()}`
    }

    const handleDelete = async (id: string) => {
        setIsDeleting(true)
        try {
            const response = await fetch(`/api/admin/documents/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete')

            toast.success("Payment record deleted")
            router.refresh()
        } catch (error) {
            toast.error("Failed to delete payment record")
            console.error(error)
        } finally {
            setIsDeleting(false)
            setDeletingId(null)
        }
    }

    const openEditDialog = (record: PaymentRecord) => {
        setEditingRecord(record)
        setEditAmount(record.amount?.toString() || "")
        setEditRemarks(record.month) // 'month' holds the remarks for Bonus, or Month name for Salary
        setIsEditOpen(true)
    }

    const handleSaveEdit = async () => {
        if (!editingRecord) return

        setIsSaving(true)
        try {
            const response = await fetch(`/api/admin/documents/${editingRecord.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentType: editingRecord.type,
                    remarks: editRemarks, // For Salary this might be the month name, for Bonus it's remarks
                    month: editRemarks, // We use the same field for simplicity in reconstruction
                    amount: editAmount,
                    currency: editingRecord.currency || 'BDT'
                })
            })

            if (!response.ok) throw new Error('Failed to update')

            toast.success("Payment record updated")
            router.refresh()
            setIsEditOpen(false)
        } catch (error) {
            toast.error("Failed to update payment record")
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by type, month, or amount..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {availableYears.map(year => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
                Showing {filteredRecords.length} of {paymentRecords.length} payment{paymentRecords.length !== 1 ? 's' : ''}
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Payment Type</TableHead>
                            <TableHead>Payment Date</TableHead>
                            <TableHead>Remarks / Month</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRecords.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                                    {searchQuery || yearFilter !== "all"
                                        ? "No payments found matching your filters."
                                        : "No payment history found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRecords.map((record) => (
                                <TableRow key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <TableCell>
                                        <Badge variant={record.type === "Salary" ? "default" : "secondary"}>
                                            {record.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {record.createdAt.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {record.month} {record.year}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {formatAmount(record.amount, record.currency || 'BDT')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {isAdmin ? (
                                                <>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                        <a href={record.url} target="_blank" rel="noopener noreferrer">
                                                            <Eye className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                        <a href={record.url} download target="_blank" rel="noopener noreferrer">
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(record)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => setDeletingId(record.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a
                                                            href={record.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a
                                                            href={record.url}
                                                            download
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Download className="h-4 w-4 mr-1" />
                                                            Download
                                                        </a>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Payment Record</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{editingRecord?.type === 'Bonus' ? 'Remarks' : 'Month'}</Label>
                            <Input
                                value={editRemarks}
                                onChange={(e) => setEditRemarks(e.target.value)}
                            />
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
                            Note: Updating this record will only change the database entry. The original PDF file will not be regenerated.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Alert Dialog */}
            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the payment record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deletingId && handleDelete(deletingId)}
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
