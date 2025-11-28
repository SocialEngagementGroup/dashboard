import { auth } from "@/auth"
import { getAvailableTools } from "@/actions/tools"
import { EmployeeToolsClient } from "@/components/dashboard/tools-client"
import { redirect } from "next/navigation"
import { prisma as db } from "@/lib/prisma"

export default async function EmployeeToolsPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    // Get available tools with user's request status
    const { tools } = await getAvailableTools(session.user.id)

    // Get all user's tool requests
    const requests = await db.toolRequest.findMany({
        where: { userId: session.user.id },
        include: {
            tool: true
        },
        orderBy: { createdAt: "desc" }
    })

    // Transform requests to match the expected format
    const formattedRequests = requests.map((req: typeof requests[number]) => ({
        id: req.id,
        name: req.tool.name,
        url: req.tool.url,
        description: req.tool.description,
        status: req.status,
        createdAt: req.createdAt
    }))

    return <EmployeeToolsClient initialTools={tools || []} initialRequests={formattedRequests} />
}
