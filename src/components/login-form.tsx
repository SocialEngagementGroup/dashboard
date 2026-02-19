"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loadingProvider, setLoadingProvider] = useState<"credentials" | "google" | null>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        const authError = searchParams.get("error")
        if (authError) {
            toast.error("Account Access Restricted", {
                description: "Sorry, your account was not found in our system. Please contact the Admin to create your account.",
                duration: 5000,
            })
            setError("Access denied. Please contact the Admin to create your account.")
        }
    }, [searchParams])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoadingProvider("credentials")
        setError("")

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                // Check if it's a "User not found" scenario (Credentials provider returns null on any failure, but we can treat it as unauthorized)
                setLoadingProvider(null)

                // The requirements specifically asked for this popup message if unauthorized
                toast.error("Account Access Restricted", {
                    description: "Sorry, your account was not found in our system. Please contact the Admin to create your account.",
                    duration: 5000,
                })

                setError("Invalid credentials. Please contact the Admin if you believe this is an error.")
                return
            }

            // Fetch user to determine role and redirect appropriately
            const response = await fetch("/api/user")
            const user = await response.json()

            if (user.role === "ADMIN") {
                router.push("/admin")
            } else {
                router.push("/dashboard")
            }

            router.refresh()
        } catch (error) {
            setError("Something went wrong. Please try again.")
            setLoadingProvider(null)
        }
    }

    const handleGoogleLogin = () => {
        setLoadingProvider("google")
        signIn("google", {
            callbackUrl: "/auth-callback",
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loadingProvider !== null}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loadingProvider !== null}
                />
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={loadingProvider !== null}>
                {loadingProvider === "credentials" ? "Signing in..." : "Sign In with Email"}
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={loadingProvider !== null}
            >
                {loadingProvider === "google" ? (
                    "Redirecting..."
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24-.19-.6z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </div>
                )}
            </Button>
        </form>
    )
}
