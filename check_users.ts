
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    console.log('Users found:', users.length)
    users.forEach((user: any) => {
        console.log(`- Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`)
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
