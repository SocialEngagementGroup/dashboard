
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'test.professional@example.com' }
        })

        if (user) {
            console.log('✅ User found:')
            console.log(`Name: ${user.name}`)
            console.log(`Email: ${user.email}`)
            console.log(`Designation: ${user.designation}`)
            console.log(`Department: ${user.department}`)
            console.log(`Employee ID: ${user.employeeId}`)
            console.log(`Joining Date: ${user.joiningDate}`)

            if (user.designation === 'Senior Developer' &&
                user.department === 'Engineering' &&
                user.employeeId === 'EMP-999' &&
                user.joiningDate) {
                console.log('✅ All professional details match!')
            } else {
                console.error('❌ Professional details do not match.')
            }
        } else {
            console.error('❌ User not found.')
        }
    } catch (error) {
        console.error('❌ Error verifying user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
