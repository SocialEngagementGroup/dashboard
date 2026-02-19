"use client"

import { useActionState, useState } from "react"
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
// import { User, Department } from "@prisma/client"
import Link from "next/link"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"




type EmployeeFormProps = {
    employee?: any
    managers: any[]
    departments: any[]
    onSuccess?: () => void
}

export function EmployeeForm({ employee, managers, departments, onSuccess }: EmployeeFormProps) {
    const router = useRouter()
    const initialState: EmployeeFormState = { message: undefined, errors: {} }
    const [state, dispatch, isPending] = useActionState(
        employee ? updateEmployee.bind(null, employee.id) : createEmployee,
        initialState
    )

    const [selectedDepartment, setSelectedDepartment] = useState(employee?.department || "")
    const [selectedRole, setSelectedRole] = useState(employee?.role || "EMPLOYEE")
    const [isNewDeptDialogOpen, setIsNewDeptDialogOpen] = useState(false)
    const [newDeptName, setNewDeptName] = useState("")
    const [isCreatingDept, setIsCreatingDept] = useState(false)

    const handleCreateDepartment = async () => {
        if (!newDeptName.trim()) return

        setIsCreatingDept(true)
        try {
            const response = await fetch('/api/admin/departments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newDeptName.trim() })
            })

            if (!response.ok) throw new Error('Failed to create department')

            toast.success("Department created successfully")
            setSelectedDepartment(newDeptName.trim())
            setNewDeptName("")
            setIsNewDeptDialogOpen(false)
            router.refresh()
        } catch (error) {
            toast.error("Failed to create department")
            console.error(error)
        } finally {
            setIsCreatingDept(false)
        }
    }

    return (
        <form action={dispatch} className="space-y-6 max-w-2xl">
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Employee Details</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
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
                            <Label htmlFor="email">Work Email <span className="text-red-500">*</span></Label>
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
                                <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                                <input type="hidden" name="role" value={selectedRole} />
                                <Select
                                    value={selectedRole}
                                    onValueChange={setSelectedRole}
                                >
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
                                <Label htmlFor="password">
                                    {employee ? "New Password (Leave blank to keep current)" : "Login Password"}
                                    {!employee && <span className="text-red-500"> *</span>}
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required={!employee}
                                    minLength={6}
                                />
                                {state?.errors?.password && (
                                    <p className="text-sm text-red-500">{state.errors.password[0]}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="managerId">Reporting Manager</Label>
                            <Select name="managerId" defaultValue={employee?.managerId || ""}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select manager" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {managers.map((manager: any) => (
                                        <SelectItem key={manager.id} value={manager.id}>
                                            {manager.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-medium">Professional Details</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="designation">Designation <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="designation"
                                        name="designation"
                                        defaultValue={employee?.designation || ""}
                                        placeholder="Software Engineer"
                                    />
                                    {state?.errors?.designation && (
                                        <p className="text-sm text-red-500">{state.errors.designation}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                                    <div className="flex gap-2">
                                        <input type="hidden" name="department" value={selectedDepartment} />
                                        <Select
                                            value={selectedDepartment}
                                            onValueChange={setSelectedDepartment}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept: any) => (
                                                    <SelectItem key={dept.id} value={dept.name}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Dialog open={isNewDeptDialogOpen} onOpenChange={setIsNewDeptDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button type="button" variant="outline" size="icon">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Create New Department</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 pt-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="newDeptName">Department Name</Label>
                                                        <Input
                                                            id="newDeptName"
                                                            value={newDeptName}
                                                            onChange={(e) => setNewDeptName(e.target.value)}
                                                            placeholder="e.g., Marketing"
                                                        />
                                                    </div>
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => setIsNewDeptDialogOpen(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={handleCreateDepartment}
                                                            disabled={isCreatingDept || !newDeptName.trim()}
                                                        >
                                                            {isCreatingDept && <span className="mr-2">⏳</span>}
                                                            Create
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    {state?.errors?.department && (
                                        <p className="text-sm text-red-500">{state.errors.department}</p>
                                    )}
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
