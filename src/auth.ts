import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
                if (!credentials?.email) return null

                console.log(`[Auth] Credentials email received: ${credentials.email}`)

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user) {
                    console.log(`[Auth] User found: false`)
                    return null
                }

                console.log(`[Auth] User found: true, Role: ${user.role}`)

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                const email = user.email

                // 1. Domain Check
                if (!email?.endsWith("@socialengagementgroup.com")) {
                    console.log(`Access denied: ${email} is not in the organization domain.`)
                    return false
                }

                // 2. Verified Email Check
                // Google profiles usually have email_verified, but let's check profile data if available
                if (profile?.email_verified === false) {
                    console.log(`Access denied: ${email} is not a verified Google account.`)
                    return false
                }

                // 3. User Existence Check
                // We check if a user with this email ALREADY exists in our database.
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                })

                if (!existingUser) {
                    console.log(`Access denied: ${email} has not been pre-registered by an admin.`)
                    return false
                }

                // 4. Admin Auto-Update (Optional but requested: ai@... is admin)
                if (email === "ai@socialengagementgroup.com" && existingUser.role !== "ADMIN") {
                    await prisma.user.update({
                        where: { email },
                        data: { role: "ADMIN" },
                    })
                }

                return true
            }
            // For credentials provider or others, allow default behavior (which runs authorize)
            return true
        },
    }
})
