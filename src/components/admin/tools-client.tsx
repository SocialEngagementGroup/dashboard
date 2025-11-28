"use client"

import { useState } from "react"
import { Plus, Search, Check, X, Trash2, Edit } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ToolForm } from "@/components/admin/tool-form"
import { deleteTool, approveToolRequest, rejectToolRequest, approveNewToolRequest, rejectNewToolRequest } from "@/actions/tools"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Tool {
    id: string
    name: string
    url: string
    description?: string | null
    image?: string | null
    email?: string | null
    password?: string | null
    requests: ToolRequest[]
    createdAt: Date
}

interface ToolRequest {
    id: string
    userId: string
    status: string
    user: {
        name: string | null
        email: string | null
    }
    createdAt: Date
}

interface NewToolRequest {
    id: string
    name: string
    url: string
    description?: string | null
    requests: {
        id: string
        userId: string
        status: string
        user: {
            name: string | null
            email: string | null
        }
        createdAt: Date
    }[]
    createdAt: Date
}

interface ToolsClientProps {
    initialTools: Tool[]
    newToolRequests: NewToolRequest[]
}

export function ToolsClient({ initialTools, newToolRequests }: ToolsClientProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingTool, setEditingTool] = useState<Tool | undefined>(undefined)
    const [approvingNewTool, setApprovingNewTool] = useState<NewToolRequest | null>(null)
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const { toast } = useToast()
    const router = useRouter()

    const filteredTools = initialTools.filter((tool) =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pendingRequests = initialTools.flatMap((tool) =>
        tool.requests
            .filter((req) => req.status === "PENDING")
            .map((req) => ({ ...req, toolName: tool.name }))
    )

    const handleDelete = async (id: string) => {
        const result = await deleteTool(id)
        if (result.success) {
            toast({
                title: "Success",
                description: "Tool deleted successfully",
            })
            router.refresh()
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            })
        }
    }

    const handleApprove = async (requestId: string) => {
        const result = await approveToolRequest(requestId)
        if (result.success) {
            toast({
                title: "Success",
                description: "Request approved",
            })
            router.refresh()
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            })
        }
    }

    const handleReject = async (requestId: string) => {
        const result = await rejectToolRequest(requestId)
        if (result.success) {
            toast({
                title: "Success",
                description: "Request rejected",
            })
            router.refresh()
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            })
        }
    }

    const handleApproveNewTool = async () => {
        if (!approvingNewTool) return

        const result = await approveNewToolRequest(approvingNewTool.id, credentials)
        if (result.success) {
            toast({
                title: "Success",
                description: "New tool request approved",
            })
            setApprovingNewTool(null)
            setCredentials({ email: "", password: "" })
            router.refresh()
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            })
        }
    }

    const handleRejectNewTool = async (toolId: string) => {
        const result = await rejectNewToolRequest(toolId)
        if (result.success) {
            toast({
                title: "Success",
                description: "New tool request rejected",
            })
            router.refresh()
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Tools Management</h1>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Tool
                </Button>
            </div>

            <Tabs defaultValue="tools" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="tools">All Tools</TabsTrigger>
                    <TabsTrigger value="new-requests">
                        New Tool Requests
                        {newToolRequests.length > 0 && (
                            <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {newToolRequests.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="requests">
                        Access Requests
                        {pendingRequests.length > 0 && (
                            <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {pendingRequests.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tools" className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tools..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredTools.map((tool) => (
                            <Card key={tool.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {tool.name}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setEditingTool(tool)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the tool and all associated requests.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(tool.id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold truncate">{tool.url}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {tool.description || "No description"}
                                    </p>
                                    <div className="mt-4 space-y-1">
                                        <div className="text-xs text-muted-foreground">
                                            <strong>Email:</strong> {tool.email || "N/A"}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <strong>Password:</strong> {tool.password ? "********" : "N/A"}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="new-requests" className="space-y-4">
                    {newToolRequests.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No new tool requests
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {newToolRequests.map((req) => {
                                const requester = req.requests[0]
                                return (
                                    <Card key={req.id}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-base">
                                                        {requester?.user.name || "Unknown"} requested: {req.name}
                                                    </CardTitle>
                                                    <CardDescription className="mt-2 space-y-1">
                                                        <div><strong>URL:</strong> {req.url}</div>
                                                        {req.description && (
                                                            <div><strong>Reason:</strong> {req.description}</div>
                                                        )}
                                                        <div>{format(new Date(req.createdAt), "PPP")}</div>
                                                    </CardDescription>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => setApprovingNewTool(req)}
                                                    >
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleRejectNewTool(req.id)}
                                                    >
                                                        <X className="mr-2 h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="requests" className="space-y-4">
                    {pendingRequests.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No pending access requests
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pendingRequests.map((req) => (
                                <Card key={req.id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base">
                                                    {req.user.name} requested access to {req.toolName}
                                                </CardTitle>
                                                <CardDescription>
                                                    {format(new Date(req.createdAt), "PPP")}
                                                </CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => handleApprove(req.id)}
                                                >
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleReject(req.id)}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Add Tool Modal */}
            <ToolForm
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
            />

            {/* Edit Tool Modal */}
            {editingTool && (
                <ToolForm
                    open={!!editingTool}
                    onOpenChange={(open) => !open && setEditingTool(undefined)}
                    tool={editingTool}
                />
            )}

            {/* Approve New Tool Modal */}
            <Dialog open={!!approvingNewTool} onOpenChange={(open) => !open && setApprovingNewTool(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Tool Request: {approvingNewTool?.name}</DialogTitle>
                        <DialogDescription>
                            Add credentials for this tool. These will be shared with approved employees.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email / Username</Label>
                            <Input
                                id="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                placeholder="login@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="text"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                placeholder="Enter password"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApprovingNewTool(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleApproveNewTool}>
                            Approve & Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
