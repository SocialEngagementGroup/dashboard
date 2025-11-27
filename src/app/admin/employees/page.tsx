import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AddEmployeeModal } from "@/components/admin/add-employee-modal"
import { Eye } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function EmployeesPage() {
    const employees = await prisma.user.findMany({
        orderBy: { name: 'asc' },
        include: { manager: true }
    })

    const managers = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Employees</h1>
                <AddEmployeeModal managers={managers} />
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Manager</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/admin/employees/${employee.id}/view`}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                                    >
                                        {employee.name || 'N/A'}
                                    </Link>
                                </TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.role}</TableCell>
                                <TableCell>{employee.manager?.name || '-'}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/employees/${employee.id}/view`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/employees/${employee.id}`}>Edit</Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {employees.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No employees found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
