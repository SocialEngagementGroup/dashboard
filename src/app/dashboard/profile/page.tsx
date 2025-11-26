import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'
import { BankingForm } from "@/components/dashboard/banking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.id) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { manager: true }
    })

    if (!user) return null

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">My Profile</h1>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Full Name</Label>
                                <Input value={user.name || ''} readOnly className="bg-gray-50" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input value={user.email || ''} readOnly className="bg-gray-50" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Role</Label>
                                <Input value={user.role} readOnly className="bg-gray-50" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Reporting Manager</Label>
                                <Input value={user.manager?.name || 'None'} readOnly className="bg-gray-50" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Phone</Label>
                                <Input value={user.phone || ''} readOnly className="bg-gray-50" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Address</Label>
                                <Input value={user.address || ''} readOnly className="bg-gray-50" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Emergency Contact</Label>
                                <Input value={user.emergencyContact || ''} readOnly className="bg-gray-50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Banking Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BankingForm user={user} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
