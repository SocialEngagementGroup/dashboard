import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = 'force-dynamic'
import { Pin } from "lucide-react"

export default async function DashboardPage() {
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

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Welcome Back</h1>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold">Company Notices</h2>
                    {notices.map((notice) => (
                        <Card key={notice.id} className={notice.isPinned ? "border-blue-500" : ""}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">{notice.title}</CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(notice.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {notice.isPinned && (
                                    <Pin className="h-4 w-4 text-blue-500 rotate-45" />
                                )}
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {notice.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                    {notices.length === 0 && (
                        <p className="text-muted-foreground">No notices at this time.</p>
                    )}
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Who's Out Today</h2>
                    <Card>
                        <CardContent className="pt-6">
                            {leaves.length > 0 ? (
                                <ul className="space-y-4">
                                    {leaves.map((leave) => (
                                        <li key={leave.id} className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                {leave.user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{leave.user.name}</p>
                                                <p className="text-xs text-muted-foreground">{leave.type}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">Everyone is in today!</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
