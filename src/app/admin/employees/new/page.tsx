import { EmployeeForm } from "@/components/admin/employee-form"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function NewEmployeePage() {
    const managers = await prisma.user.findMany({
        where: { role: "ADMIN" }, // Assuming Admins are managers, or we can filter by specific criteria
        orderBy: { name: "asc" },
    })

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Add New Employee</h1>
            <div className="rounded-md border bg-white p-6 dark:bg-gray-900">
                <EmployeeForm managers={managers} />
            </div>
        </div>
    )
}
