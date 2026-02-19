const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2]
    const plainPassword = process.argv[3]

    if (!email || !plainPassword) {
        console.log('Usage: node scripts/set-password.js <email> <password>')
        return
    }

    console.log(`Setting password for: ${email}...`)

    const hashedPassword = bcrypt.hashSync(plainPassword, 10)

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        })
        console.log(`✅ Success! Password for ${email} has been updated to the secure hash.`)
        console.log(`You can now log in with the password: ${plainPassword}`)
    } catch (error) {
        console.error('❌ Error updating password. Make sure the email exists in your Database.')
        console.error('Reason:', error.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
