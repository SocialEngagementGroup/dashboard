import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'
import { LeaveApplicationForm } from "@/components/dashboard/leave-form"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function LeavePage() {
    const session = await auth()
    if (!session?.user?.id) return null

    const requests = await prisma.leaveRequest.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Leave Management</h1>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <div className="rounded-md border bg-white p-6 dark:bg-gray-900">
                        <h2 className="mb-4 text-xl font-semibold">Apply for Leave</h2>
                        <LeaveApplicationForm />
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="rounded-md border bg-white p-6 dark:bg-gray-900">
                        <h2 className="mb-4 text-xl font-semibold">Leave History</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>{request.type}</TableCell>
                                        <TableCell>
                                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                request.status === 'APPROVED' ? 'default' :
                                                    request.status === 'REJECTED' ? 'destructive' : 'secondary'
                                            }>
                                                {request.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {requests.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                            No leave history found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}
