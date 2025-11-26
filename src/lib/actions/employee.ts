"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { writeFile } from "fs/promises"
import { join } from "path"
import { z } from "zod"

const EmployeeSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["ADMIN", "EMPLOYEE"]),
    managerId: z.string().optional(),
    designation: z.string().optional(),
    department: z.string().optional(),
    employeeId: z.string().optional(),
    joiningDate: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    personalEmail: z.string().email("Invalid personal email").optional().or(z.literal("")),
    dob: z.string().optional(),
    bloodGroup: z.string().optional(),
    nationalId: z.string().optional(),
    bankName: z.string().optional(),
    bankAccountName: z.string().optional(),
    accountNumber: z.string().optional(),
    accountType: z.string().optional(),
    branchName: z.string().optional(),
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
        managerId: (formData.get("managerId") === "none" ? undefined : formData.get("managerId")) || undefined,
        designation: formData.get("designation"),
        department: formData.get("department"),
        employeeId: formData.get("employeeId"),
        joiningDate: formData.get("joiningDate"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        emergencyContact: formData.get("emergencyContact"),
        personalEmail: formData.get("personalEmail"),
        dob: formData.get("dob"),
        bloodGroup: formData.get("bloodGroup"),
        nationalId: formData.get("nationalId"),
        bankName: formData.get("bankName"),
        bankAccountName: formData.get("bankAccountName"),
        accountNumber: formData.get("accountNumber"),
        accountType: formData.get("accountType"),
        branchName: formData.get("branchName"),
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

    let imageUrl = undefined
    const imageFile = formData.get("image") as File
    if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const filename = `${uniqueSuffix}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, "_")}`
        const uploadDir = join(process.cwd(), "public/uploads")
        const filepath = join(uploadDir, filename)
        try {
            await writeFile(filepath, buffer)
            imageUrl = `/uploads/${filename}`
        } catch (e) {
            console.error("Failed to upload image", e)
        }
    }

    try {
        await prisma.user.create({
            data: {
                ...validatedFields.data,
                image: imageUrl,
                dob: validatedFields.data.dob ? new Date(validatedFields.data.dob) : null,
                joiningDate: validatedFields.data.joiningDate ? new Date(validatedFields.data.joiningDate) : null,
            },
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
        managerId: (formData.get("managerId") === "none" ? undefined : formData.get("managerId")) || undefined,
        designation: formData.get("designation"),
        department: formData.get("department"),
        employeeId: formData.get("employeeId"),
        joiningDate: formData.get("joiningDate"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        emergencyContact: formData.get("emergencyContact"),
        personalEmail: formData.get("personalEmail"),
        dob: formData.get("dob"),
        bloodGroup: formData.get("bloodGroup"),
        nationalId: formData.get("nationalId"),
        bankName: formData.get("bankName"),
        bankAccountName: formData.get("bankAccountName"),
        accountNumber: formData.get("accountNumber"),
        accountType: formData.get("accountType"),
        branchName: formData.get("branchName"),
        routingNumber: formData.get("routingNumber"),
        swiftCode: formData.get("swiftCode"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Employee.",
        }
    }

    let imageUrl = undefined
    const imageFile = formData.get("image") as File
    if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const filename = `${uniqueSuffix}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, "_")}`
        const uploadDir = join(process.cwd(), "public/uploads")
        const filepath = join(uploadDir, filename)
        try {
            await writeFile(filepath, buffer)
            imageUrl = `/uploads/${filename}`
        } catch (e) {
            console.error("Failed to upload image", e)
        }
    }

    try {
        await prisma.user.update({
            where: { id },
            data: {
                ...validatedFields.data,
                ...(imageUrl ? { image: imageUrl } : {}),
                dob: validatedFields.data.dob ? new Date(validatedFields.data.dob) : null,
                joiningDate: validatedFields.data.joiningDate ? new Date(validatedFields.data.joiningDate) : null,
            },
        })
    } catch (error) {
        return {
            message: "Database Error: Failed to Update Employee.",
        }
    }

    revalidatePath("/admin/employees")
    redirect("/admin/employees")
}
