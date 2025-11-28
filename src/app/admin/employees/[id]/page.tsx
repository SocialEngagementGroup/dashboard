import { EmployeeForm } from "@/components/admin/employee-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

import { DocumentUpload } from "@/components/admin/document-upload"

export const dynamic = 'force-dynamic'

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const employee = await prisma.user.findUnique({
        where: { id },
        include: { documents: true }
    })

    if (!employee) {
        notFound()
    }

    const managers = await prisma.user.findMany({
        where: {
            role: "ADMIN",
            id: { not: employee.id }
        },
        orderBy: { name: "asc" },
    })

    const departments = await prisma.department.findMany({
        orderBy: { order: 'asc' }
    })

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Edit Employee</h1>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-md border bg-white p-6 dark:bg-gray-900">
                    <h2 className="mb-4 text-xl font-semibold">Profile Details</h2>
                    <EmployeeForm employee={employee} managers={managers} departments={departments} />
                </div>

                <div className="rounded-md border bg-white p-6 dark:bg-gray-900">
                    <h2 className="mb-4 text-xl font-semibold">Documents</h2>
                    <DocumentUpload userId={employee.id} documents={employee.documents} />
                </div>
            </div>
        </div>
    )
}
