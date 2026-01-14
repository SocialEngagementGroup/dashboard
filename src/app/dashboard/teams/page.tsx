import { prisma } from "@/lib/prisma"
import { EmployeeDepartmentSection } from "@/components/dashboard/employee-department-section"

export const dynamic = 'force-dynamic'

export default async function EmployeeTeamsPage() {
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
    const usersByDepartment = departments.reduce((acc: any, dept: any) => {
        acc[dept.name] = users.filter((u: any) => u.department === dept.name)
        return acc
    }, {} as Record<string, typeof users>)

    return (
        <div className="flex flex-col gap-6 fade-in">
            <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Teams
                </h1>
                <p className="text-muted-foreground mt-1">
                    Connect with your team members
                </p>
            </div>

            {/* Department Sections */}
            <div className="space-y-4">
                {departments.map((department: { id: string; name: string }) => (
                    <EmployeeDepartmentSection
                        key={department.id}
                        department={department.name}
                        members={usersByDepartment[department.name] || []}
                    />
                ))}
            </div>
        </div>
    )
}
