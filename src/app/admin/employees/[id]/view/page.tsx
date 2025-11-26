import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ViewEmployeePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const employee = await prisma.user.findUnique({
        where: { id },
        include: {
            manager: true,
            emergencyContacts: true
        }
    })

    if (!employee) {
        notFound()
    }

    const formatDate = (date: Date | null) => {
        if (!date) return 'Not set'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="flex flex-col gap-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/employees">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">Employee Details</h1>
                    <p className="text-muted-foreground">Comprehensive employee information</p>
                </div>
                <Link href={`/admin/employees/${employee.id}`}>
                    <Button>Edit Employee</Button>
                </Link>
            </div>

            {/* Employee Header Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {employee.image && (
                                <img
                                    src={employee.image}
                                    alt={employee.name || 'Employee'}
                                    className="h-20 w-20 rounded-full object-cover border-4 border-white dark:border-gray-800"
                                />
                            )}
                            <div>
                                <h2 className="text-2xl font-bold">{employee.name}</h2>
                                <p className="text-muted-foreground">{employee.email}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {employee.designation || employee.role} • {employee.department || 'General'}
                                </p>
                            </div>
                        </div>
                        <Badge variant={employee.role === 'ADMIN' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
                            {employee.role}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Bio Section */}
            {employee.bio && (
                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{employee.bio}</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Professional Details */}
                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Professional Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Employee ID</p>
                            <p className="font-medium">{employee.employeeId || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Designation</p>
                            <p className="font-medium">{employee.designation || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Department</p>
                            <p className="font-medium">{employee.department || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Joining Date</p>
                            <p className="font-medium">{formatDate(employee.joiningDate)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Reporting Manager</p>
                            <p className="font-medium">{employee.manager?.name || 'None'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Date of Birth</p>
                            <p className="font-medium">{formatDate(employee.dob)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Blood Group</p>
                            <p className="font-medium text-red-500 font-bold">{employee.bloodGroup || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">National ID</p>
                            <p className="font-medium font-mono">{employee.nationalId || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Gender</p>
                            <p className="font-medium">{employee.gender || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Marital Status</p>
                            <p className="font-medium">{employee.maritalStatus || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Nationality</p>
                            <p className="font-medium">{employee.nationality || 'Not set'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{employee.phone || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Personal Email</p>
                            <p className="font-medium">{employee.personalEmail || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Present Address</p>
                            <p className="font-medium text-sm">{employee.presentAddress || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Permanent Address</p>
                            <p className="font-medium text-sm">{employee.permanentAddress || 'Not set'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contacts */}
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader>
                        <CardTitle>Emergency Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {employee.emergencyContacts && employee.emergencyContacts.length > 0 ? (
                            <div className="space-y-3">
                                {employee.emergencyContacts.map((contact: any) => (
                                    <div key={contact.id} className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900">
                                        <p className="font-bold">{contact.name}</p>
                                        <p className="text-sm text-muted-foreground">{contact.relation}</p>
                                        <p className="text-sm font-medium mt-1">{contact.phone}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">No emergency contacts set</p>
                        )}
                    </CardContent>
                </Card>

                {/* Banking Information */}
                <Card className="border-l-4 border-l-amber-500 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Banking Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Bank Name</p>
                                <p className="font-medium">{employee.bankName || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Branch Name</p>
                                <p className="font-medium">{employee.branchName || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Account Name</p>
                                <p className="font-medium">{employee.bankAccountName || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Account Number</p>
                                <p className="font-medium font-mono">{employee.accountNumber || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Account Type</p>
                                <p className="font-medium">{employee.accountType || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Routing Number</p>
                                <p className="font-medium font-mono">{employee.routingNumber || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">SWIFT Code</p>
                                <p className="font-medium font-mono">{employee.swiftCode || 'Not set'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
