"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

export function EstClock() {
    const [time, setTime] = useState<string>("")

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            const estTime = now.toLocaleTimeString("en-US", {
                timeZone: "America/New_York",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            })
            setTime(estTime)
        }

        updateTime()
        const interval = setInterval(updateTime, 1000)

        return () => clearInterval(interval)
    }, [])

    if (!time) return null

    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium font-mono text-gray-700 dark:text-gray-200">
                {time} EST
            </span>
        </div>
    )
}
