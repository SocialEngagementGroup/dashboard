import { prisma } from "@/lib/prisma"
// import { Document as PrismaDocument } from "@prisma/client"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DocumentsPage() {
    const session = await auth()
    if (!session?.user) return null

    // Use session.user.id for queries, falling back to email if needed
    const userId = session.user.id || session.user.email

    const documents = await prisma.document.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    const salarySlips = documents.filter(d => d.type === 'SALARY_SLIP')
    const performanceReviews = documents.filter(d => d.type === 'PERFORMANCE_REVIEW')
    const sops = documents.filter(d => d.type === 'SOP')

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Document Management</h1>

            <Tabs defaultValue="salary" className="w-full">
                <TabsList>
                    <TabsTrigger value="salary">Salary Slips</TabsTrigger>
                    <TabsTrigger value="performance">Performance Reviews</TabsTrigger>
                    <TabsTrigger value="sops">SOPs & Policies</TabsTrigger>
                </TabsList>

                <TabsContent value="salary" className="mt-6">
                    <DocumentList documents={salarySlips} emptyMessage="No salary slips found." />
                </TabsContent>

                <TabsContent value="performance" className="mt-6">
                    <DocumentList documents={performanceReviews} emptyMessage="No performance reviews found." />
                </TabsContent>

                <TabsContent value="sops" className="mt-6">
                    <DocumentList documents={sops} emptyMessage="No SOPs or policies found." />
                </TabsContent>
            </Tabs>
        </div>
    )
}

function DocumentList({ documents, emptyMessage }: { documents: any[], emptyMessage: string }) {
    if (documents.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                {emptyMessage}
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc: any) => (
                <Card key={doc.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base line-clamp-1" title={doc.title}>
                                {doc.title}
                            </CardTitle>
                            <CardDescription>
                                {new Date(doc.createdAt).toLocaleDateString()}
                            </CardDescription>
                        </div>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                            <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
