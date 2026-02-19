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
        <div className="flex h-full w-64 flex-col border-r bg-[var(--sidebar-bg)] overflow-hidden">
            <div className="flex h-16 items-center px-6 bg-[var(--brand-gradient)] shadow-md">
                <Link className="flex items-center gap-2 font-bold text-white tracking-tight" href="/dashboard">
                    <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm border border-white/20">
                        <Image
                            src="/uploads/SEG-Favicon-White.png"
                            alt="SEG Logo"
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                    </div>
                    <span className="text-lg">SEG Dashboard</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-6">
                <nav className="grid items-start px-4 text-sm font-medium gap-8">
                    {sidebarGroups.map((group, index) => (
                        <div key={index} className="space-y-3">
                            <h3 className="px-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                                {group.label}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-300 ease-out group",
                                            pathname === item.href
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                                            pathname === item.href ? "text-white" : "text-slate-500 group-hover:text-indigo-400"
                                        )} />
                                        <span>{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4 border-t border-white/5 bg-black/10">
                <div className="flex items-center gap-1">
                    <Link
                        href="/dashboard/profile"
                        className={cn(
                            "flex-1 flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-300 group",
                            pathname === "/dashboard/profile"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <User className={cn(
                            "h-5 w-5 transition-transform duration-300 group-hover:rotate-12",
                            pathname === "/dashboard/profile" ? "text-white" : "text-slate-500 group-hover:text-indigo-400"
                        )} />
                        <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl shrink-0 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Sign Out</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
