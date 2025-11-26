"use client"

import { useActionState } from "react"
import { createEmployee, updateEmployee, EmployeeFormState } from "@/lib/actions/employee"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { User } from "@prisma/client"
import Link from "next/link"


type EmployeeFormProps = {
    employee?: User
    managers: User[]
    onSuccess?: () => void
}

export function EmployeeForm({ employee, managers, onSuccess }: EmployeeFormProps) {
    const initialState: EmployeeFormState = { message: undefined, errors: {} }
    const [state, dispatch, isPending] = useActionState(
        employee ? updateEmployee.bind(null, employee.id) : createEmployee,
        initialState
    )

    return (
        <form action={dispatch} className="space-y-6 max-w-2xl">
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Employee Details</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={employee?.name || ""}
                                placeholder="John Doe"
                                required
                            />
                            {state?.errors?.name && (
                                <p className="text-sm text-red-500">{state.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={employee?.email || ""}
                                placeholder="john@company.com"
                                required
                            />
                            {state?.errors?.email && (
                                <p className="text-sm text-red-500">{state.errors.email}</p>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select name="role" defaultValue={employee?.role || "EMPLOYEE"}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EMPLOYEE">Employee</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="managerId">Reporting Manager</Label>
                                <Select name="managerId" defaultValue={employee?.managerId || ""}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {managers.map((manager) => (
                                            <SelectItem key={manager.id} value={manager.id}>
                                                {manager.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-medium">Professional Details</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="designation">Designation</Label>
                                    <Input
                                        id="designation"
                                        name="designation"
                                        defaultValue={employee?.designation || ""}
                                        placeholder="Software Engineer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        name="department"
                                        defaultValue={employee?.department || ""}
                                        placeholder="Engineering"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="employeeId">Employee ID</Label>
                                    <Input
                                        id="employeeId"
                                        name="employeeId"
                                        defaultValue={employee?.employeeId || ""}
                                        placeholder="EMP-001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="joiningDate">Joining Date</Label>
                                    <Input
                                        id="joiningDate"
                                        name="joiningDate"
                                        type="date"
                                        defaultValue={employee?.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : ""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {state?.message && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}

            <div className="flex justify-end gap-2">
                {!onSuccess && (
                    <Link href="/admin/employees">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                )}
                <Button type="submit" disabled={isPending}>
                    {isPending && <span className="mr-2">⏳</span>}
                    {employee ? "Save Changes" : "Create Employee"}
                </Button>
            </div>
        </form>
    )
}
