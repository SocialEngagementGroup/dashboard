import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { imageUrl } = await request.json()

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
        }

        // Update user's profile photo
        await prisma.user.update({
            where: { email: session.user.email },
            data: { image: imageUrl }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating profile photo:', error)
        return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
    }
}
