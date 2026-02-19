import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { AddEmployeeModal } from "@/components/admin/add-employee-modal"
import { EmployeeTable } from "@/components/admin/employee-table"
import { EmployeeTableSkeleton } from "@/components/admin/employee-table-skeleton"

export const dynamic = 'force-dynamic'

export default async function EmployeesPage() {
    // Fetch modal data concurrently
    const [managers, departments] = await Promise.all([
        prisma.user.findMany({
            where: { role: 'ADMIN' },
            orderBy: { name: 'asc' }
        }),
        prisma.department.findMany({
            orderBy: { order: 'asc' }
        })
    ])

    return (
        <div className="flex flex-col gap-6 fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Employees</h1>
                <AddEmployeeModal managers={managers} departments={departments} />
            </div>

            <Suspense fallback={<EmployeeTableSkeleton />}>
                <EmployeeTable />
            </Suspense>
        </div>
    )
}
