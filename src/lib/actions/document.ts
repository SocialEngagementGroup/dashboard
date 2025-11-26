"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import { join } from "path"
import { z } from "zod"

const DocumentSchema = z.object({
    title: z.string().min(2, "Title is required"),
    type: z.enum(["SALARY_SLIP", "PERFORMANCE_REVIEW", "SOP"]),
    userId: z.string().optional(),
})

export async function uploadDocument(formData: FormData) {
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const type = formData.get("type") as "SALARY_SLIP" | "PERFORMANCE_REVIEW" | "SOP"
    const userId = formData.get("userId") as string

    if (!file) {
        return { message: "No file uploaded" }
    }

    const validatedFields = DocumentSchema.safeParse({
        title,
        type,
        userId: userId || undefined,
    })

    if (!validatedFields.success) {
        return { message: "Invalid fields" }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`
    const uploadDir = join(process.cwd(), "public/uploads")
    const filepath = join(uploadDir, filename)

    try {
        await writeFile(filepath, buffer)

        await prisma.document.create({
            data: {
                title,
                type,
                url: `/uploads/${filename}`,
                userId: userId || null,
            },
        })

        revalidatePath(`/admin/employees/${userId}`)
        return { message: "Success" }
    } catch (error) {
        console.error(error)
        return { message: "Failed to upload file" }
    }
}

export async function deleteDocument(id: string) {
    try {
        await prisma.document.delete({
            where: { id }
        })
        // Note: In a real app, we should also delete the file from the filesystem
        revalidatePath("/admin/employees")
        return { message: "Success" }
    } catch (error) {
        return { message: "Failed to delete document" }
    }
}
