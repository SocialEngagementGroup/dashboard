import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = 'force-dynamic'
import { Pin, Calendar, Users, FileText, TrendingUp } from "lucide-react"
import { EstClock } from "@/components/est-clock"

export default async function DashboardPage() {
    const session = await auth()
    const userId = session?.user?.id

    const notices = await prisma.notice.findMany({
        orderBy: [
            { isPinned: 'desc' },
            { createdAt: 'desc' }
        ]
    })

    // Get employees on leave today
    const today = new Date()
    const leaves = await prisma.leaveRequest.findMany({
        where: {
            status: 'APPROVED',
            startDate: { lte: today },
            endDate: { gte: today }
        },
        include: { user: true }
    })

    // Get user stats
    const userLeaves = userId ? await prisma.leaveRequest.findMany({
        where: { userId }
    }) : []

    const pendingLeaves = userLeaves.filter(l => l.status === 'PENDING').length
    const approvedLeaves = userLeaves.filter(l => l.status === 'APPROVED').length

    return (
        <div className="flex flex-col gap-6 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening today</p>
                </div>
                <EstClock />
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leaves</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userLeaves.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <FileText className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingLeaves}</div>
                        <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvedLeaves}</div>
                        <p className="text-xs text-muted-foreground mt-1">This year</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Out</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leaves.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Today</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Company Notices
                    </h2>
                    <div className="space-y-4">
                        {notices.map((notice) => (
                            <Card key={notice.id} className={`hover:shadow-md transition-all duration-200 ${notice.isPinned ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : ""}`}>
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-2">
                                            {notice.isPinned && (
                                                <Pin className="h-4 w-4 text-blue-500 rotate-45" />
                                            )}
                                            <CardTitle className="text-lg">{notice.title}</CardTitle>
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(notice.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                        {notice.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                        {notices.length === 0 && (
                            <Card className="border-dashed">
                                <CardContent className="flex items-center justify-center py-12">
                                    <p className="text-muted-foreground">No notices at this time.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Who&apos;s Out Today
                    </h2>
                    <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardContent className="pt-6">
                            {leaves.length > 0 ? (
                                <ul className="space-y-4">
                                    {leaves.map((leave) => (
                                        <li key={leave.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-semibold text-white shadow-md">
                                                {leave.user.name?.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{leave.user.name}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {leave.type}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Users className="h-12 w-12 text-green-500 mb-3" />
                                    <p className="text-sm font-medium">Everyone is in today!</p>
                                    <p className="text-xs text-muted-foreground mt-1">Full team strength</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
