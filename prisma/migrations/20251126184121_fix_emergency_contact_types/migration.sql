/*
  Warnings:

  - You are about to drop the column `emergencyContactName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactPhone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactRelation` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmergencyContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "phone" TEXT,
    "address" TEXT,
    "emergencyContact" TEXT,
    "personalEmail" TEXT,
    "dob" DATETIME,
    "bloodGroup" TEXT,
    "nationalId" TEXT,
    "presentAddress" TEXT,
    "permanentAddress" TEXT,
    "gender" TEXT,
    "maritalStatus" TEXT,
    "nationality" TEXT,
    "designation" TEXT,
    "department" TEXT,
    "joiningDate" DATETIME,
    "employeeId" TEXT,
    "bankName" TEXT,
    "bankAccountName" TEXT,
    "accountNumber" TEXT,
    "accountType" TEXT,
    "branchName" TEXT,
    "routingNumber" TEXT,
    "swiftCode" TEXT,
    "managerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("accountNumber", "accountType", "address", "bankAccountName", "bankName", "bloodGroup", "branchName", "createdAt", "department", "designation", "dob", "email", "emailVerified", "emergencyContact", "employeeId", "gender", "id", "image", "joiningDate", "managerId", "maritalStatus", "name", "nationalId", "nationality", "permanentAddress", "personalEmail", "phone", "presentAddress", "role", "routingNumber", "swiftCode", "updatedAt") SELECT "accountNumber", "accountType", "address", "bankAccountName", "bankName", "bloodGroup", "branchName", "createdAt", "department", "designation", "dob", "email", "emailVerified", "emergencyContact", "employeeId", "gender", "id", "image", "joiningDate", "managerId", "maritalStatus", "name", "nationalId", "nationality", "permanentAddress", "personalEmail", "phone", "presentAddress", "role", "routingNumber", "swiftCode", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
