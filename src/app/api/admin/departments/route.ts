import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
    try {
        const departments = await prisma.department.findMany({
            orderBy: { order: 'asc' }
        })

        return NextResponse.json(departments)
    } catch (error) {
        console.error('Error fetching departments:', error)
        return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, description } = body

        // Get the highest order number and add 1
        const maxOrder = await prisma.department.findFirst({
            orderBy: { order: 'desc' },
            select: { order: true }
        })

        const department = await prisma.department.create({
            data: {
                name,
                description,
                order: (maxOrder?.order || 0) + 1
            }
        })

        return NextResponse.json(department, { status: 201 })
    } catch (error) {
        console.error('Error creating department:', error)
        return NextResponse.json({ error: 'Failed to create department' }, { status: 500 })
    }
}
