"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Clock, XCircle, Wrench, ExternalLink, Eye, EyeOff, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ToolRequestForm } from "@/components/dashboard/tool-request-form"
import { useToast } from "@/hooks/use-toast"

interface Tool {
    id: string
    name: string
    url: string
    description?: string | null
    image?: string | null
    email?: string | null
    password?: string | null
    requestStatus: string | null
    requestId: string | null
}

interface ToolRequest {
    id: string
    name: string
    url: string
    description: string | null
    status: string
    createdAt: Date
}

interface EmployeeToolsClientProps {
    initialTools: Tool[]
    initialRequests: ToolRequest[]
}

export function EmployeeToolsClient({ initialTools, initialRequests }: EmployeeToolsClientProps) {
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const { toast } = useToast()

    const approvedTools = initialTools.filter(tool => tool.requestStatus === "APPROVED")
    const approvedCount = initialRequests.filter(r => r.status === "APPROVED").length
    const pendingCount = initialRequests.filter(r => r.status === "PENDING").length
    const rejectedCount = initialRequests.filter(r => r.status === "REJECTED").length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
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

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Request Form */}
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

                {/* Right Column - Available Tools & Requests */}
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
                                        <div
                                            key={tool.id}
                                            className="group border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md h-full"
                                        >
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-base truncate">
                                                            {tool.name}
                                                        </h3>
                                                        {tool.description && (
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                {tool.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Badge className="bg-green-500 shrink-0">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Approved
                                                    </Badge>
                                                </div>
                                                <Link
                                                    href={tool.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1 truncate"
                                                >
                                                    {tool.url}
                                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                                </Link>
                                                <Button
                                                    className="w-full"
                                                    onClick={() => {
                                                        setSelectedTool(tool)
                                                        setShowPassword(false)
                                                    }}
                                                >
                                                    <Lock className="mr-2 h-4 w-4" /> View Credentials
                                                </Button>
                                            </div>
                                        </div>
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
                                        {initialRequests.map((request) => (
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
                                        {initialRequests.length === 0 && (
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

            {/* Credentials Modal */}
            <Dialog open={!!selectedTool} onOpenChange={(open) => !open && setSelectedTool(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Credentials for {selectedTool?.name}</DialogTitle>
                        <DialogDescription>
                            Use these credentials to log in to the tool.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email / Username
                            </label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={selectedTool?.email || "N/A"}
                                    readOnly
                                    className="bg-muted"
                                />
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => {
                                        navigator.clipboard.writeText(selectedTool?.email || "")
                                        toast({ description: "Copied to clipboard" })
                                    }}
                                >
                                    <span className="sr-only">Copy</span>
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006V2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00006H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006L2.5 1.00006C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50006C5 4.67163 5.67157 4.00006 6.5 4.00006H12.5C13.3284 4.00006 14 4.67163 14 5.50006V12.5001C14 13.3285 13.3284 14.0001 12.5 14.0001H6.5C5.67157 14.0001 5 13.3285 5 12.5001V5.50006ZM6.5 5.00006H12.5C12.7761 5.00006 13 5.22392 13 5.50006V12.5001C13 12.7762 12.7761 13.0001 12.5 13.0001H6.5C6.22386 13.0001 6 12.7762 6 12.5001V5.50006C6 5.22392 6.22386 5.00006 6.5 5.00006Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Password
                            </label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={selectedTool?.password || ""}
                                    readOnly
                                    className="bg-muted"
                                />
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => {
                                        navigator.clipboard.writeText(selectedTool?.password || "")
                                        toast({ description: "Copied to clipboard" })
                                    }}
                                >
                                    <span className="sr-only">Copy</span>
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006V2.50006C2 2.22392 2.22386 2.00006 2.5 2 00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00006H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006L2.5 1.00006C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50006C5 4.67163 5.67157 4.00006 6.5 4.00006H12.5C13.3284 4.00006 14 4.67163 14 5.50006V12.5001C14 13.3285 13.3284 14.0001 12.5 14.0001H6.5C5.67157 14.0001 5 13.3285 5 12.5001V5.50006ZM6.5 5.00006H12.5C12.7761 5.00006 13 5.22392 13 5.50006V12.5001C13 12.7762 12.7761 13.0001 12.5 13.0001H6.5C6.22386 13.0001 6 12.7762 6 12.5001V5.50006C6 5.22392 6.22386 5.00006 6.5 5.00006Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </Button>
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <a href={selectedTool?.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Go to Login Page
                            </a>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
