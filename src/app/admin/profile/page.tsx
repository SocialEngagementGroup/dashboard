
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { User as PrismaUser } from "@prisma/client"

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    Heart,
    Fingerprint,
    Users,
    Droplet,
    Globe,
    Hash,
    Home,
    CalendarDays,
    Building,
    UserCheck,
} from "lucide-react"
import { ProfilePhotoUpload } from "@/components/dashboard/profile-photo-upload"
import { ProfileEditForm } from "@/components/dashboard/profile-edit-form"
import { BankingSection } from "@/components/dashboard/banking-section"

export default async function AdminProfilePage() {
    const session = await auth()
    if (!session?.user) return null

    // Try to find user by ID first, then by email as fallback
    let user: (PrismaUser & { manager: PrismaUser | null, emergencyContacts: any[] }) | null = null
    if (session.user.id) {
        user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                manager: true,
                emergencyContacts: true
            }
        })
    }

    if (!user && session.user.email) {
        user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                manager: true,
                emergencyContacts: true
            }
        })
    }

    if (!user) return null

    const formatDate = (date: Date | null) => {
        if (!date) return 'Not set'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="flex flex-col gap-6 fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white dark:bg-gray-950 p-6 rounded-xl">
                <ProfilePhotoUpload user={user} />

                <div className="flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {user.name}
                            </h1>
                            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                <Briefcase className="h-4 w-4" />
                                {user.designation || user.role} • {user.department || 'General'}
                            </p>
                        </div>
                        <ProfileEditForm user={user} />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                        <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            ID: {user.employeeId || 'N/A'}
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined: {formatDate(user.joiningDate)}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Bio Section */}
            {
                user.bio && (
                    <Card className="bg-white dark:bg-gray-950">
                        <CardHeader>
                            <CardTitle className="text-lg">About</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
                        </CardContent>
                    </Card>
                )
            }

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information */}
                <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Full Name</p>
                                    <p className="font-medium">{user.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                                    <p className="font-medium">{formatDate(user.dob)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Gender</p>
                                    <p className="font-medium">{user.gender || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Droplet className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Blood Group</p>
                                    <p className="font-medium text-red-500 font-bold">{user.bloodGroup || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Heart className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Marital Status</p>
                                    <p className="font-medium">{user.maritalStatus || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Nationality</p>
                                    <p className="font-medium">{user.nationality || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="col-span-2 flex items-center gap-3">
                                <Fingerprint className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">National ID (NID)</p>
                                    <p className="font-medium font-mono">{user.nationalId || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-green-500" />
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Personal Email</p>
                                    <p className="font-medium">{user.personalEmail || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone Number</p>
                                    <p className="font-medium">{user.phone || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Present Address</p>
                                    <p className="font-medium text-sm">{user.presentAddress || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Home className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Permanent Address</p>
                                    <p className="font-medium text-sm">{user.permanentAddress || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            Emergency Contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.emergencyContacts && user.emergencyContacts.length > 0 ? (
                            <div className="space-y-4">
                                {user.emergencyContacts.map((contact: any) => (
                                    <div key={contact.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                                <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">{contact.name}</p>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Heart className="h-3 w-3" /> {contact.relation}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{contact.phone}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground">
                                <p>No emergency contact set.</p>
                                <p className="text-xs mt-1">Please update your profile to add one.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Professional Information */}
                <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-purple-500" />
                            Professional Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Official Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Hash className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Employee ID</p>
                                    <p className="font-medium">{user.employeeId || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Designation</p>
                                    <p className="font-medium">{user.designation || user.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Department</p>
                                    <p className="font-medium">{user.department || 'General'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Joining Date</p>
                                    <p className="font-medium">{formatDate(user.joiningDate)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Reporting Manager</p>
                                    {user.manager ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold">
                                                {user.manager.name?.charAt(0) || 'M'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{user.manager.name}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="font-medium">None</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Banking Information */}
                <div className="md:col-span-2">
                    <BankingSection user={user} />
                </div>
            </div>
        </div >
    )
}
