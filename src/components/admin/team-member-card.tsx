"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Mail, Edit, MessageSquare, ExternalLink, Copy } from "lucide-react"
import { useState } from "react"
import { EditTeamMemberModal } from "./edit-team-member-modal"

type TeamMember = {
    id: string
    name: string | null
    email: string | null
    designation: string | null
    department: string | null
    role: string
}

type TeamMemberCardProps = {
    member: TeamMember
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Get initials for avatar
    const getInitials = (name: string | null) => {
        if (!name) return "?"
        const parts = name.split(" ")
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        }
        return name[0].toUpperCase()
    }

    const handleChatClick = () => {
        if (member.email) {
            // Google Chat link format
            window.open(`https://mail.google.com/chat/u/0/#chat/dm/${member.email}`, '_blank')
        }
    }

    return (
        <>
            <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-800 overflow-hidden group">
                <CardContent className="p-0 flex h-full relative">
                    {/* Edit Icon - Top Right */}
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute top-2 right-2 z-10 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Edit member"
                    >
                        <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>

                    {/* Left Section: Profile Photo (Circle) */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 ml-3 my-auto text-white text-base sm:text-lg font-semibold shadow-md group-hover:scale-105 transition-transform duration-200">
                        {getInitials(member.name)}
                    </div>

                    {/* Right Section: Info */}
                    <div className="flex-1 p-2.5 pr-10 flex flex-col justify-center gap-0.5 min-w-0">
                        {/* Line 1: Name */}
                        <h3 className="font-bold text-base truncate leading-tight" title={member.name || ''}>
                            {member.name || 'N/A'}
                        </h3>

                        {/* Line 2: Designation */}
                        <p className="text-xs text-muted-foreground truncate leading-tight" title={member.designation || ''}>
                            {member.designation || 'No designation'}
                        </p>

                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                        {/* Line 3: Google Chat */}
                        <div
                            className={`flex items-center gap-1.5 text-xs truncate py-0.5 ${member.email ? 'text-muted-foreground hover:text-primary cursor-pointer transition-colors' : 'text-muted-foreground/50'}`}
                            onClick={member.email ? handleChatClick : undefined}
                            title={member.email ? 'Click to chat on Google' : 'No email available'}
                        >
                            <MessageSquare className="h-3 w-3 flex-shrink-0 text-indigo-500" />
                            <span className="truncate">Google Chat</span>
                            {member.email && (
                                <ExternalLink className="h-2.5 w-2.5 flex-shrink-0 opacity-60" />
                            )}
                        </div>

                        {/* Line 4: Email */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground py-0.5 min-w-0">
                            <Mail className="h-3 w-3 flex-shrink-0 text-indigo-500" />
                            <span className="truncate" title={member.email || ''}>{member.email || 'No email'}</span>
                            {member.email && (
                                <div
                                    className="cursor-pointer hover:text-primary transition-colors flex-shrink-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(member.email || '');
                                    }}
                                    title="Copy email"
                                >
                                    <Copy className="h-3 w-3" />
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditTeamMemberModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                member={member}
            />
        </>
    )
}
