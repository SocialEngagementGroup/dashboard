"use client"

import { useActionState, useEffect, useState } from "react"
import { forgotPassword } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [emailInput, setEmailInput] = useState("")
    const [state, dispatch, isPending] = useActionState(forgotPassword, null)

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message)
        } else if (state?.message) {
            toast.error(state.message)
        }
    }, [state])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#5c3333]">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold brand-text-gradient">Forgot Password</CardTitle>
                    <CardDescription>Enter your email to receive a 6-digit reset code on your phone</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={dispatch} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                required
                                disabled={isPending}
                            />
                            {state?.errors?.email && (
                                <p className="text-xs text-red-500">{state.errors.email[0]}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending Code...
                                </>
                            ) : (
                                "Send Reset Code"
                            )}
                        </Button>

                        {state?.success && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700 text-center">
                                <p>Code sent! Check your phone (simulated in console).</p>
                                <Link
                                    href={`/reset-password?email=${encodeURIComponent(emailInput)}`}
                                    className="font-bold underline ml-1"
                                >
                                    Go to Reset Page
                                </Link>
                                <p className="text-[10px] mt-1 text-blue-500 italic">In a real app, you'd be redirected or check your SMS.</p>
                            </div>
                        )}

                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
