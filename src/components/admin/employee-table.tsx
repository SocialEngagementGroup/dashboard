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
import { Eye } from "lucide-react"

export async function EmployeeTable() {
    const employees = await prisma.user.findMany({
        orderBy: { name: 'asc' },
        include: { manager: true }
    })

    return (
        <div className="rounded-md border bg-white dark:bg-gray-900 slide-up">
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
                    {employees.map((employee: any) => (
                        <TableRow key={employee.id}>
                            <TableCell>
                                <div className="flex flex-col">
                                    <Link
                                        href={`/admin/employees/${employee.id}/view`}
                                        className="font-medium hover:underline text-primary"
                                    >
                                        {employee.name || 'N/A'}
                                    </Link>
                                    <span className="text-xs text-muted-foreground">
                                        {employee.designation || employee.role}
                                    </span>
                                </div>
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
    )
}
