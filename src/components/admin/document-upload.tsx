"use client"

import { useState } from "react"
import { uploadDocument, deleteDocument } from "@/lib/actions/document"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
// import { Document } from "@prisma/client"
import { Trash2, FileText, Download } from "lucide-react"

type DocumentUploadProps = {
    userId: string
    documents: any[]
}

export function DocumentUpload({ userId, documents }: DocumentUploadProps) {
    const [isUploading, setIsUploading] = useState(false)

    async function handleUpload(formData: FormData) {
        setIsUploading(true)
        formData.append("userId", userId)
        await uploadDocument(formData)
        setIsUploading(false)
        // Reset form or show success message
        const form = document.getElementById("upload-form") as HTMLFormElement
        form?.reset()
    }

    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this document?")) {
            await deleteDocument(id)
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-medium">Upload New Document</h3>
                <form id="upload-form" action={handleUpload} className="grid gap-4 md:grid-cols-3 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="title">Document Title</Label>
                        <Input id="title" name="title" placeholder="e.g. Salary Slip Oct 2023" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Document Type</Label>
                        <Select name="type" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SALARY_SLIP">Salary Slip</SelectItem>
                                <SelectItem value="PERFORMANCE_REVIEW">Performance Review</SelectItem>
                                <SelectItem value="SOP">SOP / Policy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file">File</Label>
                        <Input id="file" name="file" type="file" required />
                    </div>
                    <div className="md:col-span-3">
                        <Button type="submit" disabled={isUploading}>
                            {isUploading ? "Uploading..." : "Upload Document"}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Uploaded Documents</h3>
                {documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {documents.map((doc: any) => (
                            <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="font-medium">{doc.title}</p>
                                        <p className="text-xs text-muted-foreground">{doc.type.replace("_", " ")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                                            <Download className="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
