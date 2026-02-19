import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pin, Calendar, FileText } from "lucide-react"

export async function NoticeBoard() {
    const notices = await prisma.notice.findMany({
        orderBy: [
            { isPinned: 'desc' },
            { createdAt: 'desc' }
        ]
    })

    return (
        <div className="space-y-4 slide-up">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Company Notices
            </h2>
            <div className="space-y-4">
                {notices.map((notice: any) => (
                    <Card key={notice.id} className={`hover-lift transition-all duration-300 ${notice.isPinned ? "border-l-4 border-l-[var(--primary)] bg-[var(--primary)]/5" : ""}`}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                    {notice.isPinned && (
                                        <Pin className="h-4 w-4 text-[var(--primary)] rotate-45" />
                                    )}
                                    <CardTitle className="text-lg font-bold">{notice.title}</CardTitle>
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
    )
}
