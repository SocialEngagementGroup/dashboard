"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Settings } from "lucide-react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Department = {
    id: string
    name: string
    description: string | null
    order: number
}

type DepartmentManagementProps = {
    departments: Department[]
}

export function DepartmentManagement({ departments: initialDepartments }: DepartmentManagementProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
    const [formData, setFormData] = useState({ name: "", description: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/admin/departments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) throw new Error('Failed to create department')

            toast.success("Department created successfully")
            router.refresh()
            setIsAddDialogOpen(false)
            setFormData({ name: "", description: "" })
        } catch (error) {
            toast.error("Failed to create department")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedDepartment) return

        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/departments/${selectedDepartment.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) throw new Error('Failed to update department')

            toast.success("Department updated successfully")
            router.refresh()
            setIsEditDialogOpen(false)
            setSelectedDepartment(null)
            setFormData({ name: "", description: "" })
        } catch (error) {
            toast.error("Failed to update department")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedDepartment) return

        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/departments/${selectedDepartment.id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to delete department')
            }

            toast.success("Department deleted successfully")
            router.refresh()
            setIsDeleteDialogOpen(false)
            setSelectedDepartment(null)
        } catch (error: any) {
            toast.error(error.message || "Failed to delete department")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const openEditDialog = (dept: Department) => {
        setSelectedDepartment(dept)
        setFormData({ name: dept.name, description: dept.description || "" })
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (dept: Department) => {
        setSelectedDepartment(dept)
        setIsDeleteDialogOpen(true)
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Manage Departments
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Manage Departments</DialogTitle>
                        <DialogDescription>
                            Add, edit, or remove departments
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Button onClick={() => setIsAddDialogOpen(true)} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Department
                        </Button>

                        <div className="space-y-2">
                            {initialDepartments.map((dept) => (
                                <div
                                    key={dept.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div>
                                        <h4 className="font-medium">{dept.name}</h4>
                                        {dept.description && (
                                            <p className="text-sm text-muted-foreground">{dept.description}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openEditDialog(dept)}
                                        >
                                            <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => openDeleteDialog(dept)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Department Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Department</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="add-name">Department Name</Label>
                            <Input
                                id="add-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="add-description">Description (Optional)</Label>
                            <Textarea
                                id="add-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Department"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Department Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Department Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description (Optional)</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete the "{selectedDepartment?.name}" department. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
