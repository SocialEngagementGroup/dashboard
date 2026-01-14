"use client"

import { useState } from "react"
// import { User } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Building2, CreditCard, MapPin, Hash, Globe, UserCircle, Pencil } from "lucide-react"
import { BankingForm } from "./banking-form"

export function BankingSection({ user }: { user: any }) {
    const [open, setOpen] = useState(false)

    return (
        <Card className="hover:shadow-md transition-shadow duration-200 relative border-l-4 border-l-orange-500">
            <div className="absolute top-4 right-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Banking Details</DialogTitle>
                        </DialogHeader>
                        <BankingForm user={user} onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Column 1: Header & Actions */}
                <div className="flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <Building2 className="h-5 w-5" />
                            Banking Information
                        </h3>
                        <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                            Last updated: {new Date(user.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Column 2: Bank & Branch */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Bank Name
                        </p>
                        <p className="font-medium">{user.bankName || "Not set"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Branch Name
                        </p>
                        <p className="font-medium">{user.branchName || "Not set"}</p>
                    </div>
                </div>

                {/* Column 3: Account Details */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <UserCircle className="h-4 w-4" />
                            Account Name
                        </p>
                        <p className="font-medium">{user.bankAccountName || "Not set"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Account Number
                        </p>
                        <p className="font-medium">{user.accountNumber || "Not set"}</p>
                    </div>
                </div>

                {/* Column 4: Routing & Swift */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Routing Number
                        </p>
                        <p className="font-medium">{user.routingNumber || "Not set"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            SWIFT Code
                        </p>
                        <p className="font-medium">{user.swiftCode || "Not set"}</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
