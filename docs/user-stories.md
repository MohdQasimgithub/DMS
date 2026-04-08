# User Stories — Hyundai AutoEver DMS
## Jira-Ready Format (Epic → Story → Acceptance Criteria)

---

## EPIC 1: Authentication & Security
**Epic ID:** DMS-EP-01
**Description:** Users can securely log in, register, and manage their sessions.

---

### Story DMS-01
**Title:** User Login
**As a** registered user,
**I want to** log in with my username and password,
**So that** I can access the system based on my role.

**Story Points:** 3
**Priority:** High

**Acceptance Criteria:**
- [ ] Login form has username and password fields
- [ ] Both fields show validation error if left empty
- [ ] Correct credentials redirect user to Dashboard
- [ ] Wrong credentials show "Invalid username or password"
- [ ] JWT access token and refresh token returned on success
- [ ] User's role(s) returned in login response

---

### Story DMS-02
**Title:** Account Lock After Failed Attempts
**As a** system,
**I want to** lock an account after 5 failed login attempts,
**So that** brute force attacks are prevented.

**Story Points:** 2
**Priority:** High

**Acceptance Criteria:**
- [ ] Failed attempt counter increments on each wrong password
- [ ] Account locked after exactly 5 failed attempts
- [ ] Locked account shows "Account is locked" message
- [ ] Correct password also rejected when account is locked
- [ ] Admin can unlock the account from Users page

---

### Story DMS-03
**Title:** User Logout
**As a** logged-in user,
**I want to** log out of the system,
**So that** my session is ended securely.

**Story Points:** 1
**Priority:** High

**Acceptance Criteria:**
- [ ] Logout option available in user avatar menu
- [ ] Clicking logout clears token from localStorage
- [ ] User redirected to login page after logout
- [ ] Protected pages not accessible after logout

---

### Story DMS-04
**Title:** JWT Token Refresh
**As a** logged-in user,
**I want** my session to automatically refresh,
**So that** I am not logged out while actively using the system.

**Story Points:** 2
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Refresh token stored on login
- [ ] When access token expires, system auto-calls refresh endpoint
- [ ] New access token issued without re-login
- [ ] If refresh token also expired, user redirected to login

---

## EPIC 2: User Registration
**Epic ID:** DMS-EP-02
**Description:** New users can create accounts as Dealer or Employee.

---

### Story DMS-05
**Title:** Self-Registration as Dealer or Employee
**As a** new user,
**I want to** register an account and select my role,
**So that** I can access the system with appropriate permissions.

**Story Points:** 3
**Priority:** High

**Acceptance Criteria:**
- [ ] Registration form has: username, full name, email, phone, password, confirm password, role
- [ ] Role dropdown shows only DEALER and EMPLOYEE (not ADMIN)
- [ ] Duplicate username shows error
- [ ] Duplicate email shows error
- [ ] Password mismatch shows error
- [ ] Weak password shows specific error message
- [ ] Successful registration auto-logs in user
- [ ] "Sign in" link available on register page
- [ ] "Create one" link available on login page

---

### Story DMS-06
**Title:** Admin Cannot Be Self-Registered
**As a** system,
**I want to** prevent ADMIN role self-registration,
**So that** unauthorized admin accounts cannot be created.

**Story Points:** 1
**Priority:** High

**Acceptance Criteria:**
- [ ] ADMIN not shown in registration dropdown
- [ ] API returns 400 if role=ADMIN is sent directly
- [ ] Error message: "Admin accounts cannot be self-registered"

---

## EPIC 3: User Management
**Epic ID:** DMS-EP-03
**Description:** Admin can manage all user accounts in the system.

---

### Story DMS-07
**Title:** View User List
**As an** Admin,
**I want to** view a paginated list of all users,
**So that** I can manage user accounts efficiently.

**Story Points:** 2
**Priority:** High

**Acceptance Criteria:**
- [ ] Users page shows paginated table
- [ ] Columns: username, full name, email, roles, status
- [ ] Locked accounts shown with "Locked" badge
- [ ] Page size options: 5, 10, 25
- [ ] Non-admin users cannot access this page

---

### Story DMS-08
**Title:** Create User
**As an** Admin,
**I want to** create new user accounts,
**So that** I can onboard team members with appropriate roles.

**Story Points:** 2
**Priority:** High

**Acceptance Criteria:**
- [ ] Add New button opens a form dialog
- [ ] Admin can assign one or multiple roles
- [ ] All validations applied (email format, password strength)
- [ ] Success toast shown on creation
- [ ] New user appears in list immediately

---

### Story DMS-09
**Title:** Edit and Deactivate User
**As an** Admin,
**I want to** edit user details and deactivate accounts,
**So that** I can keep user data accurate and remove access when needed.

**Story Points:** 2
**Priority:** High

**Acceptance Criteria:**
- [ ] Edit button opens pre-filled form
- [ ] Password field optional during edit (blank = keep existing)
- [ ] Deactivate sets user status to Inactive (soft delete)
- [ ] Deactivated user cannot login

---

### Story DMS-10
**Title:** Unlock User Account
**As an** Admin,
**I want to** unlock locked user accounts,
**So that** legitimate users can regain access.

**Story Points:** 1
**Priority:** High

**Acceptance Criteria:**
- [ ] Unlock icon shown only for locked accounts
- [ ] Clicking unlock resets failed attempts to 0
- [ ] Account status changes to Active
- [ ] User can login normally after unlock

---

## EPIC 4: Role & Menu Management
**Epic ID:** DMS-EP-04
**Description:** Admin manages roles and their menu access permissions.

---

### Story DMS-11
**Title:** Manage Roles
**As an** Admin,
**I want to** create and manage roles,
**So that** I can control what each user type can access.

**Story Points:** 3
**Priority:** High

**Acceptance Criteria:**
- [ ] Roles page shows paginated list
- [ ] Admin can create role with name, description, and assigned menus
- [ ] Duplicate role name rejected
- [ ] Admin can edit role and change menu assignments
- [ ] Admin can deactivate a role

---

### Story DMS-12
**Title:** Manage Menus
**As an** Admin,
**I want to** manage the navigation menu structure,
**So that** I can control which pages are available in the system.

**Story Points:** 2
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Menus page shows flat list with parent/child indication
- [ ] Admin can create root and child menus
- [ ] Sort order controls display sequence
- [ ] Duplicate menu code rejected
- [ ] Menus assigned to roles control sidebar navigation

---

## EPIC 5: Dealer Management
**Epic ID:** DMS-EP-05
**Description:** Users can manage dealership information.

---

### Story DMS-13
**Title:** View Dealer List
**As any** authenticated user,
**I want to** view a list of all dealers,
**So that** I can find dealer information quickly.

**Story Points:** 2
**Priority:** High

**Acceptance Criteria:**
- [ ] Dealers page shows paginated table
- [ ] Columns: code, name, city, region, phone, manager, status
- [ ] Status shown as color-coded chip (Active/Inactive/Suspended)
- [ ] Sortable by dealer name
- [ ] Page size options: 5, 10, 25

---

### Story DMS-14
**Title:** Create and Edit Dealer
**As an** Admin or Dealer,
**I want to** create and edit dealer records,
**So that** dealership information stays up to date.

**Story Points:** 3
**Priority:** High

**Acceptance Criteria:**
- [ ] Form has: code, name, address, city, region, phone, email, manager, status
- [ ] Dealer code must be unique
- [ ] Phone and email validated
- [ ] Success toast on save
- [ ] Audit fields (createdBy, createdAt) populated automatically

---

### Story DMS-15
**Title:** Dynamic Region Dropdown
**As a** user filtering dealers,
**I want** the region dropdown to load from actual data,
**So that** I only see regions that have dealers.

**Story Points:** 1
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Region dropdown populated from distinct regions in DB
- [ ] Selecting region filters dealers to that region
- [ ] Updates automatically when new regions are added

---

## EPIC 6: Vehicle Management
**Epic ID:** DMS-EP-06
**Description:** Users can manage vehicle inventory.

---

### Story DMS-16
**Title:** View Vehicle Inventory
**As any** authenticated user,
**I want to** view the vehicle inventory,
**So that** I can check available vehicles and their status.

**Story Points:** 2
**Priority:** High

**Acceptance Criteria:**
- [ ] Vehicles page shows paginated table
- [ ] Columns: VIN, model, variant, color, year, price, dealer, status
- [ ] Status shown as color-coded chip
- [ ] Price formatted with currency symbol
- [ ] Sortable columns

---

### Story DMS-17
**Title:** Add Vehicle with Linked Dropdowns
**As an** Admin or Dealer,
**I want to** add a vehicle using linked dropdowns for model/variant/color,
**So that** data entry is consistent and error-free.

**Story Points:** 3
**Priority:** High

**Acceptance Criteria:**
- [ ] Model dropdown loads all distinct models from DB
- [ ] Variant dropdown loads only after model is selected
- [ ] Color dropdown loads only after variant is selected
- [ ] VIN must be exactly 17 characters
- [ ] VIN must be unique
- [ ] Vehicle can be assigned to a dealer

---

## EPIC 7: System Administration
**Epic ID:** DMS-EP-07
**Description:** Admin manages system configuration and monitors logs.

---

### Story DMS-18
**Title:** Manage App Configurations
**As an** Admin,
**I want to** view and edit system configurations,
**So that** I can tune system behavior without code changes.

**Story Points:** 2
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Configs page shows all key-value pairs with group and description
- [ ] Editable configs show inline edit button
- [ ] Non-editable configs (APP_VERSION) show no edit option
- [ ] Changes saved immediately on click

---

### Story DMS-19
**Title:** View System Logs
**As an** Admin,
**I want to** view application logs in the browser,
**So that** I can monitor system activity and troubleshoot issues.

**Story Points:** 3
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Logs page shows terminal-style log viewer
- [ ] Can switch between Application and Error logs
- [ ] Can filter by log level: ALL, ERROR, WARN, INFO, DEBUG
- [ ] Can search logs by keyword
- [ ] Can choose how many lines to load (100/300/500/1000)
- [ ] Auto-refreshes every 30 seconds
- [ ] Color-coded by level (red=ERROR, yellow=WARN, blue=INFO)
- [ ] Only ADMIN can access this page

---

## Sprint Plan (Suggested)

| Sprint | Stories | Goal |
|---|---|---|
| Sprint 1 | DMS-01, DMS-02, DMS-03, DMS-04, DMS-05, DMS-06 | Auth & Registration complete |
| Sprint 2 | DMS-07, DMS-08, DMS-09, DMS-10, DMS-11, DMS-12 | User/Role/Menu management |
| Sprint 3 | DMS-13, DMS-14, DMS-15, DMS-16, DMS-17 | Dealer & Vehicle management |
| Sprint 4 | DMS-18, DMS-19 + Testing + Bug fixes | Admin tools & QA |
