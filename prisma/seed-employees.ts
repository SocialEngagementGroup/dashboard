import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const employees = [
    // Leadership
    {
        name: 'Tawhid Rifat',
        email: 'tawhid@socialengagementgroup.com',
        designation: 'Chief Executive Officer',
        department: 'Leadership',
        role: 'EMPLOYEE'
    },
    {
        name: 'Rahee Khan',
        email: 'rahee@socialengagementgroup.com',
        designation: 'Chief Operating Officer',
        department: 'Leadership',
        role: 'EMPLOYEE'
    },
    // Project Management
    {
        name: 'Shayekh Khan',
        email: 'shayekh@socialengagementgroup.com',
        designation: 'Project Manager',
        department: 'Project Management',
        role: 'EMPLOYEE'
    },
    {
        name: 'Ashraf Uddin',
        email: 'ashraf@socialengagementgroup.com',
        designation: 'Project Manager',
        department: 'Project Management',
        role: 'EMPLOYEE'
    },
    // Research & Development
    {
        name: 'Dhruba Datta',
        email: 'dhruba@socialengagementgroup.com',
        designation: 'R&D Lead',
        department: 'Research & Development',
        role: 'EMPLOYEE'
    },
    // Creative Design
    {
        name: 'Ali Shahriar',
        email: 'ali@socialengagementgroup.com',
        designation: 'Video Editor',
        department: 'Creative Design',
        role: 'EMPLOYEE'
    },
    {
        name: 'Zaki Tahmid',
        email: 'zaki@socialengagementgroup.com',
        designation: 'Creative Lead',
        department: 'Creative Design',
        role: 'EMPLOYEE'
    },
    {
        name: 'Omar Huzifa',
        email: 'omar@socialengagementgroup.com',
        designation: 'Graphics Designer',
        department: 'Creative Design',
        role: 'EMPLOYEE'
    },
    // Digital Marketing
    {
        name: 'Tanzim Shahriar',
        email: 'tanzim@socialengagementgroup.com',
        designation: 'Digital Marketer',
        department: 'Digital Marketing',
        role: 'EMPLOYEE'
    },
    // Web Development
    {
        name: 'Sunit Sen',
        email: 'sunit@socialengagementgroup.com',
        designation: 'Web Developer',
        department: 'Web Development',
        role: 'EMPLOYEE'
    }
]

async function main() {
    console.log('Starting employee data seeding...')

    // Get all employee user IDs (not admin)
    const employeeUsers = await prisma.user.findMany({
        where: {
            role: 'EMPLOYEE'
        },
        select: {
            id: true,
            name: true
        }
    })

    console.log(`Found ${employeeUsers.length} existing employees to delete`)

    // Delete related data first to avoid foreign key constraints
    for (const user of employeeUsers) {
        // Delete leave requests
        await prisma.leaveRequest.deleteMany({
            where: { userId: user.id }
        })

        // Delete documents
        await prisma.document.deleteMany({
            where: { userId: user.id }
        })

        // Delete tool requests
        await prisma.toolRequest.deleteMany({
            where: { userId: user.id }
        })

        // Delete emergency contacts
        await prisma.emergencyContact.deleteMany({
            where: { userId: user.id }
        })

        console.log(`Deleted related data for: ${user.name}`)
    }

    // Now delete the users
    const deletedCount = await prisma.user.deleteMany({
        where: {
            role: 'EMPLOYEE'
        }
    })
    console.log(`Deleted ${deletedCount.count} existing employees`)

    // Create new employees
    for (const employee of employees) {
        const created = await prisma.user.create({
            data: employee
        })
        console.log(`Created employee: ${created.name} (${created.designation})`)
    }

    console.log('Employee seeding completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
