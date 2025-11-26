"use client"

import { useState } from "react"
import { requestTool } from "@/lib/actions/tools"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export function ToolRequestForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const result = await requestTool(formData)

        if (result.success) {
            setMessage({ type: 'success', text: 'Tool request submitted successfully!' })
            e.currentTarget.reset()
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to submit request' })
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Tool Name *</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Figma, Adobe Creative Cloud"
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="url">Tool URL *</Label>
                <Input
                    id="url"
                    name="url"
                    type="url"
                    placeholder="https://..."
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Why do you need this tool?"
                    rows={3}
                    disabled={isLoading}
                />
            </div>

            {message && (
                <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {message.text}
                </p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
            </Button>
        </form>
    )
}
