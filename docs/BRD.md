# Business Requirements Document (BRD)
## Hyundai AutoEver — Dealer Management System (DMS)

---

## 1. Document Information

| Field | Details |
|---|---|
| Project Name | Dealer Management System (DMS) |
| Client | Hyundai AutoEver |
| Prepared By | Development Team |
| Version | 1.0 |
| Date | April 2026 |
| Status | Draft |

---

## 2. Executive Summary

Hyundai AutoEver requires a centralized **Dealer Management System** to manage its network of dealers, vehicle inventory, employees, and system users across multiple regions in South Korea. The current process is manual and fragmented across spreadsheets and emails, leading to data inconsistency, delayed reporting, and poor visibility.

The DMS will provide a secure, role-based web application that allows Admins, Dealers, and Employees to manage dealerships, vehicles, users, and system configurations from a single platform.

---

## 3. Business Objectives

| # | Objective |
|---|---|
| BO-01 | Centralize dealer and vehicle data across all regions |
| BO-02 | Enforce role-based access so each user sees only what they need |
| BO-03 | Reduce manual data entry errors through server and client-side validation |
| BO-04 | Provide audit trail for all data changes (who changed what and when) |
| BO-05 | Enable secure authentication with account protection mechanisms |
| BO-06 | Support system administrators with configuration management and log monitoring |

---

## 4. Scope

### 4.1 In Scope
- User registration and login with JWT-based authentication
- Role management: ADMIN, DEALER, EMPLOYEE
- Menu management with role-based access control
- Dealer CRUD with region-based filtering
- Vehicle CRUD with linked dropdowns (Model → Variant → Color)
- Audit fields on all entities (createdBy, createdAt, updatedBy, updatedAt)
- Server-side pagination and sorting on all list views
- Key-value application configuration management
- System log viewer for administrators
- Responsive web UI

### 4.2 Out of Scope
- Mobile native application
- Payment processing
- Vehicle booking/reservation workflow
- Integration with external ERP systems (Phase 2)
- Email notifications (Phase 2)

---

## 5. Stakeholders

| Role | Name | Responsibility |
|---|---|---|
| Product Owner | Hyundai AutoEver PM | Approves requirements and priorities |
| Tech Lead | Development Team Lead | Technical decisions and architecture |
| Backend Developer | Team Member | Spring Boot API development |
| Frontend Developer | Team Member | React UI development |
| QA Engineer | Team Member | Test case preparation and execution |
| End Users | Dealers, Employees, Admins | System users |

---

## 6. Functional Requirements

### 6.1 Authentication & Security
| ID | Requirement |
|---|---|
| FR-AUTH-01 | System shall allow users to login with username and password |
| FR-AUTH-02 | System shall return a JWT access token and refresh token on successful login |
| FR-AUTH-03 | System shall lock account after 5 consecutive failed login attempts |
| FR-AUTH-04 | System shall allow Admin to unlock locked accounts |
| FR-AUTH-05 | System shall hash all passwords using BCrypt |
| FR-AUTH-06 | System shall reject expired or tampered JWT tokens with 401 response |
| FR-AUTH-07 | System shall support token refresh without re-login |

### 6.2 User Registration
| ID | Requirement |
|---|---|
| FR-REG-01 | Users can self-register as DEALER or EMPLOYEE only |
| FR-REG-02 | ADMIN accounts can only be created by existing Admins |
| FR-REG-03 | Registration requires: username, email, password, confirm password, role |
| FR-REG-04 | Password must contain uppercase, lowercase, digit, and special character |
| FR-REG-05 | Duplicate username and email must be rejected |
| FR-REG-06 | Successful registration auto-logs in the user |

### 6.3 User Management
| ID | Requirement |
|---|---|
| FR-USR-01 | Admin can view paginated list of all users |
| FR-USR-02 | Admin can create, edit, and deactivate users |
| FR-USR-03 | Admin can assign one or multiple roles to a user |
| FR-USR-04 | Admin can unlock locked user accounts |
| FR-USR-05 | Non-admin users cannot access user management |

### 6.4 Role & Menu Management
| ID | Requirement |
|---|---|
| FR-ROLE-01 | Admin can create, edit, and deactivate roles |
| FR-ROLE-02 | Admin can assign menus to roles |
| FR-ROLE-03 | Users see only the menus assigned to their role |
| FR-ROLE-04 | A user can have multiple roles |
| FR-MENU-01 | Admin can create parent and child menus |
| FR-MENU-02 | Menus support sort order for display sequence |

### 6.5 Dealer Management
| ID | Requirement |
|---|---|
| FR-DLR-01 | All authenticated users can view the dealer list |
| FR-DLR-02 | Admin and Dealer roles can create and edit dealers |
| FR-DLR-03 | Only Admin can deactivate a dealer |
| FR-DLR-04 | Dealer list supports server-side pagination and sorting |
| FR-DLR-05 | System provides dynamic dropdown of distinct regions |
| FR-DLR-06 | Dealer code must be unique |

### 6.6 Vehicle Management
| ID | Requirement |
|---|---|
| FR-VEH-01 | All authenticated users can view the vehicle list |
| FR-VEH-02 | Admin and Dealer roles can create and edit vehicles |
| FR-VEH-03 | VIN must be exactly 17 characters and unique |
| FR-VEH-04 | Vehicle form uses linked dropdowns: Model → Variant → Color |
| FR-VEH-05 | Vehicle list supports server-side pagination and sorting |
| FR-VEH-06 | Vehicle can be assigned to a dealer |

### 6.7 Configuration Management
| ID | Requirement |
|---|---|
| FR-CFG-01 | Admin can view all key-value configurations |
| FR-CFG-02 | Admin can edit values of editable configurations |
| FR-CFG-03 | Non-editable configurations (e.g. APP_VERSION) cannot be modified |

### 6.8 Log Viewer
| ID | Requirement |
|---|---|
| FR-LOG-01 | Admin can view application logs in the UI |
| FR-LOG-02 | Logs can be filtered by level: ERROR, WARN, INFO, DEBUG |
| FR-LOG-03 | Logs can be searched by keyword |
| FR-LOG-04 | Log viewer auto-refreshes every 30 seconds |
| FR-LOG-05 | Only ADMIN role can access the log viewer |

---

## 7. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Security | All API endpoints except login and register must require valid JWT |
| NFR-02 | Security | Method-level security enforced using @PreAuthorize |
| NFR-03 | Security | CORS configured to allow only trusted frontend origin |
| NFR-04 | Performance | API response time must be under 3 seconds for list endpoints |
| NFR-05 | Database | HikariCP connection pool with min 5 and max 20 connections |
| NFR-06 | Database | Transaction isolation level: READ_COMMITTED to prevent dirty reads |
| NFR-07 | Database | All key columns must have DB indexes |
| NFR-08 | Logging | All application events logged using SLF4J/Logback |
| NFR-09 | Logging | Log files rolled daily and compressed after 10MB |
| NFR-10 | Usability | UI must be responsive and work on mobile screens |
| NFR-11 | Maintainability | OpenAPI/Swagger documentation available at /swagger-ui.html |
| NFR-12 | Audit | All entities must record createdBy, createdAt, updatedBy, updatedAt |

---

## 8. User Roles Summary

| Role | Description | Can Self-Register | Key Permissions |
|---|---|---|---|
| ADMIN | System administrator | No (seeded at startup) | Full access to all modules |
| DEALER | Dealership manager | Yes | Manage dealers and vehicles |
| EMPLOYEE | Sales/support staff | Yes | View dealers and vehicles |

---

## 9. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Material UI v7 |
| State Management | Zustand, React Query |
| Form Validation | React Hook Form + Yup |
| Backend | Spring Boot 3.2, Java 17 |
| Security | Spring Security, JWT (jjwt 0.12) |
| Database | MySQL 8, JPA/Hibernate |
| Query | QueryDSL 5.0 |
| Documentation | SpringDoc OpenAPI (Swagger) |
| Logging | SLF4J + Logback |
| Connection Pool | HikariCP |

---

## 10. Assumptions & Constraints

| # | Type | Description |
|---|---|---|
| A-01 | Assumption | MySQL 8 is installed and accessible on localhost |
| A-02 | Assumption | Admin user is seeded automatically on first startup |
| A-03 | Assumption | Single-region deployment for Phase 1 |
| C-01 | Constraint | Admin role cannot be self-registered for security reasons |
| C-02 | Constraint | VIN must follow 17-character standard |
| C-03 | Constraint | Passwords must meet complexity requirements |

---

## 11. Acceptance Criteria

- All functional requirements implemented and tested
- All test cases in the test case document pass
- No critical or high severity bugs open at release
- Swagger documentation complete and accurate
- Role-based access working correctly for all 3 roles
- Audit fields populated correctly on all create/update operations
