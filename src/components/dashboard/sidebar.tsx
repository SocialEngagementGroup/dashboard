"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    User,
    Users,
    Calendar,
    CircleDollarSign,
    TrendingUp,
    BookOpen,
    Wrench,
    LogOut,
    FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarGroups = [
    {
        label: "Main",
        items: [
            {
                title: "Home",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ]
    },
    {
        label: "My Work",
        items: [
            {
                title: "Leave",
                href: "/dashboard/leave",
                icon: Calendar,
            },
            {
                title: "Tools",
                href: "/dashboard/tools",
                icon: Wrench,
            },
            {
                title: "Documents",
                href: "/dashboard/documents",
                icon: FileText,
            },
        ]
    },
    {
        label: "Organization",
        items: [
            {
                title: "Teams",
                href: "/dashboard/teams",
                icon: Users,
            },
            {
                title: "Resources",
                href: "/dashboard/resources",
                icon: BookOpen,
            },
        ]
    },
    {
        label: "Personal",
        items: [
            {
                title: "Salary",
                href: "/dashboard/salary",
                icon: CircleDollarSign,
            },
            {
                title: "Performance",
                href: "/dashboard/performance",
                icon: TrendingUp,
            },
        ]
    }
]

export function EmployeeSidebar() {
    const pathname = usePathname()

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/login" })
    }

    return (
        <div className="flex h-full w-64 flex-col border-r" style={{ backgroundColor: '#5c3333ff' }}>
            <div className="flex h-14 items-center border-b border-white/20 px-6">
                <Link className="flex items-center gap-2 font-semibold text-white" href="/dashboard">
                    <Image
                        src="/uploads/SEG-Favicon-White.png"
                        alt="SEG Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                    />
                    <span className="">SEG Dashboard</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-base font-medium gap-6">
                    {sidebarGroups.map((group, index) => (
                        <div key={index} className="space-y-2">
                            <h3 className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider">
                                {group.label}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => (
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
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4">
                <div className="flex items-center gap-2">
                    <Link
                        href="/dashboard/profile"
                        className={cn(
                            "flex-1 flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ease-in-out hover:text-white hover:bg-white/15",
                            pathname === "/dashboard/profile"
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
