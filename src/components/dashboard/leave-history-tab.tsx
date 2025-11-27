"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, CheckCircle2, Clock, XCircle, Filter } from "lucide-react"
import { format } from "date-fns"
import { calculateBusinessDays } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { updateLeaveStatus } from "@/lib/actions/leave"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface LeaveRequest {
    id: string
    type: string
    startDate: Date
    endDate: Date
    reason: string
    status: string
    createdAt: Date
}

interface LeaveHistoryTabProps {
    leaveRequests: LeaveRequest[]
}

export function LeaveHistoryTab({ leaveRequests }: LeaveHistoryTabProps) {
    const router = useRouter()
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")

    // Calculate Stats
    const stats = useMemo(() => {
        return {
            total: leaveRequests.length,
            pending: leaveRequests.filter(r => r.status === "PENDING").length,
            approved: leaveRequests.filter(r => r.status === "APPROVED").length,
            rejected: leaveRequests.filter(r => r.status === "REJECTED").length,
        }
    }, [leaveRequests])

    // Filter Data
    const filteredRequests = useMemo(() => {
        return leaveRequests.filter(request => {
            // Status Filter
            if (statusFilter !== "all" && request.status !== statusFilter) return false

            // Type Filter
            if (typeFilter !== "all" && request.type !== typeFilter) return false

            // Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                return (
                    request.type.toLowerCase().includes(query) ||
                    request.reason.toLowerCase().includes(query)
                )
            }

            return true
        })
    }, [leaveRequests, statusFilter, typeFilter, searchQuery])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
            case "REJECTED":
                return <Badge variant="destructive">Rejected</Badge>
            default:
                return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>
        }
    }

    const getDuration = (start: Date, end: Date) => {
        const days = calculateBusinessDays(new Date(start), new Date(end))
        return `${days} ${days === 1 ? 'day' : 'days'}`
    }

    const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
        try {
            await updateLeaveStatus(id, status)
            toast.success(`Leave request ${status.toLowerCase()}`)
            router.refresh()
        } catch (error) {
            toast.error("Failed to update leave status")
        }
    }

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leaves</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All time requests</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.approved}</div>
                        <p className="text-xs text-muted-foreground">Granted leaves</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.rejected}</div>
                        <p className="text-xs text-muted-foreground">Denied requests</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Table */}
            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-medium">Leave History</CardTitle>
                            <CardDescription>View and manage leave requests</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by type or reason..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="APPROVED">Approved</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Filter Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                                    <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                                    <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Date Range</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Applied On</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            No leave requests found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell className="font-medium">{request.type}</TableCell>
                                            <TableCell>{getDuration(request.startDate, request.endDate)}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {format(new Date(request.startDate), "MMM d, yyyy")} - {format(new Date(request.endDate), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate" title={request.reason}>
                                                {request.reason}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {format(new Date(request.createdAt), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {getStatusBadge(request.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {request.status === 'PENDING' && (
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => handleStatusUpdate(request.id, "APPROVED")}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleStatusUpdate(request.id, "REJECTED")}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
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
    )
}
