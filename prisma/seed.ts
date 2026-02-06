import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const departments = [
    { name: 'Leadership', order: 1 },
    { name: 'Project Management', order: 2 },
    { name: 'Research & Development', order: 3 },
    { name: 'Creative Design', order: 4 },
    { name: 'Digital Marketing', order: 5 },
    { name: 'Web Development', order: 6 }
]

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
    console.log('--- Starting Database Seeding ---')

    // 1. Seed Departments
    console.log('Seeding departments...')
    for (const dept of departments) {
        await prisma.department.upsert({
            where: { name: dept.name },
            update: { order: dept.order },
            create: dept
        })
    }
    console.log('Departments seeded.')

    // 2. Seed Admin User
    const adminEmail = 'admin@company.com'
    console.log(`Seeding Admin User: ${adminEmail}`)
    await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: 'ADMIN' },
        create: {
            email: adminEmail,
            name: 'Social Engagement Group Admin',
            role: 'ADMIN'
        }
    })
    console.log('Admin user seeded.')

    // 3. Seed Employees (Cleanup existing if any, then recreate)
    console.log('Processing employee data...')
    const employeeUsers = await prisma.user.findMany({
        where: { role: 'EMPLOYEE' },
        select: { id: true }
    })

    if (employeeUsers.length > 0) {
        console.log(`Cleaning up ${employeeUsers.length} existing employees and their related data...`)
        const userIds = employeeUsers.map(u => u.id)

        // Batch delete related records
        await prisma.leaveRequest.deleteMany({ where: { userId: { in: userIds } } })
        await prisma.document.deleteMany({ where: { userId: { in: userIds } } })
        await prisma.toolRequest.deleteMany({ where: { userId: { in: userIds } } })
        await prisma.emergencyContact.deleteMany({ where: { userId: { in: userIds } } })
        await prisma.user.deleteMany({ where: { id: { in: userIds } } })
    }

    // Create new employees
    for (const employee of employees) {
        await prisma.user.create({
            data: employee
        })
    }
    console.log(`${employees.length} employees seeded.`)

    console.log('--- Seeding Completed Successfully ---')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
