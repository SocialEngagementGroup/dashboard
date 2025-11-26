"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    User,
    Calendar,
    FileText,
    LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        title: "Home",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Profile",
        href: "/dashboard/profile",
        icon: User,
    },
    {
        title: "Leave",
        href: "/dashboard/leave",
        icon: Calendar,
    },
    {
        title: "Documents",
        href: "/dashboard/documents",
        icon: FileText,
    },
]

export function EmployeeSidebar() {
    const pathname = usePathname()

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/login" })
    }

    return (
        <div className="flex h-full w-64 flex-col border-r bg-gray-50/40 dark:bg-gray-800/40">
            <div className="flex h-14 items-center border-b px-6">
                <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
                    <span className="">Employee Portal</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 dark:hover:text-gray-50",
                                pathname === item.href
                                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                                    : "text-gray-500 dark:text-gray-400"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4">
                <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="w-full justify-start text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
