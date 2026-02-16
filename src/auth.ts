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
                }

                // 4. Admin Auto-Update Logic
                const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];
                const isAdminEmail = email && adminEmails.includes(email);

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email,
                            name: user.name,
                            image: user.image,
                            role: isAdminEmail ? "ADMIN" : "EMPLOYEE",
                        }
                    })
                }

                return true
            }
            return true
        },
        async jwt({ token, user }) {
            // This runs on sign-in (user is present) and on subsequent requests (user is null)
            if (user) {
                const email = user.email;

                // 1. Use the role from the user object (for credentials provider)
                if ((user as any).role) {
                    token.role = (user as any).role;
                }
                // 2. Fetch from DB for Google/other providers or if role is missing
                else if (email) {
                    const dbUser = await prisma.user.findUnique({
                        where: { email },
                        select: { role: true }
                    });
                    if (dbUser) token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            if (session.user && token.role) {
                session.user.role = token.role as string;
            }
            return session;
        },
    }
})
