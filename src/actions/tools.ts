"use server"

import { prisma as db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Admin Actions

export async function createTool(data: {
    name: string
    url: string
    description?: string
    image?: string
    email?: string
    password?: string
}) {
    try {
        const tool = await db.tool.create({
            data,
        })
        revalidatePath("/admin/tools")
        return { success: true, tool }
    } catch (error) {
        console.error("Failed to create tool:", error)
        return { success: false, error: "Failed to create tool" }
    }
}

export async function updateTool(id: string, data: {
    name?: string
    url?: string
    description?: string
    image?: string
    email?: string
    password?: string
}) {
    try {
        const tool = await db.tool.update({
            where: { id },
            data,
        })
        revalidatePath("/admin/tools")
        return { success: true, tool }
    } catch (error) {
        console.error("Failed to update tool:", error)
        return { success: false, error: "Failed to update tool" }
    }
}

export async function deleteTool(id: string) {
    try {
        await db.tool.delete({
            where: { id },
        })
        revalidatePath("/admin/tools")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete tool:", error)
        return { success: false, error: "Failed to delete tool" }
    }
}

export async function getTools() {
    try {
        const tools = await db.tool.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                requests: {
                    include: {
                        user: true
                    }
                }
            }
        })
        return { success: true, tools }
    } catch (error) {
        console.error("Failed to get tools:", error)
        return { success: false, error: "Failed to get tools" }
    }
}

export async function approveToolRequest(requestId: string) {
    try {
        await db.toolRequest.update({
            where: { id: requestId },
            data: { status: "APPROVED" },
        })
        revalidatePath("/admin/tools")
        return { success: true }
    } catch (error) {
        console.error("Failed to approve request:", error)
        return { success: false, error: "Failed to approve request" }
    }
}

export async function rejectToolRequest(requestId: string) {
    try {
        await db.toolRequest.update({
            where: { id: requestId },
            data: { status: "REJECTED" },
        })
        revalidatePath("/admin/tools")
        return { success: true }
    } catch (error) {
        console.error("Failed to reject request:", error)
        return { success: false, error: "Failed to reject request" }
    }
}

// Employee Actions

export async function getAvailableTools(userId: string) {
    try {
        const tools = await db.tool.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                requests: {
                    where: { userId },
                    take: 1
                }
            }
        })

        // Transform to include status for the current user
        const toolsWithStatus = tools.map((tool: any) => ({
            ...tool,
            // Hide sensitive info if not approved
            email: tool.requests[0]?.status === "APPROVED" ? tool.email : null,
            password: tool.requests[0]?.status === "APPROVED" ? tool.password : null,
            requestStatus: tool.requests[0]?.status || null,
            requestId: tool.requests[0]?.id || null
        }))

        return { success: true, tools: toolsWithStatus }
    } catch (error) {
        console.error("Failed to get available tools:", error)
        return { success: false, error: "Failed to get available tools" }
    }
}

export async function requestToolAccess(toolId: string, userId: string) {
    try {
        // Check if request already exists
        const existingRequest = await db.toolRequest.findUnique({
            where: {
                toolId_userId: {
                    toolId,
                    userId
                }
            }
        })

        if (existingRequest) {
            return { success: false, error: "Request already exists" }
        }

        await db.toolRequest.create({
            data: {
                toolId,
                userId,
                status: "PENDING"
            }
        })

        revalidatePath("/dashboard/tools")
        return { success: true }
    } catch (error) {
        console.error("Failed to request access:", error)
        return { success: false, error: "Failed to request access" }
    }
}

export async function approveNewToolRequest(toolId: string, credentials?: { email?: string, password?: string }) {
    try {
        // Update tool to be "approved" and add credentials if provided
        await db.tool.update({
            where: { id: toolId },
            data: {
                email: credentials?.email,
                password: credentials?.password,
            },
        })
        
        // Approve the associated request
        const request = await db.toolRequest.findFirst({
            where: { toolId },
        })
        
        if (request) {
            await db.toolRequest.update({
                where: { id: request.id },
                data: { status: "APPROVED" },
            })
        }
        
        revalidatePath("/admin/tools")
        revalidatePath("/dashboard/tools")
        return { success: true }
    } catch (error) {
        console.error("Failed to approve new tool request:", error)
        return { success: false, error: "Failed to approve new tool request" }
    }
}

export async function rejectNewToolRequest(toolId: string) {
    try {
        // Reject the request
        const request = await db.toolRequest.findFirst({
            where: { toolId },
        })
        
        if (request) {
            await db.toolRequest.update({
                where: { id: request.id },
                data: { status: "REJECTED" },
            })
        }
        
        revalidatePath("/admin/tools")
        revalidatePath("/dashboard/tools")
        return { success: true }
    } catch (error) {
        console.error("Failed to reject new tool request:", error)
        return { success: false, error: "Failed to reject new tool request" }
    }
}
