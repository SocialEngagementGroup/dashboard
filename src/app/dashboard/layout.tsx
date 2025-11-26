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
                <header className="flex h-14 items-center gap-4 border-b bg-gray-50/40 px-6 dark:bg-gray-800/40 md:hidden">
                    <span className="font-semibold">Employee Portal</span>
                </header>
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
