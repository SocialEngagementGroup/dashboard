"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const NoticeSchema = z.object({
    title: z.string().min(2, "Title is required"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    isPinned: z.boolean().optional(),
})

export type NoticeFormState = {
    errors?: {
        title?: string[]
        content?: string[]
    }
    message?: string
} | null

export async function createNotice(prevState: NoticeFormState, formData: FormData) {
    const validatedFields = NoticeSchema.safeParse({
        title: formData.get("title"),
        content: formData.get("content"),
        isPinned: formData.get("isPinned") === "on",
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Notice.",
        }
    }

    try {
        await prisma.notice.create({
            data: validatedFields.data,
        })
    } catch (error) {
        return {
            message: "Database Error: Failed to Create Notice.",
        }
    }

    revalidatePath("/admin/notices")
    redirect("/admin/notices")
}

export async function deleteNotice(id: string) {
    try {
        await prisma.notice.delete({
            where: { id }
        })
        revalidatePath("/admin/notices")
        return { message: "Success" }
    } catch (error) {
        return { message: "Failed to delete notice" }
    }
}

export async function togglePinNotice(id: string, isPinned: boolean) {
    try {
        await prisma.notice.update({
            where: { id },
            data: { isPinned }
        })
        revalidatePath("/admin/notices")
        return { message: "Success" }
    } catch (error) {
        return { message: "Failed to update notice" }
    }
}
