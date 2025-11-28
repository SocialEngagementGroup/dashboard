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

async function main() {
    console.log('Starting department seeding...')

    for (const dept of departments) {
        const created = await prisma.department.upsert({
            where: { name: dept.name },
            update: {},
            create: dept
        })
        console.log(`Created/Updated department: ${created.name}`)
    }

    console.log('Department seeding completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
