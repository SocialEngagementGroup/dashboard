const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('--- Verifying Database Users ---')

    try {
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@company.com' }
        })
        console.log(`Admin user (admin@company.com): ${admin ? 'FOUND' : 'NOT FOUND'}`)
        if (admin) console.log(`Role: ${admin.role}`)

        const employee = await prisma.user.findUnique({
            where: { email: 'tawhid@socialengagementgroup.com' }
        })
        console.log(`Employee user (tawhid@socialengagementgroup.com): ${employee ? 'FOUND' : 'NOT FOUND'}`)
        if (employee) console.log(`Role: ${employee.role}`)
    } catch (error) {
        console.error('Error verifying users:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
