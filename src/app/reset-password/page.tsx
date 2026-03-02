"use client"

import { useActionState, useEffect, Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { resetPassword } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [state, dispatch, isPending] = useActionState(resetPassword, null)

    const handleAutoLogin = async () => {
        const email = searchParams.get("email")
        if (!email || !password) return

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (!result?.error) {
            const response = await fetch("/api/user")
            const user = await response.json()
            if (user.role === "ADMIN") {
                router.push("/admin")
            } else {
                router.push("/dashboard")
            }
            router.refresh()
        }
    }

    useEffect(() => {
        if (state?.success) {
            toast.success("Password reset successful! Logging you in...")
            handleAutoLogin()
        } else if (state?.message) {
            toast.error(state.message)
        }
    }, [state, router])

    if (!token) {
        return (
            <div className="text-center p-4">
                <p className="text-red-500 font-medium text-sm">Invalid or missing reset token.</p>
                <Button variant="link" onClick={() => router.push("/login")} className="mt-2">Back to Login</Button>
            </div>
        )
    }

    return (
        <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    defaultValue={searchParams.get("email") || ""}
                    required
                    disabled={isPending}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="token">6-Digit Reset Code</Label>
                <Input
                    id="token"
                    name="token"
                    type="text"
                    placeholder="Enter 6-digit code"
                    required
                    maxLength={6}
                    disabled={isPending}
                    className="tracking-[0.5em] text-center font-mono text-lg"
                />
                <p className="text-[10px] text-muted-foreground text-center italic">Code was sent to your phone (check console).</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        disabled={isPending}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {state?.errors?.password && (
                    <p className="text-xs text-red-500">{state.errors.password[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        required
                        minLength={6}
                        disabled={isPending}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {state?.errors?.confirmPassword && (
                    <p className="text-xs text-red-500">{state.errors.confirmPassword[0]}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                    </>
                ) : (
                    "Reset Password"
                )}
            </Button>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#5c3333]">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold brand-text-gradient">Reset Password</CardTitle>
                    <CardDescription>Enter your new password below</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="h-[200px] flex items-center justify-center italic text-sm text-muted-foreground">Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
