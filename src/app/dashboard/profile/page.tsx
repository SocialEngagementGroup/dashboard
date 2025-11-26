import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { User, Mail, Briefcase, Users, Phone, MapPin, AlertCircle } from "lucide-react"

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.id) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { manager: true }
    })

    if (!user) return null

    return (
        <div className="flex flex-col gap-6 fade-in">
            {/* Profile Header */}
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            {user.name?.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                {user.name}
                            </h1>
                            <p className="text-muted-foreground mt-1 flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                {user.role}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                    <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    Full Name
                                </Label>
                                <Input value={user.name || ''} readOnly className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </Label>
                                <Input value={user.email || ''} readOnly className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-muted-foreground">
                                    <Briefcase className="h-4 w-4" />
                                    Role
                                </Label>
                                <Input value={user.role} readOnly className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    Reporting Manager
                                </Label>
                                <Input value={user.manager?.name || 'None'} readOnly className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Contact Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    Phone
                                </Label>
                                <Input value={user.phone || ''} readOnly className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    Address
                                </Label>
                                <Input value={user.address || ''} readOnly className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-muted-foreground">
                                    <AlertCircle className="h-4 w-4" />
                                    Emergency Contact
                                </Label>
                                <Input value={user.emergencyContact || ''} readOnly className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>

                </div>
            </div>
        </div>
    )
}
