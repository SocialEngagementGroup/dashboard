"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { z } from "zod"

const SetupPasswordSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type SetupPasswordState = {
    errors?: {
        [key: string]: string[]
    }
    message?: string
    success?: boolean
} | null

export async function setupPassword(prevState: SetupPasswordState, formData: FormData) {
    const validatedFields = SetupPasswordSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed.",
        }
    }

    const { email, password } = validatedFields.data

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return { message: "User not found." }
        }

        if (user.password) {
            return { message: "Password already set for this account." }
        }

        const hashedPassword = bcrypt.hashSync(password, 10)

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        })

        return {
            success: true,
            message: "Password set successfully!",
        }
    } catch (error) {
        console.error("[SetupPassword] Error:", error)
        return { message: "Failed to set password." }
    }
}
