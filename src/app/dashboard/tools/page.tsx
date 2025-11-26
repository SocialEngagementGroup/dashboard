import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'
import { ToolRequestForm } from "@/components/dashboard/tool-request-form"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

export default async function ToolsPage() {
    const session = await auth()
    if (!session?.user) return null

    // Use session.user.id for queries, falling back to email if needed
    const userId = session.user.id || session.user.email

    // Fetch approved tools (visible to all)
    const approvedTools = await prisma.tool.findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' }
    })

    // Fetch user's own requests
    const myRequests = await prisma.tool.findMany({
        where: { requestedById: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    const pendingCount = myRequests.filter(r => r.status === 'PENDING').length
    const approvedCount = myRequests.filter(r => r.status === 'APPROVED').length
    const rejectedCount = myRequests.filter(r => r.status === 'REJECTED').length

    return (
        <div className="flex flex-col gap-6 fade-in">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Tools Management
                </h1>
                <p className="text-muted-foreground mt-1">Access subscribed tools and request new ones</p>
            </div>

            {/* Request Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvedCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requests approved</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{rejectedCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Not approved</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="h-5 w-5" />
                                Request New Tool
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ToolRequestForm />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {/* Available Tools */}
                    <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="h-5 w-5" />
                                Available Tools
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {approvedTools.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground py-12">
                                    <Wrench className="h-12 w-12 text-gray-300" />
                                    <p className="text-sm">No tools available yet.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {approvedTools.map((tool) => (
                                        <Link
                                            key={tool.id}
                                            href={tool.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group"
                                        >
                                            <div className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md h-full">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
                                                            {tool.name}
                                                        </h3>
                                                        {tool.description && (
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                {tool.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* My Requests */}
                    <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="h-5 w-5" />
                                My Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tool Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {myRequests.map((request) => (
                                            <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <TableCell className="font-medium">{request.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        request.status === 'APPROVED' ? 'default' :
                                                            request.status === 'REJECTED' ? 'destructive' : 'secondary'
                                                    } className="font-medium">
                                                        {request.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {myRequests.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center h-32">
                                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                        <Wrench className="h-12 w-12 text-gray-300" />
                                                        <p className="text-sm">No requests yet.</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
