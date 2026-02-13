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

                if (!email) {
                    console.log("Access denied: No email provided by Google.")
                    return false
                }

                // 2. Verified Email Check
                if (profile?.email_verified === false) {
                    console.log(`Access denied: ${email} is not a verified Google account.`)
                    return false
                }

                // 3. User Existence & Auto-Creation
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                })

                if (!existingUser) {
                    console.log(`[Auth] Creating new user for: ${email}`)
                    await prisma.user.create({
                        data: {
                            email,
                            name: user.name,
                            image: user.image,
                            role: "EMPLOYEE", // Default role
                        }
                    })
                }

                // 4. Admin Auto-Update
                if (email === "ai@socialengagementgroup.com" && existingUser?.role !== "ADMIN") {
                    // Note: If existingUser was null (just created), we'd need to re-fetch or check logic, 
                    // but for this specific hardcoded email, it's fine.
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
