import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding database...")

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: "admin@company.com" },
        update: {},
        create: {
            email: "admin@company.com",
            name: "Admin User",
            role: "ADMIN",
            phone: "+1234567890",
            personalEmail: "admin.personal@gmail.com",
            dob: new Date("1990-01-01"),
            bloodGroup: "O+",
            nationalId: "1234567890123",
            gender: "Male",
            maritalStatus: "Single",
            nationality: "American",
            presentAddress: "123 Admin Street, Tech City, CA 94000",
            permanentAddress: "456 Family Road, Hometown, NY 10000",
            emergencyContactName: "Jane Admin",
            emergencyContactPhone: "+1987654321",
            emergencyContactRelation: "Sister",
            designation: "System Administrator",
            department: "IT",
            employeeId: "EMP-001",
            joiningDate: new Date("2020-01-01"),
            bankName: "Admin Bank",
            accountNumber: "1234567890",
            routingNumber: "123456789",
            swiftCode: "ADMINXXX",
        },
    })
    console.log("✅ Created admin:", admin.email)

    // Create Employee 1
    const employee1 = await prisma.user.upsert({
        where: { email: "john.doe@company.com" },
        update: {},
        create: {
            email: "john.doe@company.com",
            name: "John Doe",
            role: "EMPLOYEE",
            managerId: admin.id,
            phone: "+1234567892",
            personalEmail: "john.doe.personal@gmail.com",
            dob: new Date("1995-05-15"),
            bloodGroup: "A+",
            nationalId: "9876543210987",
            gender: "Male",
            maritalStatus: "Married",
            nationality: "American",
            presentAddress: "789 Employee Lane, Worktown, CA 94001",
            permanentAddress: "101 Parents Place, Oldtown, TX 75000",
            emergencyContactName: "Mary Doe",
            emergencyContactPhone: "+1122334455",
            emergencyContactRelation: "Spouse",
            designation: "Software Engineer",
            department: "Engineering",
            employeeId: "EMP-002",
            joiningDate: new Date("2021-03-15"),
            bankName: "Employee Bank",
            accountNumber: "9876543210",
        },
    })
    console.log("✅ Created employee:", employee1.email)

    // Create Employee 2
    const employee2 = await prisma.user.upsert({
        where: { email: "jane.smith@company.com" },
        update: {},
        create: {
            email: "jane.smith@company.com",
            name: "Jane Smith",
            role: "EMPLOYEE",
            managerId: admin.id,
            phone: "+1234567894",
            personalEmail: "jane.smith.personal@gmail.com",
            dob: new Date("1998-08-20"),
            bloodGroup: "B-",
            nationalId: "4567891230456",
            gender: "Female",
            maritalStatus: "Single",
            nationality: "Canadian",
            presentAddress: "321 Worker Blvd, Jobcity, CA 94002",
            permanentAddress: "654 North Way, Coldtown, WA 98000",
            emergencyContactName: "Robert Smith",
            emergencyContactPhone: "+1555666777",
            emergencyContactRelation: "Father",
            designation: "Product Designer",
            department: "Design",
            employeeId: "EMP-003",
            joiningDate: new Date("2022-06-01"),
            bankName: "Employee Bank",
            accountNumber: "1122334455",
        },
    })
    console.log("✅ Created employee:", employee2.email)

    // Create Sample Notices
    await prisma.notice.create({
        data: {
            title: "Welcome to the Company Portal",
            content: "This is your new organizational dashboard. Use it to manage leaves, view documents, and stay updated with company announcements.",
            isPinned: true,
        },
    })

    await prisma.notice.create({
        data: {
            title: "Holiday Notice",
            content: "The office will be closed on December 25th for Christmas. Happy holidays!",
            isPinned: false,
        },
    })
    console.log("✅ Created sample notices")

    // Create Sample Leave Request
    await prisma.leaveRequest.create({
        data: {
            userId: employee1.id,
            startDate: new Date("2025-12-20"),
            endDate: new Date("2025-12-22"),
            type: "Casual Leave",
            reason: "Family vacation",
            status: "PENDING",
        },
    })

    await prisma.leaveRequest.create({
        data: {
            userId: employee2.id,
            startDate: new Date("2025-11-28"),
            endDate: new Date("2025-11-29"),
            type: "Sick Leave",
            reason: "Medical appointment",
            status: "APPROVED",
        },
    })
    console.log("✅ Created sample leave requests")

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n📋 Test Users Created:")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("👨‍💼 Admin:")
    console.log("   Email: admin@company.com")
    console.log("   Access: /admin dashboard")
    console.log("\n👤 Employees:")
    console.log("   Email: john.doe@company.com")
    console.log("   Email: jane.smith@company.com")
    console.log("   Access: /dashboard")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("\n⚠️  Note: You'll need to temporarily bypass auth or set up Google OAuth to login")
}

main()
    .catch((e) => {
        console.error("❌ Error seeding database:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
