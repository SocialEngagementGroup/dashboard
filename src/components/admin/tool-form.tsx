"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createTool, updateTool } from "@/actions/tools"
import { useToast } from "@/hooks/use-toast"

const toolSchema = z.object({
    name: z.string().min(1, "Name is required"),
    url: z.string().url("Invalid URL"),
    description: z.string().optional(),
    image: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    password: z.string().optional(),
})

type ToolFormValues = z.infer<typeof toolSchema>

interface ToolFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tool?: {
        id: string
        name: string
        url: string
        description?: string | null
        image?: string | null
        email?: string | null
        password?: string | null
    }
}

export function ToolForm({ open, onOpenChange, tool }: ToolFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ToolFormValues>({
        resolver: zodResolver(toolSchema),
        defaultValues: {
            name: tool?.name || "",
            url: tool?.url || "",
            description: tool?.description || "",
            image: tool?.image || "",
            email: tool?.email || "",
            password: tool?.password || "",
        },
    })

    async function onSubmit(data: ToolFormValues) {
        setIsLoading(true)
        try {
            if (tool) {
                const result = await updateTool(tool.id, data)
                if (result.success) {
                    toast({
                        title: "Success",
                        description: "Tool updated successfully",
                    })
                    onOpenChange(false)
                    router.refresh()
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: result.error,
                    })
                }
            } else {
                const result = await createTool(data)
                if (result.success) {
                    toast({
                        title: "Success",
                        description: "Tool created successfully",
                    })
                    onOpenChange(false)
                    form.reset()
                    router.refresh()
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: result.error,
                    })
                }
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{tool ? "Edit Tool" : "Add Tool"}</DialogTitle>
                    <DialogDescription>
                        {tool
                            ? "Make changes to the tool here."
                            : "Add a new tool to the organization."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tool Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tool description..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Login Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Login Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {tool ? "Save Changes" : "Create Tool"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
