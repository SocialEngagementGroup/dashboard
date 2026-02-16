import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AuthCallbackPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    if (session.user.role === "ADMIN") {
        redirect("/admin")
    }

    redirect("/dashboard")
}
