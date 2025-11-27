import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { renderToBuffer } from '@react-pdf/renderer'
import { SalarySlip } from '@/components/pdf/SalarySlip'
import fs from 'fs'
import path from 'path'

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

        const { employeeId, amount, currency, month, paymentType, remarks } = await request.json()

        // Validate inputs
        if (!employeeId || !amount || !currency || !month || !paymentType) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            )
        }

        if (paymentType === 'Bonus' && !remarks) {
            return NextResponse.json(
                { message: 'Remarks are required for bonus payments' },
                { status: 400 }
            )
        }

        // Fetch employee details for the PDF
        const employee = await prisma.user.findUnique({
            where: { id: employeeId },
            select: { name: true, employeeId: true, designation: true }
        })

        if (!employee) {
            return NextResponse.json({ message: 'Employee not found' }, { status: 404 })
        }

        // Parse month (format: YYYY-MM)
        const [year, monthNum] = month.split('-')
        const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
        const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

        // Construct document title based on payment type
        let documentTitle = `${paymentType} - ${monthName}`
        if (paymentType === 'Bonus') {
            documentTitle = `${paymentType} - ${remarks}`
        }

        // Append amount and currency to title for parsing
        documentTitle += ` - ${amount} ${currency}`

        // Generate PDF
        // Use the correct paths provided by the user
        const logoPath = path.join(process.cwd(), 'public/uploads/SEG-Favicon-White.png')
        const signaturePath = path.join(process.cwd(), 'public/salary-slips/signature.png')

        // Read files as buffers to ensure they are loaded correctly
        let logoBuffer: Buffer | string = '';
        let signatureBuffer: Buffer | string = '';

        try {
            if (fs.existsSync(logoPath)) {
                logoBuffer = fs.readFileSync(logoPath);
            } else {
                console.error(`Logo file not found at: ${logoPath}`);
            }

            if (fs.existsSync(signaturePath)) {
                signatureBuffer = fs.readFileSync(signaturePath);
            } else {
                console.error(`Signature file not found at: ${signaturePath}`);
            }
        } catch (error) {
            console.error('Error reading image files:', error);
        }

        const pdfBuffer = await renderToBuffer(
            <SalarySlip
                employeeName={employee.name || 'N/A'}
                employeeId={employee.employeeId || 'N/A'}
                designation={employee.designation || undefined}
                paymentType={paymentType}
                monthOrRemarks={paymentType === 'Bonus' ? remarks : monthName}
                amount={parseFloat(amount)}
                currency={currency}
                paymentDate={new Date().toLocaleDateString()}
                logoSrc={logoBuffer}
                signatureSrc={signatureBuffer}
            />
        )

        // Define file path
        // Using a timestamp to avoid overwriting and caching issues
        const fileName = `${paymentType}-${employeeId}-${month}-${Date.now()}.pdf`
        const publicDir = path.join(process.cwd(), 'public')
        const salarySlipsDir = path.join(publicDir, 'salary-slips')

        // Ensure directory exists
        if (!fs.existsSync(salarySlipsDir)) {
            fs.mkdirSync(salarySlipsDir, { recursive: true })
        }

        const filePath = path.join(salarySlipsDir, fileName)

        // Write file
        fs.writeFileSync(filePath, pdfBuffer)

        // Create a salary slip document with payment type in title
        const document = await prisma.document.create({
            data: {
                userId: employeeId,
                title: documentTitle,
                type: 'SALARY_SLIP',
                url: `/salary-slips/${fileName}`,
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
