"use client"

import { useActionState } from "react"
import { createNotice, NoticeFormState } from "@/lib/actions/notice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewNoticePage() {
    const initialState: NoticeFormState = { message: undefined, errors: {} }
    const [state, dispatch, isPending] = useActionState(createNotice, initialState)

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
            <h1 className="text-3xl font-bold">Create Notice</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Notice Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={dispatch} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" placeholder="Important Announcement" required />
                            {state?.errors?.title && (
                                <p className="text-sm text-red-500">{state.errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="Write your announcement here..."
                                className="min-h-[150px]"
                                required
                            />
                            {state?.errors?.content && (
                                <p className="text-sm text-red-500">{state.errors.content}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="isPinned" name="isPinned" className="h-4 w-4 rounded border-gray-300" />
                            <Label htmlFor="isPinned">Pin to top</Label>
                        </div>

                        {state?.message && (
                            <p className="text-sm text-red-500">{state.message}</p>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit">Publish Notice</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
