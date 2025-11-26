import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                // Only Admin can access /admin
                if (isLoggedIn && auth?.user?.role === 'ADMIN') return true;
                return false;
            }

            if (isOnDashboard) {
                // Any logged in user can access /dashboard
                if (isLoggedIn) return true;
                return false;
            }

            return true;
        },
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            if (session.user && token.role) {
                session.user.role = token.role as string;
            }
            return session;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        }
    },
    providers: [],
} satisfies NextAuthConfig
