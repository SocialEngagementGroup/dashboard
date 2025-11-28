"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function requestTool(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" }
    }

    const name = formData.get("name") as string
    const url = formData.get("url") as string
    const description = formData.get("description") as string

    if (!name || !url) {
        return { success: false, error: "Name and URL are required" }
    }

    try {
        // Create the tool first
        const tool = await prisma.tool.create({
            data: {
                name,
                url,
                description: description || null,
            },
        })

        // Then create a tool request for this user
        await prisma.toolRequest.create({
            data: {
                toolId: tool.id,
                userId: session.user.id,
                status: "PENDING",
            },
        })

        revalidatePath("/dashboard/tools")
        return { success: true }
    } catch (error) {
        console.error("Error creating tool request:", error)
        return { success: false, error: "Failed to create request" }
    }
}
