"use client"

import { useState, useEffect, useActionState, useCallback } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react"
import { setupPassword } from "@/lib/actions/setup-password"

type FormStep = "EMAIL" | "PASSWORD" | "SETUP"

export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [step, setStep] = useState<FormStep>("EMAIL")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [loadingProvider, setLoadingProvider] = useState<"credentials" | "google" | null>(null)
    const [error, setError] = useState("")
    const [setupState, setupDispatch, isSetupPending] = useActionState(setupPassword, null)

    useEffect(() => {
        const authError = searchParams.get("error")
        if (authError) {
            toast.error("Account Access Restricted", {
                description: "Sorry, your account was not found in our system. Please contact the Admin to create your account.",
                duration: 5000,
            })
            setError("Access denied. Please contact the Admin to create your account.")
        }

        if (searchParams.get("setup") === "success") {
            toast.success("Password set successfully! Please log in.")
        }
    }, [searchParams])

    useEffect(() => {
        if (setupState?.success) {
            toast.success("Password set successfully! Logging you in...")
            // Auto-login after password setup
            const formData = new FormData()
            handleLoginSubmit({ preventDefault: () => { } } as React.FormEvent)
        } else if (setupState?.message) {
            toast.error(setupState.message)
        }
    }, [setupState])


    const handleEmailSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!email || !email.includes("@")) return

        setIsChecking(true)
        setError("")

        try {
            const response = await fetch(`/api/auth/check-setup?email=${encodeURIComponent(email)}`)
            const data = await response.json()

            if (!data.exists) {
                toast.error("Account Not Found", {
                    description: "Sorry, your email was not found in our system. Please contact the Admin.",
                })
                setIsChecking(false)
                return
            }

            if (data.needsPassword) {
                setStep("SETUP")
            } else {
                setStep("PASSWORD")
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsChecking(false)
        }
    }

    async function handleLoginSubmit(e: React.FormEvent) {
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
                setLoadingProvider(null)
                toast.error("Invalid credentials", {
                    description: "Please check your password and try again.",
                })
                setError("Invalid password.")
                return
            }

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

    const resetForm = () => {
        setStep("EMAIL")
        setPassword("")
        setError("")
    }

    return (
        <div className="space-y-4">
            {step === "EMAIL" && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative group">
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isChecking || loadingProvider !== null}
                                className="pr-12 h-11 transition-all focus-visible:ring-[#5c3333]"
                            />
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center pr-1">
                                {isChecking ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                                ) : (
                                    <Button
                                        type="submit"
                                        size="icon"
                                        variant="ghost"
                                        disabled={!email || !email.includes("@")}
                                        className="h-8 w-8 text-[#5c3333] hover:bg-[#5c3333]/10 rounded-full transition-all"
                                    >
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {step === "PASSWORD" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <span className="text-sm font-medium text-muted-foreground truncate">{email}</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-muted-foreground hover:text-[#5c3333] transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loadingProvider !== null}
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
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loadingProvider !== null}>
                        {loadingProvider === "credentials" ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            )}

            {step === "SETUP" && (
                <form action={setupDispatch} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] font-bold text-[#5c3333] tracking-wider uppercase">New Account Setup</span>
                            <span className="text-sm font-medium text-muted-foreground truncate">{email}</span>
                        </div>
                    </div>

                    <input type="hidden" name="email" value={email} />

                    <div className="space-y-2">
                        <Label htmlFor="reg-password">Set Password</Label>
                        <div className="relative">
                            <Input
                                id="reg-password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                required
                                minLength={6}
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
                    </div>

                    <Button type="submit" className="w-full" disabled={isSetupPending}>
                        {isSetupPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Setting Password...
                            </>
                        ) : (
                            "Set Password & Continue"
                        )}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground bg-slate-50 p-2 rounded border border-dashed">
                        Since this is your first time, please create a password for your account to continue.
                    </p>
                </form>
            )}

            {step === "EMAIL" && (
                <>
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
                        disabled={loadingProvider !== null || isChecking}
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
                </>
            )}
        </div>
    )
}
