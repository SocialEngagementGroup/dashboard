"use client"

import { useEffect, useActionState } from "react"
import { updateBankingDetails, BankingFormState } from "@/lib/actions/banking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@prisma/client"
import { Building2, CreditCard, MapPin, Hash, Globe, UserCircle } from "lucide-react"

export function BankingForm({ user, onSuccess }: { user: User; onSuccess?: () => void }) {
    const initialState: BankingFormState = { message: undefined, errors: {} }
    const [state, dispatch, isPending] = useActionState(updateBankingDetails, initialState)

    useEffect(() => {
        if (state?.message?.includes("Success") && onSuccess) {
            onSuccess()
        }
    }, [state, onSuccess])

    return (
        <form action={dispatch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="bankName" className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        Bank Name
                    </Label>
                    <Input
                        id="bankName"
                        name="bankName"
                        defaultValue={user.bankName || ''}
                        placeholder="BRAC Bank PLC"
                        required
                        className="bg-gray-50 dark:bg-gray-900"
                    />
                    {state?.errors?.bankName && (
                        <p className="text-sm text-red-500">{state.errors.bankName}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="branchName" className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        Branch Name
                    </Label>
                    <Input
                        id="branchName"
                        name="branchName"
                        defaultValue={user.branchName || ''}
                        placeholder="SADARGHAT BRANCH"
                        className="bg-gray-50 dark:bg-gray-900"
                    />
                    {state?.errors?.branchName && (
                        <p className="text-sm text-red-500">{state.errors.branchName}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bankAccountName" className="flex items-center gap-2 text-muted-foreground">
                        <UserCircle className="h-4 w-4" />
                        Account Name
                    </Label>
                    <Input
                        id="bankAccountName"
                        name="bankAccountName"
                        defaultValue={user.bankAccountName || ''}
                        placeholder="DHRUBA DATTA"
                        required
                        className="bg-gray-50 dark:bg-gray-900"
                    />
                    {state?.errors?.bankAccountName && (
                        <p className="text-sm text-red-500">{state.errors.bankAccountName}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        Account Number
                    </Label>
                    <Input
                        id="accountNumber"
                        name="accountNumber"
                        defaultValue={user.accountNumber || ''}
                        placeholder="1073981100001"
                        required
                        className="bg-gray-50 dark:bg-gray-900"
                    />
                    {state?.errors?.accountNumber && (
                        <p className="text-sm text-red-500">{state.errors.accountNumber}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="routingNumber" className="flex items-center gap-2 text-muted-foreground">
                        <Hash className="h-4 w-4" />
                        Routing Number
                    </Label>
                    <Input
                        id="routingNumber"
                        name="routingNumber"
                        defaultValue={user.routingNumber || ''}
                        placeholder="060276287"
                        className="bg-gray-50 dark:bg-gray-900"
                    />
                    {state?.errors?.routingNumber && (
                        <p className="text-sm text-red-500">{state.errors.routingNumber}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="swiftCode" className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        SWIFT Code
                    </Label>
                    <Input
                        id="swiftCode"
                        name="swiftCode"
                        defaultValue={user.swiftCode || ''}
                        placeholder="BRAKBDDH"
                        className="bg-gray-50 dark:bg-gray-900"
                    />
                    {state?.errors?.swiftCode && (
                        <p className="text-sm text-red-500">{state.errors.swiftCode}</p>
                    )}
                </div>
            </div>

            {state?.message && (
                <p className={`text-sm ${state.message.includes("Success") ? "text-green-600" : "text-red-500"}`}>
                    {state.message}
                </p>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                Update Banking Details
            </Button>
        </form>
    )
}
