"use client"

import { useFormState } from "react-dom"
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


type EmployeeFormProps = {
    employee?: User
    managers: User[]
}

export function EmployeeForm({ employee, managers }: EmployeeFormProps) {
    const initialState: EmployeeFormState = { message: undefined, errors: {} }
    const [state, dispatch] = useFormState(
        employee ? updateEmployee.bind(null, employee.id) : createEmployee,
        initialState
    )

    return (
        <form action={dispatch} className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
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
                        <Label htmlFor="image">Profile Image</Label>
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                        />
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
                    <div className="space-y-2">
                        <Label htmlFor="personalEmail">Personal Email</Label>
                        <Input
                            id="personalEmail"
                            name="personalEmail"
                            type="email"
                            defaultValue={employee?.personalEmail || ""}
                            placeholder="john@gmail.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                            id="dob"
                            name="dob"
                            type="date"
                            defaultValue={employee?.dob ? new Date(employee.dob).toISOString().split('T')[0] : ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select name="bloodGroup" defaultValue={employee?.bloodGroup || ""}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nationalId">National ID</Label>
                        <Input
                            id="nationalId"
                            name="nationalId"
                            defaultValue={employee?.nationalId || ""}
                            placeholder="National ID Number"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select name="role" defaultValue={employee?.role || "EMPLOYEE"}>
                            <SelectTrigger>
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
                            <SelectTrigger>
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
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            defaultValue={employee?.phone || ""}
                            placeholder="+1 234 567 890"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                            id="emergencyContact"
                            name="emergencyContact"
                            defaultValue={employee?.emergencyContact || ""}
                            placeholder="Jane Doe: +1 987 654 321"
                        />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            defaultValue={employee?.address || ""}
                            placeholder="123 Main St, City, Country"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Banking Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                            id="bankName"
                            name="bankName"
                            defaultValue={employee?.bankName || ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="branchName">Branch Name</Label>
                        <Input
                            id="branchName"
                            name="branchName"
                            defaultValue={employee?.branchName || ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bankAccountName">Account Holder Name</Label>
                        <Input
                            id="bankAccountName"
                            name="bankAccountName"
                            defaultValue={employee?.bankAccountName || ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                            id="accountNumber"
                            name="accountNumber"
                            defaultValue={employee?.accountNumber || ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accountType">Account Type</Label>
                        <Select name="accountType" defaultValue={employee?.accountType || ""}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SAVINGS">Savings</SelectItem>
                                <SelectItem value="CURRENT">Current</SelectItem>
                                <SelectItem value="SALARY">Salary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="routingNumber">Routing Number</Label>
                        <Input
                            id="routingNumber"
                            name="routingNumber"
                            defaultValue={employee?.routingNumber || ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="swiftCode">SWIFT Code</Label>
                        <Input
                            id="swiftCode"
                            name="swiftCode"
                            defaultValue={employee?.swiftCode || ""}
                        />
                    </div>
                </div>
            </div>

            {state?.message && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}

            <div className="flex justify-end gap-4">
                <Button type="submit">
                    {employee ? "Update Employee" : "Create Employee"}
                </Button>
            </div>
        </form>
    )
}
