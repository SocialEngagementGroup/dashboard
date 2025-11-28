import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBackend() {
    console.log('🔍 Starting Backend Testing...\n');

    try {
        // Test 1: Database Connection
        console.log('📊 Test 1: Database Connection');
        await prisma.$connect();
        console.log('✅ Database connected successfully\n');

        // Test 2: User Model
        console.log('📊 Test 2: User Model');
        const userCount = await prisma.user.count();
        console.log(`✅ Users in database: ${userCount}`);
        if (userCount > 0) {
            const sampleUser = await prisma.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
            console.log('Sample User:', sampleUser);
        }
        console.log('');

        // Test 3: Tool Model
        console.log('📊 Test 3: Tool Model');
        const toolCount = await prisma.tool.count();
        console.log(`✅ Tools in database: ${toolCount}`);
        if (toolCount > 0) {
            const sampleTool = await prisma.tool.findFirst({
                select: {
                    id: true,
                    name: true,
                    url: true,
                },
            });
            console.log('Sample Tool:', sampleTool);
        }
        console.log('');

        // Test 4: ToolRequest Model
        console.log('📊 Test 4: ToolRequest Model');
        const toolRequestCount = await prisma.toolRequest.count();
        console.log(`✅ Tool Requests in database: ${toolRequestCount}`);
        if (toolRequestCount > 0) {
            const sampleRequest = await prisma.toolRequest.findFirst({
                select: {
                    id: true,
                    status: true,
                    tool: {
                        select: {
                            name: true,
                        },
                    },
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            console.log('Sample Tool Request:', sampleRequest);
        }
        console.log('');

        // Test 5: LeaveRequest Model
        console.log('📊 Test 5: LeaveRequest Model');
        const leaveRequestCount = await prisma.leaveRequest.count();
        console.log(`✅ Leave Requests in database: ${leaveRequestCount}`);
        console.log('');

        // Test 6: Department Model
        console.log('📊 Test 6: Department Model');
        const departmentCount = await prisma.department.count();
        console.log(`✅ Departments in database: ${departmentCount}`);
        if (departmentCount > 0) {
            const departments = await prisma.department.findMany({
                select: {
                    id: true,
                    name: true,
                },
            });
            console.log('Departments:', departments);
        }
        console.log('');

        // Test 7: Document Model
        console.log('📊 Test 7: Document Model');
        const documentCount = await prisma.document.count();
        console.log(`✅ Documents in database: ${documentCount}`);
        console.log('');

        // Test 8: Notice Model
        console.log('📊 Test 8: Notice Model');
        const noticeCount = await prisma.notice.count();
        console.log(`✅ Notices in database: ${noticeCount}`);
        console.log('');

        // Test 9: EmergencyContact Model
        console.log('📊 Test 9: EmergencyContact Model');
        const emergencyContactCount = await prisma.emergencyContact.count();
        console.log(`✅ Emergency Contacts in database: ${emergencyContactCount}`);
        console.log('');

        // Test 10: Relationships
        console.log('📊 Test 10: Testing Relationships');
        const usersWithRelations = await prisma.user.findMany({
            where: {
                toolRequests: {
                    some: {},
                },
            },
            include: {
                toolRequests: {
                    include: {
                        tool: true,
                    },
                },
            },
            take: 1,
        });
        console.log(`✅ Users with tool requests: ${usersWithRelations.length}`);
        if (usersWithRelations.length > 0) {
            console.log('Sample user with relations:', {
                name: usersWithRelations[0].name,
                toolRequests: usersWithRelations[0].toolRequests.length,
            });
        }
        console.log('');

        console.log('✅ All Backend Tests Completed Successfully!\n');
    } catch (error) {
        console.error('❌ Error during testing:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

testBackend()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
