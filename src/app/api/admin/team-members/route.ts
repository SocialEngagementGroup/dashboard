import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, email, designation, department } = body

        // Create new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                designation,
                department,
                role: 'EMPLOYEE'
            }
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error('Error creating team member:', error)
        return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
    }
}
