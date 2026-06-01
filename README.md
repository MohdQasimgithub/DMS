# Hyundai AutoEver - Dealer Management System

## Tech Stack
- **Backend**: Spring Boot 3.2, Java 17, Spring Security, JWT, QueryDSL, JPA
- **Frontend**: React 19, Vite, MUI v7, React Query, React Hook Form, Zustand
- **Database**: MySQL 8+

## Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

## Quick Start

### 1. Database Setup
```sql
CREATE DATABASE dms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend
Update `backend/src/main/resources/application.yml` with your MySQL credentials, then:
```bash
cd backend
mvn spring-boot:run
```
Backend runs on: http://localhost:8080/api
Swagger UI: http://localhost:8080/api/swagger-ui.html

### 3. Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

## Default Login
- Username: `admin`
- Password: `Admin@1234`

## Phase 1 Features Implemented ✅

### Core Functionality
1. **User Management** - Full CRUD with role assignment
2. **Role Management** - Create/edit roles with menu permissions
3. **Menu Management** - Dynamic menu configuration
4. **Dealer Management** - Region-based dynamic dropdowns (State → District → City)
5. **Vehicle Management** - Linked dropdowns (Model → Variant → Color)
6. **Test Drive Management** - Schedule and track test drives
7. **Enquiry Management** - Customer enquiry tracking
8. **Dashboard** - Statistics and overview cards
9. **Audit Logs** - Track all system activities
10. **Login History** - Monitor user login attempts

### Security Features
11. **JWT Authentication** - Secure token-based auth with refresh tokens
12. **Account Lockout** - Lock after 5 failed login attempts (30 min)
13. **Role-Based Access Control (RBAC)** - Method-level security
14. **Password Validation** - Strong password requirements
15. **Session Management** - Auto-logout on token expiry
16. **Secure API Endpoints** - Protected with Spring Security

### UI/UX Features
17. **Responsive Design** - Works on all screen sizes
18. **Dark/Light Theme Toggle** - User preference support
19. **Sidebar Navigation** - Collapsible menu with icons
20. **Search with Debouncing** - 300ms delay on all search fields
21. **Server-side Pagination** - Efficient data loading
22. **Sorting** - Click column headers to sort
23. **Form Validation** - Real-time validation with error messages
24. **Toast Notifications** - Success/error feedback
25. **Loading States** - Skeleton loaders and progress indicators
26. **Keyboard Shortcuts** - Quick actions (Ctrl+K for search)
27. **Confirmation Dialogs** - Prevent accidental deletions

### Technical Features
28. **Audit Fields** - Auto-tracked createdBy, createdAt, updatedBy, updatedAt
29. **Global Exception Handling** - Consistent error responses
30. **Database Connection Pooling** - HikariCP for performance
31. **Transaction Management** - READ_COMMITTED isolation level
32. **Structured Logging** - Logback with rolling file appenders
33. **API Documentation** - Swagger/OpenAPI integration
34. **Code Quality** - Clean, commented, and optimized code

## Project Structure
```
dealer-management-system/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── com/hyundai/dms/
│   │       ├── common/      # Shared utilities, config, exceptions
│   │       └── domain/      # Feature modules (auth, dealer, vehicle, etc.)
│   └── pom.xml
├── frontend/                # React application
│   ├── src/
│   │   ├── api/            # API service layer
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
