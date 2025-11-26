"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateLeaveStatus(id: string, status: "APPROVED" | "REJECTED") {
    try {
        await prisma.leaveRequest.update({
            where: { id },
            data: { status }
        })
        revalidatePath("/admin/leaves")
        return { message: "Success" }
    } catch (error) {
        return { message: "Failed to update leave status" }
    }
}
