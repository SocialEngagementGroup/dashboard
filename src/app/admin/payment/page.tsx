import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { PaymentRow } from "@/components/admin/payment-row"

export const dynamic = 'force-dynamic'

export default async function PaymentPage() {
    // Fetch all employees with their banking information
    const employees = await prisma.user.findMany({
        where: {
            role: 'EMPLOYEE',
        },
        orderBy: { name: 'asc' },
        select: {
            id: true,
            name: true,
            employeeId: true,
            email: true,
            designation: true,
            department: true,
            bankName: true,
            bankAccountName: true,
            accountNumber: true,
            branchName: true,
            routingNumber: true,
            swiftCode: true,
        }
    })

    // Fetch last payment and last salary for each employee
    const employeesWithLastPayment = await Promise.all(
        employees.map(async (employee) => {
            // Get the very last payment (could be Salary or Bonus)
            const lastDocument = await prisma.document.findFirst({
                where: {
                    userId: employee.id,
                    type: 'SALARY_SLIP',
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            // Get the last SALARY payment specifically
            const lastSalaryDocument = await prisma.document.findFirst({
                where: {
                    userId: employee.id,
                    type: 'SALARY_SLIP',
                    title: {
                        startsWith: 'Salary'
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            // Get the last BONUS payment specifically
            const lastBonusDocument = await prisma.document.findFirst({
                where: {
                    userId: employee.id,
                    type: 'SALARY_SLIP',
                    title: {
                        startsWith: 'Bonus'
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            const parseDocument = (doc: typeof lastDocument) => {
                if (!doc) return null

                // Split title by " - "
                const parts = doc.title.split(' - ')
                const type = parts[0] || "Salary"
                let month = ""
                let amount = 0
                let currency = "BDT"

                if (type === "Salary") {
                    // Format: Salary - Month Year - Amount Currency
                    month = parts[1] || ""
                } else {
                    // Format: Bonus - Remark - Amount Currency
                    month = parts[1] || "" // This is the remark
                }

                // Extract amount and currency from the last part or regex
                const amountMatch = doc.title.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(BDT|USD|EUR|GBP)/)
                if (amountMatch) {
                    amount = parseFloat(amountMatch[1].replace(/,/g, ''))
                    currency = amountMatch[2]
                }

                return {
                    type,
                    month,
                    amount,
                    currency
                }
            }

            return {
                ...employee,
                lastPayment: parseDocument(lastDocument),
                lastSalaryPayment: parseDocument(lastSalaryDocument),
                lastBonusPayment: parseDocument(lastBonusDocument)
            }
        })
    )

    // Get current date for previous month calculation
    const now = new Date()
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const monthYear = previousMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    // Fetch all salary slip documents to extract common remarks for bonuses
    const allDocuments = await prisma.document.findMany({
        where: {
            type: 'SALARY_SLIP',
            title: {
                startsWith: 'Bonus - '
            }
        },
        select: {
            title: true
        },
        distinct: ['title']
    })

    // Extract remarks from titles (format: "Bonus - Remark - Amount Currency")
    const commonRemarks = allDocuments
        .map((doc) => {
            // Split by " - "
            const parts = doc.title.split(' - ')
            // parts[0] is "Bonus", parts[1] is Remark, parts[2] is Amount (optional/new)
            if (parts.length >= 2) {
                return parts[1]
            }
            return ''
        })
        .filter(remark => remark.trim() !== '')
        .sort()
        // Remove duplicates again after extraction
        .filter((item, index, array) => array.indexOf(item) === index)

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">Payment Management</h1>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Bank Details</TableHead>
                            <TableHead>Last Payment</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Remarks / Month</TableHead>
                            <TableHead>Currency</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employeesWithLastPayment.map((employee: any) => (
                            <PaymentRow
                                key={employee.id}
                                employee={employee}
                                lastPayment={employee.lastPayment}
                                lastSalaryPayment={employee.lastSalaryPayment}
                                lastBonusPayment={employee.lastBonusPayment}
                                commonRemarks={commonRemarks}
                            />
                        ))}
                        {employees.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                                    No employees with banking information found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>


        </div>
    )
}
