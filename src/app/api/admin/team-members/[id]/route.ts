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
        const { name, email, designation, department } = body

        // Update user
        const user = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                designation,
                department
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error updating team member:', error)
        return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
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

        // Delete user
        await prisma.user.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Team member deleted' })
    } catch (error) {
        console.error('Error deleting team member:', error)
        return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
    }
}
