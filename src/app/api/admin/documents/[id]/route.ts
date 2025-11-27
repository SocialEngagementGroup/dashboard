import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        await prisma.document.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: 'Document deleted successfully' })
    } catch (error) {
        console.error('Delete document error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const { remarks, amount, currency, paymentType, month } = await request.json()

        // Reconstruct title
        // Format: Type - Remarks/Month - Amount Currency
        let documentTitle = `${paymentType} - ${paymentType === 'Bonus' ? remarks : month}`
        documentTitle += ` - ${amount} ${currency}`

        const updatedDoc = await prisma.document.update({
            where: { id },
            data: {
                title: documentTitle
            }
        })

        return NextResponse.json({ success: true, message: 'Document updated successfully', document: updatedDoc })
    } catch (error) {
        console.error('Update document error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
