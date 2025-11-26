"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EmployeeForm } from "./employee-form"
import { Plus } from "lucide-react"
import { User } from "@prisma/client"

type AddEmployeeModalProps = {
    managers: User[]
}

export function AddEmployeeModal({ managers }: AddEmployeeModalProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Employee
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <EmployeeForm managers={managers} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
