-- AlterTable
ALTER TABLE "User" ADD COLUMN "department" TEXT;
ALTER TABLE "User" ADD COLUMN "designation" TEXT;
ALTER TABLE "User" ADD COLUMN "emergencyContactName" TEXT;
ALTER TABLE "User" ADD COLUMN "emergencyContactPhone" TEXT;
ALTER TABLE "User" ADD COLUMN "emergencyContactRelation" TEXT;
ALTER TABLE "User" ADD COLUMN "employeeId" TEXT;
ALTER TABLE "User" ADD COLUMN "gender" TEXT;
ALTER TABLE "User" ADD COLUMN "joiningDate" DATETIME;
ALTER TABLE "User" ADD COLUMN "maritalStatus" TEXT;
ALTER TABLE "User" ADD COLUMN "nationality" TEXT;
ALTER TABLE "User" ADD COLUMN "permanentAddress" TEXT;
ALTER TABLE "User" ADD COLUMN "presentAddress" TEXT;

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tool_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
