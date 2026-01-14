import { prisma } from "@/lib/prisma"
import { DepartmentSection } from "@/components/admin/department-section"
import { DepartmentManagement } from "@/components/admin/department-management"

export const dynamic = 'force-dynamic'

export default async function TeamsPage() {
    // Fetch departments from database
    const departments = await prisma.department.findMany({
        orderBy: { order: 'asc' }
    })

    // Fetch all users grouped by department
    const users = await prisma.user.findMany({
        orderBy: [
            { department: 'asc' },
            { name: 'asc' }
        ],
        select: {
            id: true,
            name: true,
            email: true,
            designation: true,
            department: true,
            role: true
        }
    })

    // Group users by department
    const usersByDepartment = departments.reduce((acc, dept) => {
        acc[dept.name] = users.filter(u => u.department === dept.name)
        return acc
    }, {} as Record<string, typeof users>)

    return (
        <div className="flex flex-col gap-6 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Teams
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Organizational structure and team members
                    </p>
                </div>
                <DepartmentManagement departments={departments} />
            </div>

            {/* Department Sections */}
            <div className="space-y-4">
                {departments.map((department: any) => (
                    <DepartmentSection
                        key={department.id}
                        department={department.name}
                        members={usersByDepartment[department.name] || []}
                    />
                ))}
            </div>
        </div>
    )
}
