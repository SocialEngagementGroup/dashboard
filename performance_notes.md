# Performance Notes

This document tracks performance optimizations, metrics, and future recommendations for the Social Engagement Group Dashboard.

## Optimizations Implemented

### 1. Parallel Data Fetching
- **Dashboard (`/dashboard`)**: Optimized to fetch notices, approved leaves, and user-specific leave requests concurrently using `Promise.all`.
- **Admin Overview (`/admin`)**: Parallelized counts for employees, pending leaves, and notices.
- **Admin Employees (`/admin/employees`)**: Parallelized fetching of employees, managers, and departments.

### 2. Perceived Performance (Skeleton Loaders)
- **Skeleton Component**: Added a generic `Skeleton` UI component for consistent loading states.
- **Loading UI**: Implemented `loading.tsx` for:
    - Main Dashboard (`/dashboard`)
    - Admin Overview (`/admin`)
    - Admin Employees (`/admin/employees`)
    - Admin Leaves (`/admin/leaves`)
    - Admin Notices (`/admin/notices`)

## Future Recommendations

### Database Performance
- **Indexing**: Add indexes to frequently queried columns like `status`, `userId`, and `createdAt` in the Prisma schema.
- **Pagination**: Implement cursor-based or offset-based pagination for tables with large datasets (e.g., employees, leave history).

### Frontend Optimization
- **Image Optimization**: Ensure all user avatars and uploaded documents are optimized for web use.
- **Bundle Size**: Monitor bundle size and consider code splitting for large admin components.

### Monitoring
- **Vercel Analytics**: Enable Vercel Speed Insights to track Real User Monitoring (RUM) metrics like LCP, FID, and CLS in production.
- **Database Logs**: Monitor Prisma query execution times to identify slow database operations.
