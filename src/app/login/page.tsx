import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#5c3333]">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold brand-text-gradient">Welcome Back</CardTitle>
                    <CardDescription>Sign in to access your dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground italic">Loading login form...</div>}>
                        <LoginForm />
                    </Suspense>

                    <div className="mt-6 space-y-2 rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm shadow-sm">
                        <p className="font-bold text-[#5c3333]">Test Accounts:</p>
                        <div className="space-y-1 text-slate-600 font-medium">
                            <p>👨‍💼 Admin: <span className="font-mono bg-white px-1 rounded border">ai@socialengagementgroup.com</span></p>
                            <p>👤 Employee: <span className="font-mono bg-white px-1 rounded border">tawhid@socialengagementgroup.com</span></p>
                        </div>
                        <p className="mt-2 text-[10px] text-slate-400 italic border-t border-slate-100 pt-2">
                            Employees can log in using their own company email.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
