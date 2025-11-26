"use client"

import { useState } from "react"
import { User, EmergencyContact } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateProfile } from "@/app/actions/profile"
import { Pencil, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

type UserWithRelations = User & {
    emergencyContacts: EmergencyContact[]
}

export function ProfileEditForm({ user }: { user: UserWithRelations }) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [contacts, setContacts] = useState<Partial<EmergencyContact>[]>(
        user.emergencyContacts?.length > 0
            ? user.emergencyContacts
            : [{ name: "", phone: "", relation: "" }]
    )

    const handleAddContact = () => {
        setContacts([...contacts, { name: "", phone: "", relation: "" }])
    }

    const handleRemoveContact = (index: number) => {
        const newContacts = [...contacts]
        newContacts.splice(index, 1)
        setContacts(newContacts)
    }

    const handleContactChange = (index: number, field: keyof EmergencyContact, value: string) => {
        const newContacts = [...contacts]
        newContacts[index] = { ...newContacts[index], [field]: value }
        setContacts(newContacts)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        // Filter out empty contacts and ensure types
        const validContacts = contacts
            .filter(c => c.name && c.phone && c.relation)
            .map(c => ({
                name: c.name!,
                phone: c.phone!,
                relation: c.relation!
            }))

        const result = await updateProfile({
            name: data.name as string,

            dob: data.dob as string,
            gender: data.gender as string,
            bloodGroup: data.bloodGroup as string,
            maritalStatus: data.maritalStatus as string,
            nationality: data.nationality as string,
            nationalId: data.nationalId as string,
            phone: data.phone as string,
            personalEmail: data.personalEmail as string,
            presentAddress: data.presentAddress as string,
            permanentAddress: data.permanentAddress as string,
            emergencyContacts: validContacts,
        })

        setIsLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Profile updated successfully")
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your personal and contact information.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="personal">Personal</TabsTrigger>
                            <TabsTrigger value="contact">Contact</TabsTrigger>
                            <TabsTrigger value="emergency">Emergency</TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal" className="space-y-4 py-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" defaultValue={user.name || ""} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <Input
                                            id="dob"
                                            name="dob"
                                            type="date"
                                            defaultValue={user.dob ? new Date(user.dob).toISOString().split('T')[0] : ""}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select name="gender" defaultValue={user.gender || ""}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bloodGroup">Blood Group</Label>
                                        <Select name="bloodGroup" defaultValue={user.bloodGroup || ""}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select blood group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maritalStatus">Marital Status</Label>
                                        <Select name="maritalStatus" defaultValue={user.maritalStatus || ""}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Single">Single</SelectItem>
                                                <SelectItem value="Married">Married</SelectItem>
                                                <SelectItem value="Divorced">Divorced</SelectItem>
                                                <SelectItem value="Widowed">Widowed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationality">Nationality</Label>
                                    <Input id="nationality" name="nationality" defaultValue={user.nationality || ""} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationalId">National ID (NID)</Label>
                                    <Input id="nationalId" name="nationalId" defaultValue={user.nationalId || ""} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="contact" className="space-y-4 py-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone" defaultValue={user.phone || ""} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="personalEmail">Personal Email</Label>
                                    <Input id="personalEmail" name="personalEmail" type="email" defaultValue={user.personalEmail || ""} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="presentAddress">Present Address</Label>
                                    <Textarea id="presentAddress" name="presentAddress" defaultValue={user.presentAddress || ""} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="permanentAddress">Permanent Address</Label>
                                    <Textarea id="permanentAddress" name="permanentAddress" defaultValue={user.permanentAddress || ""} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="emergency" className="space-y-4 py-4">
                            <div className="space-y-4">
                                {contacts.map((contact, index) => (
                                    <div key={index} className="p-4 border rounded-lg space-y-4 relative bg-gray-50 dark:bg-gray-900/50">
                                        <div className="absolute right-2 top-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                                                onClick={() => handleRemoveContact(index)}
                                                disabled={contacts.length === 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Contact Name</Label>
                                            <Input
                                                value={contact.name || ""}
                                                onChange={(e) => handleContactChange(index, "name", e.target.value)}
                                                placeholder="Full Name"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Phone Number</Label>
                                                <Input
                                                    value={contact.phone || ""}
                                                    onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                                                    placeholder="+1234567890"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Relationship</Label>
                                                <Input
                                                    value={contact.relation || ""}
                                                    onChange={(e) => handleContactChange(index, "relation", e.target.value)}
                                                    placeholder="Spouse, Parent, etc."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full border-dashed"
                                    onClick={handleAddContact}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Emergency Contact
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
