import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
    try {
        // Check if user is authenticated and is an admin
        const session = await auth()
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { employeeId, amount, currency, month, paymentType } = await request.json()

        // Validate inputs
        if (!employeeId || !amount || !currency || !month || !paymentType) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Parse month (format: YYYY-MM)
        const [year, monthNum] = month.split('-')
        const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
        const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

        // Create a salary slip document with payment type in title
        const document = await prisma.document.create({
            data: {
                userId: employeeId,
                title: `${paymentType} - ${monthName}`,
                type: 'SALARY_SLIP',
                url: `/salary-slips/${employeeId}/${month}.pdf`, // Placeholder URL
                createdAt: new Date(), // Current date when payment is processed
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Payment processed successfully',
            document,
        })
    } catch (error) {
        console.error('Payment processing error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
