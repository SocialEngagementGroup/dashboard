"use client"

import { useFormState } from "react-dom"
import { updateBankingDetails, BankingFormState } from "@/lib/actions/banking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@prisma/client"

export function BankingForm({ user }: { user: User }) {
    const initialState: BankingFormState = { message: undefined, errors: {} }
    const [state, dispatch] = useFormState(updateBankingDetails, initialState)

    return (
        <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                    id="bankName"
                    name="bankName"
                    defaultValue={user.bankName || ''}
                    placeholder="Bank of America"
                    required
                />
                {state?.errors?.bankName && (
                    <p className="text-sm text-red-500">{state.errors.bankName}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                    id="accountNumber"
                    name="accountNumber"
                    defaultValue={user.accountNumber || ''}
                    placeholder="1234567890"
                    required
                />
                {state?.errors?.accountNumber && (
                    <p className="text-sm text-red-500">{state.errors.accountNumber}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                        id="routingNumber"
                        name="routingNumber"
                        defaultValue={user.routingNumber || ''}
                    />
                    {state?.errors?.routingNumber && (
                        <p className="text-sm text-red-500">{state.errors.routingNumber}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="swiftCode">SWIFT Code</Label>
                    <Input
                        id="swiftCode"
                        name="swiftCode"
                        defaultValue={user.swiftCode || ''}
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

            <Button type="submit" className="w-full">Update Banking Details</Button>
        </form>
    )
}
