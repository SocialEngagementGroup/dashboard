import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testFunctionality() {
    console.log('🧪 Starting Comprehensive Functionality Testing...\n');

    try {
        await prisma.$connect();
        console.log('✅ Database connected\n');

        // Test 1: Test User CRUD Operations
        console.log('📊 Test 1: User Management');
        const users = await prisma.user.findMany({ take: 2 });
        console.log(`✅ Found ${users.length} users`);
        console.log('Sample users:', users.map(u => ({ id: u.id, name: u.name, role: u.role })));
        console.log('');

        // Test 2: Test Tool and ToolRequest Relationships
        console.log('📊 Test 2: Tool-ToolRequest Relationships');
        const toolsWithRequests = await prisma.tool.findMany({
            include: {
                requests: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                }
            }
        });

        console.log(`✅ Tools: ${toolsWithRequests.length}`);
        for (const tool of toolsWithRequests) {
            console.log(`  - ${tool.name}: ${tool.requests.length} requests`);
            console.log(`    URL: ${tool.url}`);
            console.log(`    Has credentials: ${tool.email ? 'Yes' : 'No'}`);
        }
        console.log('');

        // Test 3: Test Leave Requests
        console.log('📊 Test 3: Leave Requests');
        const leaveRequests = await prisma.leaveRequest.findMany({
            include: {
                user: {
                    select: { name: true }
                }
            }
        });
        console.log(`✅ Leave requests: ${leaveRequests.length}`);
        if (leaveRequests.length > 0) {
            const sample = leaveRequests[0];
            console.log(`  Sample: ${sample.user.name} - ${sample.type} (${sample.status})`);
        }
        console.log('');

        // Test 4: Test Departments
        console.log('📊 Test 4: Departments');
        const departments = await prisma.department.findMany({
            orderBy: { order: 'asc' }
        });
        console.log(`✅ Departments: ${departments.length}`);
        departments.forEach(dept => {
            console.log(`  - ${dept.name} (Order: ${dept.order})`);
        });
        console.log('');

        // Test 5: Test User-Department Relationship
        console.log('📊 Test 5: User-Department Distribution');
        const usersByDept = await prisma.user.groupBy({
            by: ['department'],
            _count: true,
            where: {
                department: { not: null }
            }
        });
        console.log('✅ Users by department:');
        usersByDept.forEach(({ department, _count }) => {
            console.log(`  - ${department || 'Undefined'}: ${_count} users`);
        });
        console.log('');

        // Test 6: Test Documents
        console.log('📊 Test 6: Documents');
        const documents = await prisma.document.findMany({
            include: {
                user: {
                    select: { name: true }
                }
            }
        });
        console.log(`✅ Documents: ${documents.length}`);
        console.log('');

        // Test 7: Test Notices
        console.log('📊 Test 7: Notices');
        const notices = await prisma.notice.findMany({
            orderBy: { createdAt: 'desc' }
        });
        console.log(`✅ Notices: ${notices.length}`);
        notices.forEach(notice => {
            console.log(`  - ${notice.title} (Pinned: ${notice.isPinned})`);
        });
        console.log('');

        // Test 8: Test Emergency Contacts
        console.log('📊 Test 8: Emergency Contacts');
        const emergencyContacts = await prisma.emergencyContact.findMany({
            include: {
                user: {
                    select: { name: true }
                }
            }
        });
        console.log(`✅ Emergency Contacts: ${emergencyContacts.length}`);
        console.log('');

        // Test 9: Test Admin Users
        console.log('📊 Test 9: Admin Users');
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' }
        });
        console.log(`✅ Admin users: ${admins.length}`);
        admins.forEach(admin => {
            console.log(`  - ${admin.name} (${admin.email})`);
        });
        console.log('');

        // Test 10: Database Integrity
        console.log('📊 Test 10: Database Integrity Checks');

        // Count all tool requests and verify they have valid relationships
        const allToolRequests = await prisma.toolRequest.findMany({
            include: {
                tool: true,
                user: true
            }
        });

        const validRequests = allToolRequests.filter(req => req.tool && req.user);
        console.log(`✅ Valid tool requests: ${validRequests.length}/${allToolRequests.length}`);

        // Check for users with complete profiles
        const usersWithCompleteProfiles = await prisma.user.count({
            where: {
                AND: [
                    { name: { not: null } },
                    { email: { not: null } },
                    { department: { not: null } },
                    { designation: { not: null } }
                ]
            }
        });
        console.log(`✅ Users with complete profiles: ${usersWithCompleteProfiles}`);
        console.log('');

        // Summary
        console.log('📈 Summary:');
        console.log(`  - Total Users: ${await prisma.user.count()}`);
        console.log(`  - Total Tools: ${await prisma.tool.count()}`);
        console.log(`  - Total Tool Requests: ${await prisma.toolRequest.count()}`);
        console.log(`  - Total Leave Requests: ${await prisma.leaveRequest.count()}`);
        console.log(`  - Total Departments: ${await prisma.department.count()}`);
        console.log(`  - Total Notices: ${await prisma.notice.count()}`);
        console.log(`  - Total Documents: ${await prisma.document.count()}`);
        console.log(`  - Total Emergency Contacts: ${await prisma.emergencyContact.count()}`);
        console.log('');

        console.log('✅ All Functionality Tests Completed Successfully!\n');

    } catch (error) {
        console.error('❌ Error during testing:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

testFunctionality()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
