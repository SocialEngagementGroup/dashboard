import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>Sign in to access your dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />

                    <div className="mt-6 space-y-2 rounded-lg bg-blue-50 p-4 text-sm">
                        <p className="font-semibold text-blue-900">Test Accounts:</p>
                        <div className="space-y-1 text-blue-700">
                            <p>👨‍💼 Admin: <span className="font-mono">ai@socialengagementgroup.com</span></p>
                            <p>👤 Employee (example): <span className="font-mono">tawhid@socialengagementgroup.com</span></p>
                        </div>
                        <p className="mt-2 text-xs text-blue-600 italic border-t border-blue-100 pt-2">
                            Employees can log in using their own company email (any seeded employee email works).
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
