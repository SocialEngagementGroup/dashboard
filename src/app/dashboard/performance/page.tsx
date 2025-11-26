import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { DocumentList } from "@/components/dashboard/document-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Award, Target } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function PerformancePage() {
    const session = await auth()
    if (!session?.user) return null

    // Use session.user.id for queries, falling back to email if needed
    const userId = session.user.id || session.user.email

    const documents = await prisma.document.findMany({
        where: {
            userId: session.user.id,
            type: 'PERFORMANCE_REVIEW'
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="flex flex-col gap-6 fade-in">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Performance Management
                </h1>
                <p className="text-muted-foreground mt-1">Track your performance reviews and achievements</p>
            </div>

            {/* Performance Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{documents.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Latest Review</CardTitle>
                        <Award className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-bold">{documents[0] ? new Date(documents[0].createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</div>
                        <p className="text-xs text-muted-foreground mt-1">Most recent</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Goals</CardTitle>
                        <Target className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-bold">On Track</div>
                        <p className="text-xs text-muted-foreground mt-1">Current status</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Reviews
                </h2>
                <DocumentList documents={documents} emptyMessage="No performance reviews found." />
            </div>
        </div>
    )
}
