import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DocumentList({ documents, emptyMessage }: { documents: any[], emptyMessage: string }) {
    if (documents.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <Badge variant="secondary" className="text-xs">PDF</Badge>
                            </div>
                            <CardTitle className="text-base line-clamp-2 mt-2" title={doc.title}>
                                {doc.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 text-xs">
                                {new Date(doc.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" size="sm" className="w-full hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors" asChild>
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
