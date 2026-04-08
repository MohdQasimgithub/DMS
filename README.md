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

## Features Implemented
- JWT Authentication + Refresh Token
- Account lock after 5 failed login attempts
- Role-based access control (RBAC) with method-level security
- User / Role / Menu management
- Dealer management with region-based dynamic dropdowns
- Vehicle management with linked dropdowns (Model → Variant → Color)
- Server-side pagination & sorting
- Audit fields (createdBy, createdAt, updatedBy, updatedAt)
- Global exception handling
- DB connection pooling (HikariCP)
- Transaction isolation (READ_COMMITTED)
- Key-value app configuration store
- Structured logging with Logback (console + rolling file)
- OpenAPI / Swagger documentation
- Responsive MUI UI with sidebar navigation
