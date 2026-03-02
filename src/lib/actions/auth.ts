"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

const ForgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
})

const ResetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type AuthFormState = {
    errors?: {
        [key: string]: string[]
    }
    message?: string
    success?: boolean
} | null

export async function forgotPassword(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const validatedFields = ForgotPasswordSchema.safeParse({
        email: formData.get("email"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Invalid email.",
        }
    }

    const { email } = validatedFields.data

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        // For security, don't reveal if user exists
        return {
            message: "If an account exists, a 6-digit reset code has been sent to your phone.",
            success: true,
        }
    }

    // Generate a 6-digit PIN
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes for PIN

    try {
        // Delete any existing tokens for this identifier to avoid conflicts
        await prisma.verificationToken.deleteMany({
            where: { identifier: email },
        })

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: code, // Using the code as the token
                expires,
            },
        })

        // SIMULATION: Log the code to console as if it were an SMS
        console.log(`\n--- SMS SIMULATION ---`)
        console.log(`TO: ${user.phone || email}`)
        console.log(`MESSAGE: Your password reset code is: ${code}`)
        console.log(`----------------------\n`)

        return {
            message: "A 6-digit reset code has been sent to your phone/email.",
            success: true,
        }
    } catch (error) {
        console.error("Forgot password error:", error)
        return {
            message: "Something went wrong. Please try again later.",
        }
    }
}

export async function resetPassword(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const validatedFields = ResetPasswordSchema.safeParse({
        token: formData.get("token"), // This is the 6-digit code
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    })

    const email = formData.get("email") as string

    if (!validatedFields.success || !email) {
        return {
            errors: validatedFields.success ? undefined : validatedFields.error.flatten().fieldErrors,
            message: "Invalid fields or missing email.",
        }
    }

    const { token: code, password } = validatedFields.data

    const verificationToken = await prisma.verificationToken.findFirst({
        where: {
            identifier: email,
            token: code,
        },
    })

    if (!verificationToken || verificationToken.expires < new Date()) {
        return {
            message: "Invalid or expired reset code.",
        }
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    try {
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { password: hashedPassword },
        })

        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: email,
                    token: code
                }
            },
        })

        return {
            message: "Password reset successful! You can now log in.",
            success: true,
        }
    } catch (error) {
        console.error("Reset password error:", error)
        return {
            message: "Failed to reset password. Please try again.",
        }
    }
}
