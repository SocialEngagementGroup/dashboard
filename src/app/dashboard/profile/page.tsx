```typescript
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
    CreditCard,
    Building,
    Heart,
    Flag,
    Fingerprint,
    Users,
    Shield,
    Droplet,
    Globe,
    Hash,
    Building2,
    Home,
    UserCheck,
    CalendarDays,
    BadgeCheck
} from "lucide-react"
import { ProfilePhotoUpload } from "@/components/dashboard/profile-photo-upload"
import { ProfileEditForm } from "@/components/dashboard/profile-edit-form"
import Link from "next/link"

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user) return null

    // Try to find user by ID first, then by email as fallback
    let user: (PrismaUser & { manager: PrismaUser | null }) | null = null
    if (session.user.id) {
        user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { manager: true }
        })
    }

    if (!user && session.user.email) {
        user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { manager: true }
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
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white dark:bg-gray-950 p-6 rounded-xl border shadow-sm">
                <ProfilePhotoUpload user={user} />

                <div className="flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Profile Management
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
                        <Badge className={user.role === 'ADMIN' ? 'bg-purple-500' : 'bg-blue-500'}>
                            {user.role}
                        </Badge>
                    </div>
                </div>
            </div>

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
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <User className="h-3 w-3" /> Full Name
                                </p>
                                <p className="font-medium">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <CalendarDays className="h-3 w-3" /> Date of Birth
                                </p>
                                <p className="font-medium">{formatDate(user.dob)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <User className="h-3 w-3" /> Gender
                                </p>
                                <p className="font-medium">{user.gender || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <Droplet className="h-3 w-3" /> Blood Group
                                </p>
                                <p className="font-medium text-red-500 font-bold">{user.bloodGroup || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <Heart className="h-3 w-3" /> Marital Status
                                </p>
                                <p className="font-medium">{user.maritalStatus || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <Globe className="h-3 w-3" /> Nationality
                                </p>
                                <div className="flex items-center gap-1">
                                    <p className="font-medium">{user.nationality || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <Fingerprint className="h-3 w-3" /> National ID (NID)
                                </p>
                                <div className="flex items-center gap-1">
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
                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Personal Email</p>
                                    <p className="font-medium">{user.personalEmail || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone Number</p>
                                    <p className="font-medium">{user.phone || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Present Address</p>
                                    <p className="font-medium text-sm">{user.presentAddress || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
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
                        {user.emergencyContactName ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900">
                                    <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{user.emergencyContactName}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Heart className="h-3 w-3" /> {user.emergencyContactRelation}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{user.emergencyContactPhone}</span>
                                </div>
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
                            <div className="col-span-2">
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <Mail className="h-3 w-3" /> Official Email
                                </p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <Hash className="h-3 w-3" /> Employee ID
                                </p>
                                <p className="font-medium">{user.employeeId || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <Calendar className="h-3 w-3" /> Joining Date
                                </p>
                                <p className="font-medium">{formatDate(user.joiningDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <Briefcase className="h-3 w-3" /> Designation
                                </p>
                                <p className="font-medium">{user.designation || user.role}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <Building className="h-3 w-3" /> Department
                                </p>
                                <p className="font-medium">{user.department || 'General'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <UserCheck className="h-3 w-3" /> Reporting Manager
                                </p>
                                {user.manager ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold">
                                            {user.manager.name?.charAt(0) || 'M'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{user.manager.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.manager.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="font-medium">None</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Banking Information Summary */}
                <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow duration-200 md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-orange-500" />
                            Banking Information
                        </CardTitle>
                        <Link href="/dashboard/salary" className="text-sm text-blue-500 hover:underline">
                            View Full Details &rarr;
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <Building2 className="h-3 w-3" /> Bank Name
                                </p>
                                <p className="font-medium">{user.bankName || 'Not set'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <CreditCard className="h-3 w-3" /> Account Number
                                </p>
                                <p className="font-medium font-mono">
                                    {user.accountNumber ? `•••• ${ user.accountNumber.slice(-4) } ` : 'Not set'}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <BadgeCheck className="h-3 w-3" /> Status
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Shield className="h-4 w-4 text-green-500" />
                                    <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
