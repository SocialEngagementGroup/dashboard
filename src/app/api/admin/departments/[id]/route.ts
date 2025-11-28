import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { name, description, order } = body

        const department = await prisma.department.update({
            where: { id },
            data: {
                name,
                description,
                order
            }
        })

        return NextResponse.json(department)
    } catch (error) {
        console.error('Error updating department:', error)
        return NextResponse.json({ error: 'Failed to update department' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Check if any users are assigned to this department
        const usersCount = await prisma.user.count({
            where: {
                department: {
                    equals: (await prisma.department.findUnique({ where: { id } }))?.name
                }
            }
        })

        if (usersCount > 0) {
            return NextResponse.json({
                error: `Cannot delete department with ${usersCount} assigned employees`
            }, { status: 400 })
        }

        await prisma.department.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Department deleted' })
    } catch (error) {
        console.error('Error deleting department:', error)
        return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 })
    }
}
