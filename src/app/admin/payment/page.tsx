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
            // Only show employees who have at least some banking information
            OR: [
                { accountNumber: { not: null } },
                { bankName: { not: null } },
            ]
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

    // Fetch last payment for each employee
    const employeesWithLastPayment = await Promise.all(
        employees.map(async (employee) => {
            const lastDocument = await prisma.document.findFirst({
                where: {
                    userId: employee.id,
                    type: 'SALARY_SLIP',
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            let lastPayment = null
            if (lastDocument) {
                // Extract payment details from document title
                // Expected format: "Salary Slip - October 2025" or "Bonus - October 2025"
                const titleMatch = lastDocument.title.match(/(Salary|Bonus).*?([A-Z][a-z]+ \d{4})/)
                if (titleMatch) {
                    lastPayment = {
                        type: titleMatch[1],
                        month: titleMatch[2],
                        amount: 50000, // Placeholder since we don't store amount yet
                        currency: 'BDT' // Placeholder since we don't store currency yet
                    }
                }
            }

            return {
                ...employee,
                lastPayment
            }
        })
    )

    // Get current date for previous month calculation
    const now = new Date()
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const monthYear = previousMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Wallet className="h-8 w-8" />
                    Employee Payments
                </h1>
                <p className="text-muted-foreground mt-1">
                    Process salary payments for {monthYear}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Overview</CardTitle>
                    <CardDescription>
                        {employees.length} employee{employees.length !== 1 ? 's' : ''} with banking information configured
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border bg-white dark:bg-gray-900">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">Employee</TableHead>
                                    <TableHead className="w-[160px]">Status</TableHead>
                                    <TableHead className="w-[250px]">Bank Details</TableHead>
                                    <TableHead className="w-[150px]">Last Payment</TableHead>
                                    <TableHead className="w-[120px]">Type</TableHead>
                                    <TableHead className="w-[180px]">Month</TableHead>
                                    <TableHead className="w-[120px]">Currency</TableHead>
                                    <TableHead className="w-[140px]">Amount</TableHead>
                                    <TableHead className="w-[100px] text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employeesWithLastPayment.map((employee) => (
                                    <PaymentRow
                                        key={employee.id}
                                        employee={employee}
                                        lastPayment={employee.lastPayment}
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
                </CardContent>
            </Card>

            {employees.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <CardHeader>
                        <CardTitle className="text-blue-900 dark:text-blue-100">Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                        <p>• Default payment period: <strong>{monthYear}</strong></p>
                        <p>• Green indicator: Employee paid for selected month</p>
                        <p>• Orange indicator: Payment pending for selected month</p>
                        <p>• View last payment details in the dedicated column</p>
                        <p>• Click <strong>"Add"</strong> to create salary slip document</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
