import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Wallet, User, Phone, MapPin, Building2, CreditCard, Calendar, Users, FileText, Mail, Hash, Home } from "lucide-react"
import { SalaryHistoryTable } from "@/components/dashboard/salary-history-table"
import { LeaveHistoryTab } from "@/components/dashboard/leave-history-tab"

export const dynamic = 'force-dynamic'

export default async function ViewEmployeePage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ tab?: string }>
}) {
    const { id } = await params
    const { tab } = await searchParams
    const employee = await prisma.user.findUnique({
        where: { id },
        include: {
            manager: true,
            emergencyContacts: true,
            documents: {
                where: { type: 'SALARY_SLIP' },
                orderBy: { createdAt: 'desc' },
            },
            leaveRequests: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!employee) {
        notFound()
    }

    const formatDate = (date: Date | null) => {
        if (!date) return '-'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Compact Header */}
            <div className="flex items-start justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/employees">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        {employee.image ? (
                            <img
                                src={employee.image}
                                alt={employee.name || 'Employee'}
                                className="h-12 w-12 rounded-full object-cover border border-border"
                            />
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border border-border">
                                <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold">{employee.name}</h1>
                                <Badge variant="secondary" className="text-xs px-2 py-0.5 h-5">
                                    {employee.designation || employee.role}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {employee.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Link href={`/admin/employees/${employee.id}`}>
                    <Button size="sm" variant="outline">Edit Profile</Button>
                </Link>
            </div>

            {/* Main Content */}
            <Tabs defaultValue={tab || "overview"} className="w-full space-y-4">
                <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                    <TabsTrigger
                        value="overview"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="payments"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                    >
                        Payments
                    </TabsTrigger>
                    <TabsTrigger
                        value="documents"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                    >
                        Documents
                    </TabsTrigger>
                    <TabsTrigger
                        value="leaves"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                    >
                        Leaves
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 pt-2">
                    <div className="grid gap-4 md:grid-cols-3">
                        {/* Left Column: Professional & Personal */}
                        <div className="md:col-span-2 space-y-4">
                            {/* Bio */}
                            {employee.bio && (
                                <Card className="shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base font-medium">About</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{employee.bio}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Professional Details */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-medium flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        Professional Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-3 gap-4 text-sm">
                                    {/* Row 1 */}
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Employee ID</p>
                                        <p className="font-medium">{employee.employeeId || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Designation</p>
                                        <p className="font-medium">{employee.designation || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Reporting Manager(s)</p>
                                        <div className="flex items-center gap-2">
                                            {employee.manager ? (
                                                <>
                                                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium">
                                                        {employee.manager.name?.[0]}
                                                    </div>
                                                    <span className="font-medium truncate">{employee.manager.name}</span>
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Joining Date</p>
                                        <p className="font-medium">{formatDate(employee.joiningDate)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Department</p>
                                        <p className="font-medium">{employee.department || '-'}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Banking Information */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-medium flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        Banking Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Bank Name</p>
                                        <p className="font-medium">{employee.bankName || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Account Number</p>
                                        <p className="font-medium font-mono">{employee.accountNumber || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Account Name</p>
                                        <p className="font-medium">{employee.bankAccountName || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Branch</p>
                                        <p className="font-medium">{employee.branchName || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Routing No</p>
                                        <p className="font-medium font-mono">{employee.routingNumber || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">SWIFT</p>
                                        <p className="font-medium font-mono">{employee.swiftCode || '-'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Personal & Contact */}
                        <div className="space-y-4">
                            {/* Contact Info */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-medium flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        Contact Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Phone Number</p>
                                            <p className="font-medium">{employee.phone || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <div className="overflow-hidden">
                                            <p className="text-xs text-muted-foreground">Personal Email</p>
                                            <p className="font-medium truncate">{employee.personalEmail || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Present Address</p>
                                            <p className="font-medium">{employee.presentAddress || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Home className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Permanent Address</p>
                                            <p className="font-medium">{employee.permanentAddress || '-'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Personal Details */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-medium flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Personal Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">DOB</p>
                                            <p className="font-medium">{formatDate(employee.dob)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Blood Group</p>
                                            <p className="font-medium text-red-600">{employee.bloodGroup || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Gender</p>
                                            <p className="font-medium">{employee.gender || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Marital Status</p>
                                            <p className="font-medium">{employee.maritalStatus || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Nationality</p>
                                            <p className="font-medium">{employee.nationality || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">National ID</p>
                                            <p className="font-medium font-mono">{employee.nationalId || '-'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Emergency Contacts */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-medium flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        Emergency Contacts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {employee.emergencyContacts && employee.emergencyContacts.length > 0 ? (
                                        employee.emergencyContacts.map((contact: any) => (
                                            <div key={contact.id} className="flex items-start gap-3 p-2 rounded bg-muted/50">
                                                <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                                    <Phone className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{contact.name}</p>
                                                    <p className="text-xs text-muted-foreground">{contact.relation} • {contact.phone}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No contacts set</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Payments Tab */}
                <TabsContent value="payments" className="pt-2">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">Payment History</CardTitle>
                            <CardDescription>Recent salary and bonus payments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SalaryHistoryTable documents={employee.documents} isAdmin={true} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="pt-2">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">Documents</CardTitle>
                            <CardDescription>Employee related documents</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {employee.documents && employee.documents.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {employee.documents.map((doc: any) => (
                                        <div key={doc.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                            <div className="h-10 w-10 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium truncate">{doc.title}</p>
                                                <p className="text-xs text-muted-foreground">{doc.type}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{formatDate(doc.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground">No documents uploaded</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Leaves Tab */}
                <TabsContent value="leaves" className="pt-2">
                    <LeaveHistoryTab leaveRequests={employee.leaveRequests} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
