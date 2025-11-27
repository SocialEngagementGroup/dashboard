import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { BankingSection } from "@/components/dashboard/banking-section"
import { SalaryHistoryTable } from "@/components/dashboard/salary-history-table"
import { History } from "lucide-react"

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

    if (!user) return null

    return (
        <div className="flex flex-col gap-6 fade-in">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Salary Management
                </h1>
                <p className="text-muted-foreground mt-1">View your salary history and manage banking information</p>
            </div>

            {/* Banking Information */}
            <BankingSection user={user} />

            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Salary History
                </h2>
                <SalaryHistoryTable documents={documents} />
            </div>
        </div>
    )
}
