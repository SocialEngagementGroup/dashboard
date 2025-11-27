import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const curDate = new Date(startDate);
  const end = new Date(endDate);

  // Normalize times to start of day to avoid time-based issues
  curDate.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  while (curDate <= end) {
    const dayOfWeek = curDate.getDay();
    // 0 is Sunday, 6 is Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}
