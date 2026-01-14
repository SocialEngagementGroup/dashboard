
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'ai@socialengagementgroup.com'

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingUser) {
    console.log(`Creating Admin User: ${adminEmail}`)
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Social Engagement Group Admin',
        role: 'ADMIN',
        // Minimal required fields
      },
    })
    console.log('Admin user created successfully.')
  } else {
    console.log('Admin user already exists.')
    // Ensure role is ADMIN
    if (existingUser.role !== 'ADMIN') {
        await prisma.user.update({
            where: { email: adminEmail },
            data: { role: 'ADMIN' },
        })
        console.log('Updated user to ADMIN role.')
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
