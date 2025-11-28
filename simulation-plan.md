# User Journey Simulation Plan

## Objective
Simulate real-world usage by creating a complete lifecycle of an employee ("John Doe") and an admin managing them. This verifies the system's end-to-end functionality.

## Scenarios

### 1. Admin: Onboarding
- **Action**: Create a new employee.
- **Data**:
  - Name: John Doe
  - Email: john.doe@example.com
  - Role: Employee
  - Department: Engineering (Create if not exists)
  - Designation: Senior Developer
  - Salary: $120,000

### 2. Admin: Communication
- **Action**: Post a notice.
- **Data**:
  - Title: "Welcome John!"
  - Content: "Please welcome our new Senior Developer, John Doe."

### 3. Employee: First Day
- **Action**: Log in (simulated via switching views) and check dashboard.
- **Action**: Update Profile.
  - Add Emergency Contact: "Jane Doe" (Spouse)
- **Action**: Request Tool Access.
  - Tool: "Figma" (or generic request if tool doesn't exist)

### 4. Employee: Leave Request
- **Action**: Apply for leave.
  - Type: Sick Leave
  - Duration: 2 days
  - Reason: "Flu"

### 5. Admin: Approvals & Operations
- **Action**: Approve John's Leave Request.
- **Action**: Approve John's Tool Request.
- **Action**: Process Payroll for John.
  - Month: November
  - Amount: $10,000

### 6. Employee: Verification
- **Action**: Check Leave Status (Approved).
- **Action**: Check Tool Access (Credentials visible).
- **Action**: Check Salary History (Payment visible).
