"use client"

import { useActionState } from "react"
import { applyForLeave, LeaveFormState } from "@/lib/actions/apply-leave"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function LeaveApplicationForm() {
    const initialState: LeaveFormState = { message: undefined, errors: {} }
    const [state, dispatch, isPending] = useActionState(applyForLeave, initialState)

    return (
        <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="type">Leave Type</Label>
                <Select name="type" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                        <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                    </SelectContent>
                </Select>
                {state?.errors?.type && (
                    <p className="text-sm text-red-500">{state.errors.type}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input type="date" id="startDate" name="startDate" required />
                    {state?.errors?.startDate && (
                        <p className="text-sm text-red-500">{state.errors.startDate}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input type="date" id="endDate" name="endDate" required />
                    {state?.errors?.endDate && (
                        <p className="text-sm text-red-500">{state.errors.endDate}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea id="reason" name="reason" placeholder="Brief reason for leave..." required />
                {state?.errors?.reason && (
                    <p className="text-sm text-red-500">{state.errors.reason}</p>
                )}
            </div>

            {state?.message && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}

            <Button type="submit" className="w-full">Submit Request</Button>
        </form>
    )
}
