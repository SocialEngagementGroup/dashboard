import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function StatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-l-4 border-l-gray-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-12 mb-2" />
                        <Skeleton className="h-3 w-20" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function NoticesSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <Skeleton className="h-7 w-40 mb-4" />
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-3/4" />
                        </div>
                        <Skeleton className="h-3 w-24 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function OutTodaySkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <Skeleton className="h-7 w-40 mb-4" />
            <Card>
                <CardContent className="pt-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 mb-4 last:mb-0">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
