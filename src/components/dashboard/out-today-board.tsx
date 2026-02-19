import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar } from "lucide-react"

export async function OutTodayBoard() {
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
        <div className="space-y-4 slide-up">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Who&apos;s Out Today
            </h2>
            <Card className="hover-lift border-l-4 border-l-[var(--primary)]/30">
                <CardContent className="pt-6">
                    {leaves.length > 0 ? (
                        <ul className="space-y-4">
                            {leaves.map((leave: any) => (
                                <li key={leave.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--primary)]/5 transition-colors group">
                                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-[#5c3333] to-[#8a4d4d] flex items-center justify-center text-sm font-semibold text-white shadow-md transition-transform group-hover:scale-110">
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
    )
}
