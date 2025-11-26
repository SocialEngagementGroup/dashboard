"use client"

import { useActionState, useState, useEffect } from "react"
import { applyForLeave, LeaveFormState } from "@/lib/actions/apply-leave"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, differenceInDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

export function LeaveApplicationForm() {
    const initialState: LeaveFormState = { message: undefined, errors: {} }
    const [state, dispatch, isPending] = useActionState(applyForLeave, initialState)
    const [date, setDate] = useState<DateRange | undefined>()
    const [duration, setDuration] = useState<number>(0)

    useEffect(() => {
        if (date?.from && date?.to) {
            const days = differenceInDays(date.to, date.from) + 1
            setDuration(days)
        } else if (date?.from) {
            setDuration(1)
        } else {
            setDuration(0)
        }
    }, [date])

    return (
        <form action={dispatch} className="space-y-6">
            {/* Hidden inputs for server action */}
            <input type="hidden" name="startDate" value={date?.from ? format(date.from, "yyyy-MM-dd") : ""} />
            <input type="hidden" name="endDate" value={date?.to ? format(date.to, "yyyy-MM-dd") : (date?.from ? format(date.from, "yyyy-MM-dd") : "")} />

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Leave Type</Label>
                    <Select name="type" required>
                        <SelectTrigger className="w-full">
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

                <div className="space-y-2">
                    <Label>Date Range {duration > 0 && <span className="text-muted-foreground font-normal ml-2">({duration} {duration === 1 ? 'day' : 'days'})</span>}</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                        </PopoverContent>
                    </Popover>
                    {(state?.errors?.startDate || state?.errors?.endDate) && (
                        <p className="text-sm text-red-500">Please select a valid date range</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Brief reason for leave..."
                    required
                    className="min-h-[100px]"
                />
                {state?.errors?.reason && (
                    <p className="text-sm text-red-500">{state.errors.reason}</p>
                )}
            </div>

            {state?.message && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Request"}
            </Button>
        </form>
    )
}
