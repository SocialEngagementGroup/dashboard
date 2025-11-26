import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        try {
            await fs.mkdir(uploadsDir, { recursive: true })
        } catch (error) {
            // Ignore error if directory exists
        }

        // Generate unique filename
        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
        const filepath = path.join(uploadsDir, filename)

        // Write file
        await fs.writeFile(filepath, buffer)

        const imageUrl = `/uploads/${filename}`

        // Update user's profile photo
        await prisma.user.update({
            where: { email: session.user.email },
            data: { image: imageUrl }
        })

        return NextResponse.json({ success: true, imageUrl })
    } catch (error) {
        console.error('Error updating profile photo:', error)
        return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
    }
}
