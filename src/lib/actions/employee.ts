"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const EmployeeSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["ADMIN", "EMPLOYEE"]),
    managerId: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    swiftCode: z.string().optional(),
})

export type EmployeeFormState = {
    errors?: {
        [key: string]: string[]
    }
    message?: string
} | null

export async function createEmployee(prevState: EmployeeFormState, formData: FormData) {
    const validatedFields = EmployeeSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
        managerId: formData.get("managerId") || undefined,
        phone: formData.get("phone"),
        address: formData.get("address"),
        emergencyContact: formData.get("emergencyContact"),
        bankName: formData.get("bankName"),
        accountNumber: formData.get("accountNumber"),
        routingNumber: formData.get("routingNumber"),
        swiftCode: formData.get("swiftCode"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Employee.",
        }
    }

    const { email } = validatedFields.data

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return {
            message: "User with this email already exists.",
        }
    }

    try {
        await prisma.user.create({
            data: validatedFields.data,
        })
    } catch (error) {
        return {
            message: "Database Error: Failed to Create Employee.",
        }
    }

    revalidatePath("/admin/employees")
    redirect("/admin/employees")
}

export async function updateEmployee(id: string, prevState: EmployeeFormState, formData: FormData) {
    const validatedFields = EmployeeSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
        managerId: formData.get("managerId") || undefined,
        phone: formData.get("phone"),
        address: formData.get("address"),
        emergencyContact: formData.get("emergencyContact"),
        bankName: formData.get("bankName"),
        accountNumber: formData.get("accountNumber"),
        routingNumber: formData.get("routingNumber"),
        swiftCode: formData.get("swiftCode"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Employee.",
        }
    }

    try {
        await prisma.user.update({
            where: { id },
            data: validatedFields.data,
        })
    } catch (error) {
        return {
            message: "Database Error: Failed to Update Employee.",
        }
    }

    revalidatePath("/admin/employees")
    redirect("/admin/employees")
}
