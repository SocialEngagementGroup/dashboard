"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"

const BankingSchema = z.object({
    bankName: z.string().min(2, "Bank Name is required"),
    bankAccountName: z.string().min(2, "Account Name is required"),
    accountNumber: z.string().min(5, "Account Number is required"),
    branchName: z.string().optional(),
    routingNumber: z.string().optional(),
    swiftCode: z.string().optional(),
})

export type BankingFormState = {
    errors?: {
        bankName?: string[]
        bankAccountName?: string[]
        accountNumber?: string[]
        branchName?: string[]
        routingNumber?: string[]
        swiftCode?: string[]
    }
    message?: string
}

export async function updateBankingDetails(prevState: BankingFormState, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { message: "Unauthorized" }
    }

    const validatedFields = BankingSchema.safeParse({
        bankName: formData.get("bankName"),
        bankAccountName: formData.get("bankAccountName"),
        accountNumber: formData.get("accountNumber"),
        branchName: formData.get("branchName"),
        routingNumber: formData.get("routingNumber"),
        swiftCode: formData.get("swiftCode"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Banking Details.",
        }
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: validatedFields.data,
        })
    } catch (error) {
        return {
            message: "Database Error: Failed to Update Banking Details.",
        }
    }

    revalidatePath("/dashboard/salary")
    return { message: "Success! Banking details updated." }
}
