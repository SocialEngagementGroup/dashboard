import Image from "next/image"
import { EmployeeSidebar } from "@/components/dashboard/sidebar"

export default function EmployeeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <div className="hidden md:block">
                <EmployeeSidebar />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-14 items-center gap-4 border-b border-white/20 px-6 md:hidden" style={{ backgroundColor: '#5c3333ff' }}>
                    <Image
                        src="/uploads/SEG-Favicon-White.png"
                        alt="SEG Logo"
                        width={28}
                        height={28}
                        className="object-contain"
                    />
                    <span className="font-semibold text-white">Social Engagement Group</span>
                </header>
                <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                    {children}
                </main>
            </div>
        </div>
    )
}
