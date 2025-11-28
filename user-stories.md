# User Stories - Social Engagement Group Dashboard

## Admin User Stories

### Dashboard & Overview
**Story 1.1:** As an admin, I want to view a dashboard overview so that I can quickly see important metrics and information.
- **Acceptance Criteria:**
  - Dashboard displays key metrics
  - Recent activities are visible
  - Navigation to all admin features is accessible

### Employee Management
**Story 2.1:** As an admin, I want to view all employees so that I can see the complete team roster.
- **Acceptance Criteria:**
  - All employees are listed
  - Employee information includes name, email, department, designation
  - List is searchable/filterable

**Story 2.2:** As an admin, I want to add new employees so that new team members can access the system.
- **Acceptance Criteria:**
  - Form includes all required fields (name, email, department, designation)
  - Email validation works
  - New employee appears in the list immediately
  - Success message is shown

**Story 2.3:** As an admin, I want to edit employee information so that I can keep records up to date.
- **Acceptance Criteria:**
  - Can update all employee fields
  - Changes are saved to database
  - Updated information displays immediately
  - Validation prevents invalid data

**Story 2.4:** As an admin, I want to delete employees so that I can remove inactive team members.
- **Acceptance Criteria:**
  - Confirmation dialog appears before deletion
  - Employee is removed from the system
  - Associated data is handled appropriately

**Story 2.5:** As an admin, I want to view detailed employee profiles so that I can see complete information.
- **Acceptance Criteria:**
  - Profile shows all personal information
  - Banking details are visible
  - Leave history is displayed
  - Tool access is shown

### Department Management
**Story 3.1:** As an admin, I want to create departments so that I can organize the team structure.
- **Acceptance Criteria:**
  - Can create new departments with name and description
  - Department appears in employee assignment dropdowns
  - Department order can be set

**Story 3.2:** As an admin, I want to edit departments so that I can update organizational structure.
- **Acceptance Criteria:**
  - Can update department name, description, and order
  - Changes reflect across the system
  - Employees assigned to the department remain associated

**Story 3.3:** As an admin, I want to delete departments so that I can remove obsolete structures.
- **Acceptance Criteria:**
  - Warning shown if department has assigned employees
  - Confirmation required before deletion
  - Department removed from system

### Notice Management
**Story 4.1:** As an admin, I want to create notices so that I can communicate with all employees.
- **Acceptance Criteria:**
  - Can enter title and content
  - Can set notice as pinned
  - Notice appears on employee dashboards
  - Creation timestamp is recorded

**Story 4.2:** As an admin, I want to pin important notices so that they appear at the top.
- **Acceptance Criteria:**
  - Pinned notices appear first
  - Can pin/unpin existing notices
  - Multiple notices can be pinned

**Story 4.3:** As an admin, I want to delete notices so that I can remove outdated announcements.
- **Acceptance Criteria:**
  - Confirmation dialog appears
  - Notice is removed from all dashboards
  - Deletion is immediate

### Leave Management
**Story 5.1:** As an admin, I want to view all leave requests so that I can manage time off.
- **Acceptance Criteria:**
  - All leave requests are listed
  - Can filter by status (pending, approved, rejected)
  - Employee name and dates are clearly shown

**Story 5.2:** As an admin, I want to approve leave requests so that employees can take time off.
- **Acceptance Criteria:**
  - Can approve individual requests
  - Status updates to "APPROVED"
  - Employee is notified
  - Approved request shows in employee's leave history

**Story 5.3:** As an admin, I want to reject leave requests so that I can manage staffing levels.
- **Acceptance Criteria:**
  - Can reject individual requests
  - Status updates to "REJECTED"
  - Employee is notified
  - Rejection shows in employee's leave history

### Tool Management
**Story 6.1:** As an admin, I want to add tools so that employees can request access.
- **Acceptance Criteria:**
  - Can enter tool name, URL, description
  - Can add credentials (email, password)
  - Can upload tool image/icon
  - Tool appears in employee tools page

**Story 6.2:** As an admin, I want to edit tools so that I can update credentials and information.
- **Acceptance Criteria:**
  - Can update all tool fields
  - Changes save to database
  - Updated info reflects for employees

**Story 6.3:** As an admin, I want to delete tools so that I can remove discontinued services.
- **Acceptance Criteria:**
  - Confirmation dialog appears
  - Tool and associated requests are removed
  - Tool disappears from employee view

**Story 6.4:** As an admin, I want to view tool requests so that I can manage access.
- **Acceptance Criteria:**
  - All pending requests are visible
  - Employee name and requested tool are shown
  - Can approve or reject requests

**Story 6.5:** As an admin, I want to approve tool requests so that employees can access tools.
- **Acceptance Criteria:**
  - Request status changes to "APPROVED"
  - Employee can now view credentials
  - Approval is immediate

**Story 6.6:** As an admin, I want to reject tool requests so that I can control access.
- **Acceptance Criteria:**
  - Request status changes to "REJECTED"
  - Employee sees rejection status
  - Employee cannot view credentials

### Payment & Salary Management
**Story 7.1:** As an admin, I want to process payments so that I can record salary disbursements.
- **Acceptance Criteria:**
  - Can select employee
  - Can enter amount, month, payment type
  - Payment is recorded in database
  - Salary slip PDF is auto-generated

**Story 7.2:** As an admin, I want to view payment history so that I can track all disbursements.
- **Acceptance Criteria:**
  - All payments are listed by employee
  - Can filter by date/employee
  - Payment details are clearly shown

### Document Management
**Story 8.1:** As an admin, I want to upload documents so that I can share files with employees.
- **Acceptance Criteria:**
  - Can upload PDF files
  - Can specify document type (salary slip, SOP, etc.)
  - Can assign to specific employee or make global
  - Document appears in employee's documents section

---

## Employee User Stories

### Dashboard & Overview
**Story 9.1:** As an employee, I want to view my dashboard so that I can see important information at a glance.
- **Acceptance Criteria:**
  - Dashboard shows personalized information
  - Notices are visible
  - Quick access to key features
  - Current time display

### Profile Management
**Story 10.1:** As an employee, I want to view my profile so that I can see my information.
- **Acceptance Criteria:**
  - All profile fields are visible
  - Personal, professional, and banking information shown
  - Emergency contacts displayed
  - Information is accurate

**Story 10.2:** As an employee, I want to edit my profile so that I can keep my information current.
- **Acceptance Criteria:**
  - Can update personal information (phone, address, DOB, etc.)
  - Can update emergency contacts
  - Changes save successfully
  - Validation prevents invalid data

**Story 10.3:** As an employee, I want to upload my profile photo so that I can personalize my account.
- **Acceptance Criteria:**
  - Can select and upload image file
  - Photo preview shown before upload
  - Photo appears in profile and throughout app
  - Upload is immediate

**Story 10.4:** As an employee, I want to manage my banking information so that I can receive payments.
- **Acceptance Criteria:**
  - Can enter account number, bank name, routing number, etc.
  - Information is saved securely
  - Can edit banking details anytime
  - Validation ensures correct format

**Story 10.5:** As an employee, I want to add emergency contacts so that the company can reach someone in case of emergency.
- **Acceptance Criteria:**
  - Can add multiple contacts
  - Each contact includes name, phone, relationship
  - Can edit or remove contacts
  - Changes save immediately

### Leave Management
**Story 11.1:** As an employee, I want to request leave so that I can take time off.
- **Acceptance Criteria:**
  - Can select start and end dates
  - Can specify leave type (sick, casual, etc.)
  - Can provide reason
  - Request is submitted with "PENDING" status

**Story 11.2:** As an employee, I want to view my leave history so that I can track my time off.
- **Acceptance Criteria:**
  - All leave requests are listed
  - Status is clearly shown (pending, approved, rejected)
  - Dates and type are visible
  - History is sorted by date

### Tools Access
**Story 12.1:** As an employee, I want to view available tools so that I know what services are accessible.
- **Acceptance Criteria:**
  - All tools are listed with descriptions
  - Tool logos/images are displayed
  - Access status is shown (not requested, pending, approved, rejected)

**Story 12.2:** As an employee, I want to request access to tools so that I can use company services.
- **Acceptance Criteria:**
  - Can click to request access
  - Request status changes to "PENDING"
  - Cannot request twice for same tool
  - Request appears in admin panel

**Story 12.3:** As an employee, I want to view approved tool credentials so that I can log in to services.
- **Acceptance Criteria:**
  - Credentials only visible for approved requests
  - Email and password are shown clearly
  - Can copy credentials easily
  - Link to tool URL is provided

### Salary Management
**Story 13.1:** As an employee, I want to view my salary history so that I can track payments.
- **Acceptance Criteria:**
  - All payments are listed
  - Month, amount, type, and date are shown
  - Can filter by year
  - Can search payments
  - Latest payments appear first

**Story 13.2:** As an employee, I want to download salary slips so that I have payment records.
- **Acceptance Criteria:**
  - Download button available for each payment
  - PDF downloads immediately
  - PDF contains all payment details
  - PDF is properly formatted

**Story 13.3:** As an employee, I want to view salary slips so that I can review them before downloading.
- **Acceptance Criteria:**
  - View button opens slip in new tab/modal
  - All details are visible
  - Can print directly from view
  - Formatting is professional

### Notice Board
**Story 14.1:** As an employee, I want to view notices so that I stay informed about company updates.
- **Acceptance Criteria:**
  - All active notices are visible
  - Pinned notices appear at top
  - Notices are sorted by date
  - Can read full content

### Team Directory
**Story 15.1:** As an employee, I want to view team members so that I know who my colleagues are.
- **Acceptance Criteria:**
  - All employees are listed with photos
  - Name, designation, and department shown
  - Email is visible
  - Can filter by department
  - Contact options available

---

## Cross-Functional Stories

### Authentication
**Story 16.1:** As a user, I want to log in securely so that my data is protected.
- **Acceptance Criteria:**
  - Secure authentication via NextAuth
  - Session management works correctly
  - Remember me functionality
  - Logout works properly

**Story 16.2:** As a user, I want role-based access so that I only see features relevant to my role.
- **Acceptance Criteria:**
  - Admin sees admin features
  - Employee sees employee features
  - Unauthorized access is blocked
  - Proper redirects on unauthorized access

### Data Validation
**Story 17.1:** As a user, I want form validation so that I don't submit invalid data.
- **Acceptance Criteria:**
  - Required fields are validated
  - Email format is checked
  - Date formats are validated
  - Helpful error messages shown

### Error Handling
**Story 18.1:** As a user, I want clear error messages so that I know what went wrong.
- **Acceptance Criteria:**
  - Network errors are caught
  - Validation errors are displayed
  - Success messages confirm actions
  - Errors are user-friendly

### Responsive Design
**Story 19.1:** As a user, I want the app to work on different devices so that I can access it anywhere.
- **Acceptance Criteria:**
  - Layout adapts to mobile screens
  - Touch-friendly interface on mobile
  - All features accessible on mobile
  - No horizontal scrolling required
