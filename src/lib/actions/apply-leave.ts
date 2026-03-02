"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@/auth"

const LeaveRequestSchema = z.object({
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
    type: z.string().min(1, "Type is required"),
    reason: z.string().min(5, "Reason must be at least 5 characters"),
})

export type LeaveFormState = {
    errors?: {
        startDate?: string[]
        endDate?: string[]
        type?: string[]
        reason?: string[]
    }
    message?: string
} | null

export async function applyForLeave(prevState: LeaveFormState, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { message: "Unauthorized" }
    }

    const validatedFields = LeaveRequestSchema.safeParse({
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
        type: formData.get("type"),
        reason: formData.get("reason"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Apply for Leave.",
        }
    }

    try {
        await prisma.leaveRequest.create({
            data: {
                userId: session.user.id,
                startDate: new Date(validatedFields.data.startDate),
                endDate: new Date(validatedFields.data.endDate),
                type: validatedFields.data.type,
                reason: validatedFields.data.reason,
            },
        })
    } catch (error) {
        console.error("Apply Leave Error:", error)
        return {
            message: "Database Error: Failed to Apply for Leave.",
        }
    }

    revalidatePath("/dashboard/leave")
    redirect("/dashboard/leave")
}
