import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, FileText, TrendingUp, Users } from "lucide-react"

export async function StatCards() {
    const session = await auth()
    const userId = session?.user?.id

    const today = new Date()
    const [leavesToday, userLeaves] = await Promise.all([
        prisma.leaveRequest.findMany({
            where: {
                status: 'APPROVED',
                startDate: { lte: today },
                endDate: { gte: today }
            }
        }),
        userId ? prisma.leaveRequest.findMany({
            where: { userId }
        }) : Promise.resolve([])
    ])

    const pendingLeaves = userLeaves.filter((l: any) => l.status === 'PENDING').length
    const approvedLeaves = userLeaves.filter((l: any) => l.status === 'APPROVED').length

    return (
        <div className="grid gap-4 md:grid-cols-4 slide-up">
            <Card className="hover-lift border-l-4 border-l-[var(--primary)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Leaves</CardTitle>
                    <Calendar className="h-4 w-4 text-[var(--primary)]" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userLeaves.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                </CardContent>
            </Card>

            <Card className="hover-lift border-l-4 border-l-amber-500/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    <FileText className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingLeaves}</div>
                    <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                </CardContent>
            </Card>

            <Card className="hover-lift border-l-4 border-l-emerald-500/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{approvedLeaves}</div>
                    <p className="text-xs text-muted-foreground mt-1">This year</p>
                </CardContent>
            </Card>

            <Card className="hover-lift border-l-4 border-l-indigo-500/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Team Out</CardTitle>
                    <Users className="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{leavesToday.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Today</p>
                </CardContent>
            </Card>
        </div>
    )
}
