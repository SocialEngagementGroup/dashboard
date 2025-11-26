"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    FileText,
    Calendar,
    LogOut,
    User
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Employees",
        href: "/admin/employees",
        icon: Users,
    },
    {
        title: "Notices",
        href: "/admin/notices",
        icon: FileText,
    },
    {
        title: "Leaves",
        href: "/admin/leaves",
        icon: Calendar,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/login" })
    }

    return (
        <div className="flex h-full w-64 flex-col border-r" style={{ backgroundColor: '#5c3333ff' }}>
            <div className="flex h-14 items-center border-b border-white/20 px-6">
                <Link className="flex items-center gap-2 font-semibold text-white" href="/admin">
                    <Image
                        src="/uploads/SEG-Favicon-White.png"
                        alt="SEG Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                    />
                    <span className="">SEG Admin Panel</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-base font-medium">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ease-in-out hover:text-white hover:bg-white/15",
                                pathname === item.href
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-white/70"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4">
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/profile"
                        className={cn(
                            "flex-1 flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ease-in-out hover:text-white hover:bg-white/15",
                            pathname === "/admin/profile"
                                ? "bg-white/20 text-white shadow-sm"
                                : "text-white/70"
                        )}
                    >
                        <User className="h-5 w-5" />
                        <span className="text-base font-medium">My Profile</span>
                    </Link>
                    <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-white/15 rounded-lg shrink-0"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Sign Out</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
