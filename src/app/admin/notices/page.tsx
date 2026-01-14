import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pin, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { deleteNotice, togglePinNotice } from "@/lib/actions/notice"

export default async function NoticesPage() {
    const notices = await prisma.notice.findMany({
        orderBy: [
            { isPinned: 'desc' },
            { createdAt: 'desc' }
        ]
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Notice Board</h1>
                <Button asChild>
                    <Link href="/admin/notices/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Notice
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {notices.map((notice: any) => (
                    <Card key={notice.id} className={notice.isPinned ? "border-blue-500" : ""}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="line-clamp-1">{notice.title}</CardTitle>
                                <CardDescription>
                                    {new Date(notice.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </div>
                            {notice.isPinned && (
                                <Pin className="h-4 w-4 text-blue-500 rotate-45" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {notice.content}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <form action={async () => {
                                "use server"
                                await togglePinNotice(notice.id, !notice.isPinned)
                            }}>
                                <Button variant="ghost" size="sm" type="submit">
                                    {notice.isPinned ? "Unpin" : "Pin"}
                                </Button>
                            </form>
                            <form action={async () => {
                                "use server"
                                await deleteNotice(notice.id)
                            }}>
                                <Button variant="ghost" size="sm" type="submit" className="text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                ))}
                {notices.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No notices found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
