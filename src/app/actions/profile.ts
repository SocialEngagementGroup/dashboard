'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const profileSchema = z.object({
    // Personal Details
    name: z.string().min(1, "Name is required"),
    dob: z.string().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    maritalStatus: z.string().optional(),
    nationality: z.string().optional(),
    nationalId: z.string().optional(),

    // Contact Details
    phone: z.string().optional(),
    personalEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),

    // Emergency Contact
    emergencyContacts: z.array(z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(1, "Phone is required"),
        relation: z.string().min(1, "Relation is required"),
    })).optional(),

    // Bio
    bio: z.string().optional(),
})

export async function updateProfile(data: z.infer<typeof profileSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { error: "Unauthorized" }
        }

        const validatedData = profileSchema.parse(data)
        const { emergencyContacts, ...userData } = validatedData

        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                ...userData,
                dob: userData.dob ? new Date(userData.dob) : null,
                emergencyContacts: {
                    deleteMany: {},
                    create: emergencyContacts,
                }
            }
        })

        revalidatePath("/dashboard/profile")
        return { success: true }
    } catch (error) {
        console.error("Profile update error:", error)
        return { error: "Failed to update profile" }
    }
}
