import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { updateLeaveStatus } from "@/lib/actions/leave"
import { Check, X } from "lucide-react"

export default async function LeaveRequestsPage() {
    const requests = await prisma.leaveRequest.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Leave Requests</h1>

            <div className="rounded-md border bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell className="font-medium">{request.user.name}</TableCell>
                                <TableCell>{request.type}</TableCell>
                                <TableCell>
                                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="max-w-xs truncate" title={request.reason}>{request.reason}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        request.status === 'APPROVED' ? 'default' :
                                            request.status === 'REJECTED' ? 'destructive' : 'secondary'
                                    }>
                                        {request.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {request.status === 'PENDING' && (
                                        <div className="flex justify-end gap-2">
                                            <form action={async () => {
                                                "use server"
                                                await updateLeaveStatus(request.id, "APPROVED")
                                            }}>
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            </form>
                                            <form action={async () => {
                                                "use server"
                                                await updateLeaveStatus(request.id, "REJECTED")
                                            }}>
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {requests.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No leave requests found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
