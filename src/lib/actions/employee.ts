"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { writeFile } from "fs/promises"
import { join } from "path"
import { z } from "zod"
import bcrypt from "bcryptjs"

const EmployeeSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    role: z.enum(["ADMIN", "EMPLOYEE"]),
    managerId: z.string().optional(),
    designation: z.string().min(1, "Designation is required"),
    department: z.string().min(1, "Department is required"),
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
        password: formData.get("password") || undefined,
        role: formData.get("role"),
        managerId: (formData.get("managerId") === "none" ? undefined : formData.get("managerId")) || undefined,
        designation: formData.get("designation"),
        department: formData.get("department"),
        employeeId: formData.get("employeeId") || undefined,
        joiningDate: formData.get("joiningDate") || undefined,
        phone: formData.get("phone") || undefined,
        address: formData.get("address") || undefined,
        emergencyContact: formData.get("emergencyContact") || undefined,
        personalEmail: formData.get("personalEmail") || undefined,
        dob: formData.get("dob") || undefined,
        bloodGroup: formData.get("bloodGroup") || undefined,
        nationalId: formData.get("nationalId") || undefined,
        bankName: formData.get("bankName") || undefined,
        bankAccountName: formData.get("bankAccountName") || undefined,
        accountNumber: formData.get("accountNumber") || undefined,
        accountType: formData.get("accountType") || undefined,
        branchName: formData.get("branchName") || undefined,
        routingNumber: formData.get("routingNumber") || undefined,
        swiftCode: formData.get("swiftCode") || undefined,
    })

    if (!validatedFields.success) {
        console.error("[CreateEmployee] Validation failed:", validatedFields.error.flatten().fieldErrors)
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Employee.",
        }
    }

    const { email, password } = validatedFields.data

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

    // Hash the password if provided
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null

    try {
        await prisma.user.create({
            data: {
                ...validatedFields.data,
                password: hashedPassword,
                image: imageUrl,
                dob: validatedFields.data.dob ? new Date(validatedFields.data.dob) : null,
                joiningDate: validatedFields.data.joiningDate ? new Date(validatedFields.data.joiningDate) : null,
            },
        })
    } catch (error) {
        console.error("[CreateEmployee] Database Error:", error)
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
        password: formData.get("password"),
        role: formData.get("role"),
        managerId: (formData.get("managerId") === "none" ? undefined : formData.get("managerId")) || undefined,
        designation: formData.get("designation"),
        department: formData.get("department"),
        employeeId: formData.get("employeeId") || undefined,
        joiningDate: formData.get("joiningDate") || undefined,
        phone: formData.get("phone") || undefined,
        address: formData.get("address") || undefined,
        emergencyContact: formData.get("emergencyContact") || undefined,
        personalEmail: formData.get("personalEmail") || undefined,
        dob: formData.get("dob") || undefined,
        bloodGroup: formData.get("bloodGroup") || undefined,
        nationalId: formData.get("nationalId") || undefined,
        bankName: formData.get("bankName") || undefined,
        bankAccountName: formData.get("bankAccountName") || undefined,
        accountNumber: formData.get("accountNumber") || undefined,
        accountType: formData.get("accountType") || undefined,
        branchName: formData.get("branchName") || undefined,
        routingNumber: formData.get("routingNumber") || undefined,
        swiftCode: formData.get("swiftCode") || undefined,
    })

    if (!validatedFields.success) {
        console.error("[UpdateEmployee] Validation failed:", validatedFields.error.flatten().fieldErrors)
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

    // Hash the password if provided
    const hashedPassword = validatedFields.data.password
        ? bcrypt.hashSync(validatedFields.data.password, 10)
        : undefined

    try {
        await prisma.user.update({
            where: { id },
            data: {
                ...validatedFields.data,
                ...(hashedPassword ? { password: hashedPassword } : {}),
                ...(imageUrl ? { image: imageUrl } : {}),
                dob: validatedFields.data.dob ? new Date(validatedFields.data.dob) : null,
                joiningDate: validatedFields.data.joiningDate ? new Date(validatedFields.data.joiningDate) : null,
            },
        })
    } catch (error) {
        console.error("[UpdateEmployee] Database Error:", error)
        return {
            message: "Database Error: Failed to Update Employee.",
        }
    }

    revalidatePath("/admin/employees")
    redirect("/admin/employees")
}
