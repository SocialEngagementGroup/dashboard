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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react"

export default async function LeavePage() {
    const session = await auth()
    if (!session?.user?.id) return null

    const requests = await prisma.leaveRequest.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    const pendingCount = requests.filter(r => r.status === 'PENDING').length
    const approvedCount = requests.filter(r => r.status === 'APPROVED').length
    const rejectedCount = requests.filter(r => r.status === 'REJECTED').length

    return (
        <div className="flex flex-col gap-6 fade-in">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Leave Management
                </h1>
                <p className="text-muted-foreground mt-1">Manage your leave requests and view history</p>
            </div>

            {/* Leave Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvedCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total approved</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{rejectedCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Not approved</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Apply for Leave
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LeaveApplicationForm />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Leave History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
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
                                            <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <TableCell className="font-medium">{request.type}</TableCell>
                                                <TableCell className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        request.status === 'APPROVED' ? 'default' :
                                                            request.status === 'REJECTED' ? 'destructive' : 'secondary'
                                                    } className="font-medium">
                                                        {request.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {requests.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center h-32">
                                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                        <Calendar className="h-12 w-12 text-gray-300" />
                                                        <p className="text-sm">No leave history found.</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
