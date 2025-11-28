"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight } from "lucide-react"
import { TeamMemberCard } from "./team-member-card"

type TeamMember = {
    id: string
    name: string | null
    email: string | null
    designation: string | null
    department: string | null
    role: string
}

type DepartmentSectionProps = {
    department: string
    members: TeamMember[]
}

export function DepartmentSection({ department, members }: DepartmentSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true)

    return (
        <Card>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3">
                    {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <CardTitle className="text-xl">{department}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                        ({members.length} {members.length === 1 ? 'member' : 'members'})
                    </span>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent>
                    {members.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No team members in this department yet.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {members.map((member) => (
                                <TeamMemberCard key={member.id} member={member} />
                            ))}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    )
}
