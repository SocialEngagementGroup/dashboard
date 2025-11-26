"use client"

import { useState } from "react"
import { User } from "@prisma/client"
import { Camera, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfilePhotoUpload({ user }: { user: User }) {
    const [open, setOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState(user.image || "")
    const [isHovered, setIsHovered] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const file = (e.currentTarget.elements.namedItem('photo') as HTMLInputElement).files?.[0]

        if (!file) return

        formData.append('file', file)

        try {
            const response = await fetch('/api/profile/photo', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                setOpen(false)
                window.location.reload()
            }
        } catch (error) {
            console.error('Failed to update photo:', error)
        }
    }

    const initial = user.name?.charAt(0).toUpperCase() || 'U'
    const currentImage = user.image

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg overflow-hidden">
                {currentImage ? (
                    <img src={currentImage} alt={user.name || 'Profile'} className="h-full w-full object-cover" />
                ) : (
                    initial
                )}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className={`absolute inset-0 rounded-full bg-black/60 flex items-center justify-center cursor-pointer transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="text-center text-white">
                            <Camera className="h-8 w-8 mx-auto mb-1" />
                            <p className="text-xs font-medium">Change Photo</p>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Profile Photo</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="photo">Profile Photo</Label>
                            <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setImageUrl(URL.createObjectURL(file))
                                    }
                                }}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Upload a new profile photo (JPG, PNG, GIF)
                            </p>
                        </div>
                        {imageUrl && (
                            <div className="space-y-2">
                                <Label>Preview</Label>
                                <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-gray-200 mx-auto">
                                    <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                            </div>
                        )}
                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                <Upload className="h-4 w-4 mr-2" />
                                Update Photo
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
