import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { DocumentList } from "@/components/dashboard/document-list"
import { BankingSection } from "@/components/dashboard/banking-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Banknote, TrendingUp, Calendar } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function SalaryPage() {
    const session = await auth()
    if (!session?.user) {
        return null
    }

    // Try to find user by ID first, then by email as fallback
    // This handles cases where the session has an old user ID from a JWT token
    let user = null
    if (session.user.id) {
        user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })
    }

    if (!user && session.user.email) {
        user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })
    }

    const documents = await prisma.document.findMany({
        where: {
            userId: session.user.id,
            type: 'SALARY_SLIP'
        },
        orderBy: { createdAt: 'desc' }
    })

    const currentYear = new Date().getFullYear()
    const thisYearDocs = documents.filter(d => new Date(d.createdAt).getFullYear() === currentYear)

    if (!user) return null

    return (
        <div className="flex flex-col gap-6 fade-in">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Salary Management
                </h1>
                <p className="text-muted-foreground mt-1">View your salary slips and manage banking information</p>
            </div>

            {/* Banking Information */}
            <BankingSection user={user} />

            {/* Salary Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                        <Banknote className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{documents.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Year</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{thisYearDocs.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">{currentYear}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Latest</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-bold">{documents[0] ? new Date(documents[0].createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</div>
                        <p className="text-xs text-muted-foreground mt-1">Most recent</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Banknote className="h-5 w-5" />
                    Salary Slips
                </h2>
                <DocumentList documents={documents} emptyMessage="No salary slips found." />
            </div>
        </div>
    )
}
