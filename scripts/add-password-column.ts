import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Database Repair Script ---')
    console.log('Attempting to add "password" column to "User" table via raw SQL...')

    try {
        // We use executeRawUnsafe to run the DDL command directly
        // This uses the DATABASE_URL (pooled connection) which we know works for your app
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" text;`)
        console.log('✅ Success! The "password" column has been added to your database.')
    } catch (error) {
        console.error('❌ Error applying SQL change:')
        console.error(error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
