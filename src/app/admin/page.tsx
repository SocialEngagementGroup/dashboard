import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Calendar } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const [
        totalEmployees,
        pendingLeaves,
        activeNotices,
        pinnedNotices
    ] = await Promise.all([
        prisma.user.count({ where: { role: 'EMPLOYEE' } }),
        prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
        prisma.notice.count(),
        prisma.notice.count({ where: { isPinned: true } })
    ])

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEmployees}</div>
                        <p className="text-xs text-muted-foreground">Active employees</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Leave Requests</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingLeaves}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Notices</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeNotices}</div>
                        <p className="text-xs text-muted-foreground">{pinnedNotices} pinned</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
