import { Suspense } from "react"
import { EstClock } from "@/components/est-clock"
import { StatCards } from "@/components/dashboard/stat-cards"
import { NoticeBoard } from "@/components/dashboard/notice-board"
import { OutTodayBoard } from "@/components/dashboard/out-today-board"
import { StatsSkeleton, NoticesSkeleton, OutTodaySkeleton } from "@/components/dashboard/skeletons"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold brand-text-gradient">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening today</p>
                </div>
                <EstClock />
            </div>

            {/* Quick Stats - Streamed */}
            <Suspense fallback={<StatsSkeleton />}>
                <StatCards />
            </Suspense>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    {/* Notices - Streamed */}
                    <Suspense fallback={<NoticesSkeleton />}>
                        <NoticeBoard />
                    </Suspense>
                </div>

                <div className="md:col-span-1">
                    {/* Who's Out - Streamed */}
                    <Suspense fallback={<OutTodaySkeleton />}>
                        <OutTodayBoard />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
