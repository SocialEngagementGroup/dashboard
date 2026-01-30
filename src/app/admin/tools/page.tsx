export const dynamic = "force-dynamic"

import { getTools } from "@/actions/tools"
import { ToolsClient } from "@/components/admin/tools-client"
import { prisma as db } from "@/lib/prisma"

export default async function ToolsPage() {
    const { tools } = await getTools()

    const newToolRequests = await db.tool.findMany({
        where: {
            email: null,
        },
        include: {
            requests: {
                include: {
                    user: true
                },
                where: {
                    status: "PENDING"
                },
                take: 1
            }
        },
        orderBy: { createdAt: "desc" }
    })

    return (
        <ToolsClient
            initialTools={tools || []}
            newToolRequests={newToolRequests}
        />
    )
}
