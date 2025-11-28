import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma as db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { name, url, description } = body

        if (!name || !url) {
            return NextResponse.json(
                { error: "Name and URL are required" },
                { status: 400 }
            )
        }

        // Create a tool with a pending request
        const tool = await db.tool.create({
            data: {
                name,
                url,
                description: description || null,
            },
        })

        // Create a tool request
        await db.toolRequest.create({
            data: {
                toolId: tool.id,
                userId: session.user.id,
                status: "PENDING",
            },
        })

        revalidatePath("/dashboard/tools")
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error creating tool request:", error)
        return NextResponse.json(
            { error: "Failed to create request" },
            { status: 500 }
        )
    }
}
