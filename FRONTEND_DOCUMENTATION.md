# 🚀 Hyundai AutoEver DMS - Frontend Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture & Design Patterns](#architecture--design-patterns)
5. [State Management](#state-management)
6. [Routing & Navigation](#routing--navigation)
7. [API Integration](#api-integration)
8. [Form Handling & Validation](#form-handling--validation)
9. [UI/UX Patterns](#uiux-patterns)
10. [Performance Optimizations](#performance-optimizations)
11. [Security Implementation](#security-implementation)
12. [Error Handling](#error-handling)
13. [Custom Hooks](#custom-hooks)
14. [Component Library](#component-library)
15. [Code Review Preparation](#code-review-preparation)

---

## 🎯 Project Overview

**Project Name:** Hyundai AutoEver Dealer Management System (DMS)  
**Frontend Framework:** React 19.2.4  
**Build Tool:** Vite 8.0.1  
**Purpose:** Web application for managing Hyundai dealerships, vehicles, test drives, and customer enquiries

### Key Features
- ✅ User authentication with JWT
- ✅ Role-based access control (ADMIN, DEALER, EMPLOYEE)
- ✅ Dealer management with CRUD operations
- ✅ Vehicle inventory management
- ✅ Test drive scheduling
- ✅ Customer enquiry tracking
- ✅ Real-time data synchronization
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Server-side pagination and sorting
- ✅ Advanced search and filtering
- ✅ Drag-and-drop menu reordering
- ✅ Inline editing capabilities

---

## 🛠️ Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.4 | UI library for building component-based interfaces |
| **Vite** | 8.0.1 | Fast build tool and development server |
| **Material-UI (MUI)** | 7.3.9 | Component library for professional UI |
| **React Router** | 7.14.0 | Client-side routing and navigation |
| **TanStack Query** | 5.96.2 | Server state management and data fetching |
| **Zustand** | 5.0.12 | Lightweight global state management |
| **React Hook Form** | 7.72.1 | Performant form handling |
| **Yup** | 1.7.1 | Schema-based form validation |
| **Axios** | 1.14.0 | HTTP client for API requests |
| **React Toastify** | 11.0.5 | Toast notifications |
| **Day.js** | 1.11.20 | Date manipulation library |

### Why These Technologies?

#### **React 19.2.4**
- **Component-based architecture** - Reusable, maintainable code
- **Virtual DOM** - Efficient rendering and updates
- **Large ecosystem** - Extensive libraries and community support
- **Hooks** - Modern, functional approach to state and side effects
- **Industry standard** - Easier to hire developers

#### **Vite over Create React App**
- **10x faster builds** - Uses esbuild (written in Go)
- **Instant Hot Module Replacement (HMR)** - Changes reflect in milliseconds
- **Better tree-shaking** - Smaller production bundles
- **Native ES modules** - No bundling in development
- **CRA is deprecated** - No longer maintained by React team

#### **Material-UI (MUI)**
- **Production-ready** - Used by Google, Netflix, NASA
- **Accessibility** - WCAG 2.1 compliant out of the box
- **Customizable** - Powerful theming system
- **Comprehensive** - 100+ pre-built components
- **TypeScript support** - Better developer experience


#### **TanStack Query (React Query)**
- **Automatic caching** - Reduces unnecessary API calls
- **Background refetching** - Keeps data fresh
- **Optimistic updates** - Instant UI feedback
- **Built-in loading/error states** - Simplifies state management
- **Eliminates useEffect for data fetching** - Cleaner code

#### **Zustand over Redux**
- **Simpler API** - No boilerplate (actions, reducers, dispatch)
- **Smaller bundle** - 1KB vs Redux 10KB
- **No Provider wrapper** - Direct hook access
- **Better TypeScript support** - Type inference works better
- **Easier to learn** - Minimal learning curve

---

## 📁 Project Structure

```
frontend/
├── public/                      # Static assets
├── src/
│   ├── api/                     # API service layer
│   │   ├── axiosInstance.js     # Axios configuration with interceptors
│   │   ├── authApi.js           # Authentication endpoints
│   │   ├── dealerApi.js         # Dealer CRUD operations
│   │   ├── vehicleApi.js        # Vehicle management
│   │   ├── testDriveApi.js      # Test drive scheduling
│   │   ├── enquiryApi.js        # Customer enquiries
│   │   ├── userApi.js           # User management
│   │   ├── roleApi.js           # Role management
│   │   └── menuApi.js           # Menu management
│   │
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Shared components
│   │   │   ├── PageHeader.jsx   # Page title with action buttons
│   │   │   ├── SearchBar.jsx    # Debounced search input
│   │   │   └── ConfirmDialog.jsx # Confirmation modal
│   │   └── layout/              # Layout components
│   │       ├── AppLayout.jsx    # Main app layout with sidebar
│   │       ├── Sidebar.jsx      # Navigation sidebar
│   │       └── Navbar.jsx       # Top navigation bar
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useNotify.js         # Toast notifications wrapper
│   │   ├── useApiError.js       # Centralized error handling
│   │   └── useKeyboardShortcuts.js # Keyboard shortcuts
│   │
│   ├── pages/                   # Page components (one per route)
│   │   ├── LoginPage.jsx        # Login form
│   │   ├── DashboardPage.jsx    # Dashboard with stats
│   │   ├── dealers/             # Dealer management
│   │   │   ├── DealersPage.jsx
│   │   │   └── DealerFormDialog.jsx
│   │   ├── vehicles/            # Vehicle management
│   │   │   ├── VehiclesPage.jsx
│   │   │   └── VehicleFormDialog.jsx
│   │   ├── testdrive/           # Test drive management
│   │   ├── enquiry/             # Enquiry management
│   │   ├── showroom/            # Public showroom
│   │   └── admin/               # Admin pages
│   │       ├── UsersPage.jsx
│   │       ├── RolesPage.jsx
│   │       ├── MenusPage.jsx
│   │       └── ConfigsPage.jsx
│   │
│   ├── router/                  # Routing configuration
│   │   └── ProtectedRoute.jsx   # Route protection logic
│   │
│   ├── store/                   # Global state management
│   │   └── authStore.js         # Authentication state (Zustand)
│   │
│   ├── utils/                   # Helper functions
│   │   └── dateUtils.js         # Date formatting utilities
│   │
│   ├── App.jsx                  # Root component with routing
│   └── main.jsx                 # Application entry point
│
├── .env                         # Environment variables
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite configuration
└── README.md                    # Project documentation
```

### Folder Structure Principles

#### **1. Separation of Concerns**
- Each folder has a single, clear responsibility
- API logic separated from UI components
- Business logic in custom hooks
- Presentation logic in components

#### **2. Colocation**
- Related files grouped together (e.g., DealersPage + DealerFormDialog)
- Easier to find and modify related code
- Reduces cognitive load

#### **3. Scalability**
- Easy to add new features without restructuring
- Clear naming conventions
- Consistent patterns across the codebase


---

## 🏗️ Architecture & Design Patterns

### 1. Component-Based Architecture

**Principle:** Break UI into small, reusable, independent components

```jsx
// ❌ Bad: Monolithic component
function DealersPage() {
  return (
    <div>
      <h1>Dealers</h1>
      <button>Add</button>
      <input placeholder="Search..." />
      <table>...</table>
      <dialog>...</dialog>
    </div>
  );
}

// ✅ Good: Composed from smaller components
function DealersPage() {
  return (
    <Box>
      <PageHeader title="Dealers" onAdd={handleAdd} />
      <SearchBar onSearch={handleSearch} />
      <DataGrid rows={dealers} columns={columns} />
      <DealerFormDialog open={formOpen} onClose={handleClose} />
    </Box>
  );
}
```

**Benefits:**
- **Reusability** - Use PageHeader across all pages
- **Testability** - Test each component independently
- **Maintainability** - Changes isolated to specific components
- **Readability** - Clear component hierarchy

---

### 2. Container/Presentation Pattern

**Principle:** Separate data fetching (container) from UI rendering (presentation)

```jsx
// Container Component (Smart Component)
function DealersPageContainer() {
  const { data, isLoading } = useQuery({
    queryKey: ['dealers'],
    queryFn: dealerApi.getAll,
  });
  
  if (isLoading) return <CircularProgress />;
  
  return <DealersPagePresentation dealers={data} />;
}

// Presentation Component (Dumb Component)
function DealersPagePresentation({ dealers }) {
  return (
    <DataGrid rows={dealers} columns={columns} />
  );
}
```

**Benefits:**
- **Separation of concerns** - Logic vs UI
- **Easier testing** - Mock data for presentation components
- **Reusability** - Same presentation with different data sources

---

### 3. Custom Hooks Pattern

**Principle:** Extract reusable logic into custom hooks

```jsx
// Custom hook for data fetching
function useDealers(filters) {
  return useQuery({
    queryKey: ['dealers', filters],
    queryFn: () => dealerApi.getAll(filters),
    select: (res) => res.data.data,
  });
}

// Usage in component
function DealersPage() {
  const { data: dealers, isLoading } = useDealers({ status: 'ACTIVE' });
  // Component logic...
}
```

**Benefits:**
- **Reusability** - Use same hook in multiple components
- **Testability** - Test hooks independently
- **Cleaner components** - Less code in components

---

### 4. Composition over Inheritance

**Principle:** Build complex components by composing simpler ones

```jsx
// ✅ Good: Composition
function DealerCard({ dealer }) {
  return (
    <Card>
      <CardHeader title={dealer.name} />
      <CardContent>
        <DealerInfo dealer={dealer} />
        <DealerActions dealer={dealer} />
      </CardContent>
    </Card>
  );
}

// ❌ Bad: Inheritance (not recommended in React)
class DealerCard extends BaseCard {
  render() {
    return super.render() + this.customContent();
  }
}
```

---

### 5. Render Props Pattern

**Principle:** Share code between components using a prop whose value is a function

```jsx
function DataFetcher({ url, render }) {
  const { data, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => axios.get(url),
  });
  
  return render({ data, isLoading });
}

// Usage
<DataFetcher 
  url="/api/dealers" 
  render={({ data, isLoading }) => (
    isLoading ? <Spinner /> : <DealerList dealers={data} />
  )}
/>
```

---

## 🔄 State Management

### Three Types of State

#### **1. Server State (TanStack Query)**

**What is it?**
- Data fetched from backend APIs
- Examples: dealers, vehicles, users

**Why TanStack Query?**
- Automatic caching and background refetching
- Built-in loading/error states
- Optimistic updates
- Request deduplication
- Pagination support

**Basic Usage:**

```jsx
// Fetching data
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['dealers', page, search],  // Cache key
  queryFn: () => dealerApi.getAll({ page, search }),  // Fetch function
  select: (res) => res.data.data,  // Transform response
  staleTime: 30000,  // Data fresh for 30 seconds
  cacheTime: 300000,  // Keep in cache for 5 minutes
  retry: 1,  // Retry failed requests once
  enabled: true,  // Conditional fetching
});

// Mutating data (POST, PUT, DELETE)
const mutation = useMutation({
  mutationFn: (data) => dealerApi.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['dealers']);  // Refetch dealers
    notify.success('Dealer created');
  },
  onError: (error) => {
    notify.error(error.message);
  },
});

// Trigger mutation
mutation.mutate({ name: 'New Dealer' });
```


**Advanced: Optimistic Updates**

```jsx
const mutation = useMutation({
  mutationFn: (data) => dealerApi.update(id, data),
  
  // Before mutation
  onMutate: async (newData) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries(['dealers']);
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['dealers']);
    
    // Optimistically update UI
    queryClient.setQueryData(['dealers'], (old) => ({
      ...old,
      content: old.content.map(d => 
        d.id === id ? { ...d, ...newData } : d
      ),
    }));
    
    return { previous };  // Return context for rollback
  },
  
  // On error, rollback
  onError: (err, newData, context) => {
    queryClient.setQueryData(['dealers'], context.previous);
    notify.error('Update failed');
  },
  
  // Always refetch after success or error
  onSettled: () => {
    queryClient.invalidateQueries(['dealers']);
  },
});
```

**Benefits:**
- **Instant feedback** - UI updates immediately
- **Better UX** - No waiting for server response
- **Automatic rollback** - Reverts on error

---

#### **2. Global State (Zustand)**

**What is it?**
- Application-wide state (authentication, theme, settings)
- Accessible from any component

**Why Zustand?**
- Simple API (no boilerplate)
- Small bundle size (1KB)
- No Provider wrapper needed
- TypeScript friendly

**Implementation:**

```jsx
// store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      roles: [],
      
      // Actions
      setAuth: (data) => set({
        user: data.username,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        roles: data.roles,
      }),
      
      logout: () => {
        localStorage.clear();
        set({ user: null, accessToken: null, refreshToken: null, roles: [] });
      },
      
      // Computed values
      isAuthenticated: () => !!get().accessToken,
      
      hasRole: (role) => get().roles.includes(role),
    }),
    {
      name: 'auth-storage',  // localStorage key
      partialize: (state) => ({  // Only persist these fields
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        roles: state.roles,
      }),
    }
  )
);

// Usage in components
function Navbar() {
  const { user, logout, hasRole } = useAuthStore();
  
  return (
    <Box>
      <Typography>Welcome, {user}</Typography>
      {hasRole('ADMIN') && <Button>Admin Panel</Button>}
      <Button onClick={logout}>Logout</Button>
    </Box>
  );
}
```

**Key Features:**
- **Persistence** - Survives page refresh
- **Selective subscription** - Only re-render when used state changes
- **Computed values** - Derived state (isAuthenticated, hasRole)

---

#### **3. Local State (useState)**

**What is it?**
- Component-specific state (form inputs, modals, toggles)

**When to use:**
- UI state (modal open/close, selected tab)
- Form inputs (before submission)
- Temporary data (search query, filters)

**Example:**

```jsx
function DealersPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  
  return (
    <Box>
      <SearchBar value={search} onChange={setSearch} />
      <Button onClick={() => setFormOpen(true)}>Add Dealer</Button>
      <DealerFormDialog 
        open={formOpen} 
        onClose={() => setFormOpen(false)}
        editData={editData}
      />
    </Box>
  );
}
```

---

### State Management Decision Tree

```
Is it data from the server?
├─ Yes → Use TanStack Query
└─ No → Is it needed across multiple components?
    ├─ Yes → Use Zustand (global state)
    └─ No → Use useState (local state)
```

---

## 🧭 Routing & Navigation

### React Router v7 Setup

**App.jsx - Root Routing Configuration:**

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes with layout */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dealers" element={<DealersPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          
          {/* Admin-only routes */}
          <Route path="admin/users" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'DEALER']}>
              <UsersPage />
            </ProtectedRoute>
          } />
          
          <Route path="admin/roles" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <RolesPage />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```


### Protected Route Implementation

**router/ProtectedRoute.jsx:**

```jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children, requiredRoles }) {
  const { isAuthenticated, hasRole } = useAuthStore();

  // Check authentication
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRoles && !requiredRoles.some(role => hasRole(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
```

**How it works:**
1. Checks if user is authenticated (has valid token)
2. If not authenticated → redirect to login
3. If authenticated but lacks required role → redirect to dashboard
4. If all checks pass → render the protected component

**Usage Examples:**

```jsx
// Anyone authenticated can access
<Route path="dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />

// Only ADMIN can access
<Route path="admin/roles" element={
  <ProtectedRoute requiredRoles={['ADMIN']}>
    <RolesPage />
  </ProtectedRoute>
} />

// ADMIN or DEALER can access
<Route path="admin/users" element={
  <ProtectedRoute requiredRoles={['ADMIN', 'DEALER']}>
    <UsersPage />
  </ProtectedRoute>
} />
```

---

### Nested Routes & Layout

**AppLayout.jsx - Shared Layout:**

```jsx
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Navbar />
        <Outlet />  {/* Child routes render here */}
      </Box>
    </Box>
  );
}
```

**Benefits:**
- **DRY principle** - Sidebar/Navbar shared across all pages
- **Consistent layout** - Same structure everywhere
- **Easy to modify** - Change layout in one place

---

### Programmatic Navigation

```jsx
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  
  const handleLogin = async (credentials) => {
    const response = await authApi.login(credentials);
    setAuth(response.data);
    navigate('/dashboard');  // Redirect after login
  };
  
  return <LoginForm onSubmit={handleLogin} />;
}
```

---

## 🌐 API Integration

### Axios Configuration with Interceptors

**api/axiosInstance.js:**

```jsx
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ──────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR - Runs before every request
// ──────────────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Attach JWT token
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 2. Add idempotency key for POST requests
    if (config.method === 'post' && !config.headers['Idempotency-Key']) {
      config.headers['Idempotency-Key'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ──────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR - Runs after every response
// ──────────────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,  // Success - return as is
  
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  // Prevent infinite loop
      
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Try to refresh access token
          const res = await axios.post(`${BASE_URL}/v1/auth/refresh`, null, {
            headers: { 'X-Refresh-Token': refreshToken },
          });
          
          const newToken = res.data.data.accessToken;
          localStorage.setItem('accessToken', newToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
          
        } catch (refreshError) {
          // Refresh failed - logout user
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        // No refresh token - logout user
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

**Key Features:**

1. **Automatic Token Attachment**
   - Every request includes JWT token
   - No need to manually add Authorization header

2. **Idempotency Keys**
   - Prevents duplicate POST requests
   - Server can detect and ignore duplicates

3. **Automatic Token Refresh**
   - When access token expires (401), automatically refresh it
   - Retry original request with new token
   - Seamless UX (no logout)

4. **Centralized Error Handling**
   - Single place to handle authentication errors
   - Automatic logout on refresh failure


---

### API Service Layer

**api/dealerApi.js - Example:**

```jsx
import axiosInstance from './axiosInstance';

export const dealerApi = {
  // GET /v1/dealers?page=0&size=10&search=seoul&status=ACTIVE
  getAll: (params) => axiosInstance.get('/v1/dealers', { params }),
  
  // GET /v1/dealers/123
  getById: (id) => axiosInstance.get(`/v1/dealers/${id}`),
  
  // POST /v1/dealers
  create: (data) => axiosInstance.post('/v1/dealers', data),
  
  // PUT /v1/dealers/123
  update: (id, data) => axiosInstance.put(`/v1/dealers/${id}`, data),
  
  // DELETE /v1/dealers/123
  delete: (id) => axiosInstance.delete(`/v1/dealers/${id}`),
  
  // GET /v1/dealers/regions
  getRegions: () => axiosInstance.get('/v1/dealers/regions'),
};
```

**Benefits:**
- **Centralized** - All dealer API calls in one place
- **Reusable** - Import and use anywhere
- **Maintainable** - Easy to update endpoints
- **Type-safe** - Can add TypeScript types

**Usage in Components:**

```jsx
import { dealerApi } from '../api/dealerApi';

function DealersPage() {
  // Fetch dealers
  const { data } = useQuery({
    queryKey: ['dealers'],
    queryFn: () => dealerApi.getAll({ page: 0, size: 10 }),
  });
  
  // Create dealer
  const createMutation = useMutation({
    mutationFn: (data) => dealerApi.create(data),
  });
  
  // Update dealer
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => dealerApi.update(id, data),
  });
  
  // Delete dealer
  const deleteMutation = useMutation({
    mutationFn: (id) => dealerApi.delete(id),
  });
}
```

---

## 📝 Form Handling & Validation

### React Hook Form + Yup

**Why React Hook Form?**
- **Performance** - Uncontrolled components (fewer re-renders)
- **Less code** - No manual onChange handlers
- **Built-in validation** - Integrates with Yup
- **Better UX** - Validates on blur, not on every keystroke

**Why Yup?**
- **Schema-based** - Define validation rules in one place
- **Reusable** - Share schemas across forms
- **Readable** - Clear, declarative syntax
- **Powerful** - Complex validation rules (regex, custom validators)

---

### Basic Form Example

**LoginPage.jsx:**

```jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// 1. Define validation schema
const schema = yup.object({
  username: yup.string()
    .required('Username is required')
    .min(3, 'Min 3 characters'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Min 8 characters'),
});

export default function LoginPage() {
  // 2. Initialize form with schema
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { username: '', password: '' },
  });
  
  // 3. Submit handler
  const onSubmit = async (data) => {
    try {
      const response = await authApi.login(data);
      setAuth(response.data);
      navigate('/dashboard');
    } catch (error) {
      notify.error('Login failed');
    }
  };
  
  // 4. Render form
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('username')}
        label="Username"
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      
      <TextField
        {...register('password')}
        type="password"
        label="Password"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      
      <Button type="submit">Login</Button>
    </form>
  );
}
```

**How it works:**
1. **Schema** - Define validation rules
2. **register()** - Connect input to form state
3. **handleSubmit()** - Validates before calling onSubmit
4. **errors** - Display validation errors

---

### Advanced Form with Controller

**For MUI Select, Checkbox, DatePicker:**

```jsx
import { Controller } from 'react-hook-form';

const schema = yup.object({
  dealerId: yup.number().required('Dealer is required'),
  status: yup.string().required('Status is required'),
  scheduledDate: yup.date().required('Date is required'),
});

function TestDriveForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Controlled Select */}
      <Controller
        name="dealerId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Dealer"
            error={!!errors.dealerId}
            helperText={errors.dealerId?.message}
          >
            {dealers.map(d => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </TextField>
        )}
      />
      
      {/* Controlled Radio */}
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <RadioGroup {...field}>
            <FormControlLabel value="SCHEDULED" control={<Radio />} label="Scheduled" />
            <FormControlLabel value="COMPLETED" control={<Radio />} label="Completed" />
          </RadioGroup>
        )}
      />
    </form>
  );
}
```

---

### Complex Validation Rules

```jsx
const schema = yup.object({
  // Email validation
  email: yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  
  // Phone validation with regex
  phone: yup.string()
    .matches(/^[+]?[0-9]{10,15}$/, 'Invalid phone number')
    .required('Phone is required'),
  
  // Password with strength requirements
  password: yup.string()
    .min(8, 'Min 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/[a-z]/, 'Must contain lowercase')
    .matches(/[0-9]/, 'Must contain number')
    .matches(/[@$!%*?&#]/, 'Must contain special character')
    .required('Password is required'),
  
  // Confirm password
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  
  // Conditional validation
  dealerId: yup.number()
    .when('role', {
      is: (role) => ['DEALER', 'EMPLOYEE'].includes(role),
      then: (schema) => schema.required('Dealer is required for this role'),
      otherwise: (schema) => schema.nullable(),
    }),
  
  // Custom validation
  vin: yup.string()
    .test('valid-vin', 'Invalid VIN format', (value) => {
      return /^[A-HJ-NPR-Z0-9]{17}$/.test(value);
    })
    .required('VIN is required'),
});
```


---

## 🎨 UI/UX Patterns

### 1. Server-Side Pagination

**Why server-side?**
- **Performance** - Don't load 10,000 records at once
- **Scalability** - Works with large datasets
- **Bandwidth** - Reduces data transfer

**Implementation:**

```jsx
function DealersPage() {
  const [paginationModel, setPaginationModel] = useState({ 
    page: 0, 
    pageSize: 10 
  });
  
  const { data, isLoading } = useQuery({
    queryKey: ['dealers', paginationModel.page, paginationModel.pageSize],
    queryFn: () => dealerApi.getAll({
      page: paginationModel.page,
      size: paginationModel.pageSize,
    }),
    select: (res) => res.data.data,
    placeholderData: keepPreviousData,  // Keep old data while fetching
  });
  
  return (
    <DataGrid
      rows={data?.content || []}
      columns={columns}
      rowCount={data?.totalElements ?? 0}
      loading={isLoading}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[5, 10, 25, 50]}
    />
  );
}
```

**Backend Response Format:**

```json
{
  "content": [...],
  "page": 0,
  "size": 10,
  "totalElements": 150,
  "totalPages": 15,
  "first": true,
  "last": false
}
```

---

### 2. Debounced Search

**Why debounce?**
- **Performance** - Don't search on every keystroke
- **Fewer API calls** - Wait for user to stop typing
- **Better UX** - Reduces server load

**Implementation:**

```jsx
function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  
  // Debounce: wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 500);
    
    return () => clearTimeout(timer);  // Cleanup
  }, [value, onSearch]);
  
  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search..."
      InputProps={{
        startAdornment: <Search />,
      }}
    />
  );
}

// Usage
function DealersPage() {
  const [search, setSearch] = useState('');
  
  const { data } = useQuery({
    queryKey: ['dealers', search],
    queryFn: () => dealerApi.getAll({ search }),
  });
  
  return <SearchBar onSearch={setSearch} />;
}
```

---

### 3. Linked Dropdowns (Cascading)

**Use case:** Model → Variant → Color selection

```jsx
function VehicleForm() {
  const { control, watch } = useForm();
  
  const watchModel = watch('model');
  const watchVariant = watch('variant');
  
  // Fetch models (always)
  const { data: models } = useQuery({
    queryKey: ['vehicle-models'],
    queryFn: () => vehicleApi.getModels(),
  });
  
  // Fetch variants (only when model selected)
  const { data: variants } = useQuery({
    queryKey: ['vehicle-variants', watchModel],
    queryFn: () => vehicleApi.getVariants(watchModel),
    enabled: !!watchModel,  // Conditional fetching
  });
  
  // Fetch colors (only when model + variant selected)
  const { data: colors } = useQuery({
    queryKey: ['vehicle-colors', watchModel, watchVariant],
    queryFn: () => vehicleApi.getColors(watchModel, watchVariant),
    enabled: !!watchModel && !!watchVariant,
  });
  
  return (
    <form>
      {/* Model dropdown */}
      <Controller
        name="model"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Model">
            {models?.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>
        )}
      />
      
      {/* Variant dropdown (disabled until model selected) */}
      <Controller
        name="variant"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Variant" disabled={!watchModel}>
            {variants?.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </TextField>
        )}
      />
      
      {/* Color dropdown (disabled until variant selected) */}
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Color" disabled={!watchVariant}>
            {colors?.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
        )}
      />
    </form>
  );
}
```

**How it works:**
1. User selects Model → triggers variants query
2. User selects Variant → triggers colors query
3. Dropdowns disabled until dependencies met

---

### 4. Inline Editing (DataGrid)

**Benefits:**
- **Faster editing** - No modal needed
- **Excel-like UX** - Familiar to users
- **Instant feedback** - See changes immediately

```jsx
function DealersPage() {
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();
  
  return (
    <DataGrid
      rows={dealers}
      columns={columns}
      
      // Enable inline editing
      processRowUpdate={async (newRow, oldRow) => {
        try {
          // Update on server
          await dealerApi.update(newRow.id, newRow);
          
          // Show success message
          notify.success('Dealer updated');
          
          // Refetch data
          queryClient.invalidateQueries(['dealers']);
          
          // Return new row to update UI
          return newRow;
        } catch (error) {
          // Revert to old row on error
          handleError(error);
          return oldRow;
        }
      }}
      
      // Handle errors
      onProcessRowUpdateError={handleError}
    />
  );
}
```

**How to use:**
1. Double-click any cell
2. Edit value
3. Press Enter or click outside
4. Automatically saves to server

---

### 5. Drag-and-Drop (Menu Reordering)

**Native HTML5 Drag-and-Drop:**

```jsx
function MenusPage() {
  const [draggedItem, setDraggedItem] = useState(null);
  
  const handleDragStart = (e, menu) => {
    setDraggedItem(menu);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e, targetMenu) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetMenu.id) return;
    
    // Swap sort orders
    const draggedOrder = draggedItem.sortOrder;
    const targetOrder = targetMenu.sortOrder;
    
    // Update both items on server
    reorderMutation.mutate({ id: draggedItem.id, newOrder: targetOrder });
    reorderMutation.mutate({ id: targetMenu.id, newOrder: draggedOrder });
    
    setDraggedItem(null);
  };
  
  return (
    <Table>
      <TableBody>
        {menus.map(menu => (
          <TableRow
            key={menu.id}
            draggable
            onDragStart={(e) => handleDragStart(e, menu)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, menu)}
            sx={{
              cursor: 'move',
              opacity: draggedItem?.id === menu.id ? 0.5 : 1,
            }}
          >
            <TableCell>
              <DragIndicator />
            </TableCell>
            <TableCell>{menu.menuName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

**Visual feedback:**
- Drag handle icon (DragIndicator)
- Opacity change while dragging
- Hover effect on drop target


---

### 6. Responsive Design

**Material-UI Grid System:**

```jsx
<Grid container spacing={2}>
  {/* Full width on mobile, half on tablet, third on desktop */}
  <Grid item xs={12} sm={6} md={4}>
    <Card>...</Card>
  </Grid>
</Grid>

{/* Conditional rendering based on screen size */}
<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
  {/* Hidden on mobile, visible on desktop */}
</Box>

<Box sx={{ display: { xs: 'block', md: 'none' } }}>
  {/* Visible on mobile, hidden on desktop */}
</Box>
```

**Breakpoints:**
- `xs` - Extra small (0-600px) - Mobile
- `sm` - Small (600-900px) - Tablet
- `md` - Medium (900-1200px) - Desktop
- `lg` - Large (1200-1536px) - Large desktop
- `xl` - Extra large (1536px+) - Extra large desktop

**Responsive Typography:**

```jsx
<Typography 
  variant="h4" 
  sx={{ 
    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } 
  }}
>
  Responsive Heading
</Typography>
```

---

### 7. Keyboard Shortcuts

**Custom Hook:**

```jsx
// hooks/useKeyboardShortcuts.js
export const useKeyboardShortcuts = ({ onNew, onClose, onSave }) => {
  useEffect(() => {
    const handler = (e) => {
      // Ctrl+N - New
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        onNew?.();
      }
      
      // Escape - Close
      if (e.key === 'Escape') {
        onClose?.();
      }
      
      // Ctrl+S - Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNew, onClose, onSave]);
};

// Usage
function DealersPage() {
  const [formOpen, setFormOpen] = useState(false);
  
  useKeyboardShortcuts({
    onNew: () => setFormOpen(true),
    onClose: () => setFormOpen(false),
  });
  
  return (
    <Box>
      <Typography variant="caption">
        Tip: Press <strong>Ctrl+N</strong> to add new dealer
      </Typography>
    </Box>
  );
}
```

---

### 8. Loading States & Skeletons

**Better UX than spinners:**

```jsx
function DealersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dealers'],
    queryFn: dealerApi.getAll,
  });
  
  if (isLoading) {
    return (
      <Box>
        {/* Skeleton cards while loading */}
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height={100} />
            <Skeleton variant="text" width="40%" />
          </Card>
        ))}
      </Box>
    );
  }
  
  return <DealerList dealers={data} />;
}
```

---

## ⚡ Performance Optimizations

### 1. Code Splitting (Lazy Loading)

**Problem:** Loading all pages at once increases initial bundle size

**Solution:** Load pages on demand

```jsx
import { lazy, Suspense } from 'react';

// Lazy load pages
const DealersPage = lazy(() => import('./pages/dealers/DealersPage'));
const VehiclesPage = lazy(() => import('./pages/vehicles/VehiclesPage'));

function App() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Routes>
        <Route path="/dealers" element={<DealersPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
      </Routes>
    </Suspense>
  );
}
```

**Benefits:**
- **Faster initial load** - Smaller main bundle
- **Better performance** - Load only what's needed
- **Automatic code splitting** - Vite creates separate chunks

---

### 2. React Query Caching

**Configuration:**

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,      // Data fresh for 30 seconds
      cacheTime: 300000,     // Keep in cache for 5 minutes
      retry: 1,              // Retry failed requests once
      refetchOnWindowFocus: true,  // Refetch when tab focused
      refetchOnReconnect: true,    // Refetch when internet reconnects
    },
  },
});
```

**How it works:**
1. First request → Fetch from server, cache response
2. Second request (within 30s) → Return cached data instantly
3. After 30s → Data stale, refetch in background
4. After 5 min → Remove from cache

**Benefits:**
- **Instant navigation** - No loading on revisit
- **Fewer API calls** - Reuse cached data
- **Always fresh** - Background refetching

---

### 3. Memoization

**React.memo - Prevent unnecessary re-renders:**

```jsx
// Without memo - re-renders on every parent update
function DealerCard({ dealer }) {
  console.log('Rendering DealerCard');
  return <Card>...</Card>;
}

// With memo - only re-renders when dealer changes
const DealerCard = React.memo(({ dealer }) => {
  console.log('Rendering DealerCard');
  return <Card>...</Card>;
});
```

**useMemo - Expensive calculations:**

```jsx
function DealersPage({ dealers }) {
  // Without useMemo - recalculates on every render
  const sortedDealers = dealers.sort((a, b) => a.name.localeCompare(b.name));
  
  // With useMemo - only recalculates when dealers change
  const sortedDealers = useMemo(() => {
    return dealers.sort((a, b) => a.name.localeCompare(b.name));
  }, [dealers]);
  
  return <DealerList dealers={sortedDealers} />;
}
```

**useCallback - Stable function references:**

```jsx
function DealersPage() {
  // Without useCallback - new function on every render
  const handleDelete = (id) => dealerApi.delete(id);
  
  // With useCallback - same function reference
  const handleDelete = useCallback((id) => {
    dealerApi.delete(id);
  }, []);
  
  return <DealerList onDelete={handleDelete} />;
}
```

---

### 4. Virtual Scrolling

**For large lists (1000+ items):**

```jsx
import { FixedSizeList } from 'react-window';

function VehicleList({ vehicles }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <VehicleCard vehicle={vehicles[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={vehicles.length}
      itemSize={100}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

**Benefits:**
- Only renders visible items
- Smooth scrolling with 10,000+ items
- Constant memory usage

---

### 5. Image Optimization

```jsx
function VehicleCard({ vehicle }) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <img
      src={imgError ? FALLBACK_IMAGE : vehicle.imageUrl}
      alt={vehicle.model}
      loading="lazy"  // Lazy load images
      onError={() => setImgError(true)}  // Fallback on error
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
```

---

## 🔒 Security Implementation

### 1. JWT Token Management

**Storage:**

```jsx
// Store tokens in localStorage
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);

// Retrieve tokens
const token = localStorage.getItem('accessToken');

// Clear on logout
localStorage.clear();
```

**Why localStorage?**
- Persists across page refresh
- Accessible from any component
- Simple API

**Security considerations:**
- Vulnerable to XSS attacks
- Use httpOnly cookies for production (more secure)
- Always use HTTPS in production

---

### 2. Role-Based Access Control (RBAC)

**Component-level:**

```jsx
function DealersPage() {
  const { hasRole } = useAuthStore();
  
  return (
    <Box>
      {/* Show delete button only to ADMIN */}
      {hasRole('ADMIN') && (
        <Button onClick={handleDelete}>Delete</Button>
      )}
      
      {/* Show edit button to ADMIN and DEALER */}
      {(hasRole('ADMIN') || hasRole('DEALER')) && (
        <Button onClick={handleEdit}>Edit</Button>
      )}
    </Box>
  );
}
```

**Route-level:**

```jsx
<Route path="admin/users" element={
  <ProtectedRoute requiredRoles={['ADMIN', 'DEALER']}>
    <UsersPage />
  </ProtectedRoute>
} />
```

---

### 3. XSS Prevention

**React automatically escapes:**

```jsx
// Safe - React escapes HTML
<div>{userInput}</div>

// Dangerous - Don't use unless necessary
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

**Input sanitization:**

```jsx
import DOMPurify from 'dompurify';

function CommentBox({ comment }) {
  const sanitized = DOMPurify.sanitize(comment);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

---

### 4. CSRF Protection

**Not needed for JWT-based auth:**
- CSRF attacks target cookie-based auth
- JWT in Authorization header is safe
- Server validates JWT signature

---

### 5. Secure API Calls

**Always use HTTPS in production:**

```jsx
// .env.production
VITE_API_URL=https://api.hyundai-dms.com
```

**Validate responses:**

```jsx
const { data } = await dealerApi.getAll();

// Validate response structure
if (!data || !Array.isArray(data.content)) {
  throw new Error('Invalid response format');
}
```


---

## 🚨 Error Handling

### 1. Global Error Boundary

**Catches React errors:**

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service (Sentry, LogRocket)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4">Something went wrong</Typography>
          <Typography variant="body1">{this.state.error?.message}</Typography>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Usage in App.jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

### 2. API Error Handling

**Custom Hook:**

```jsx
// hooks/useApiError.js
export const useApiError = () => {
  const notify = useNotify();
  
  const handleError = (error) => {
    // Extract error message
    const message = error?.response?.data?.message 
      || error?.message 
      || 'An unexpected error occurred';
    
    // Show toast notification
    notify.error(message);
    
    // Log to console (development)
    if (import.meta.env.DEV) {
      console.error('API Error:', error);
    }
    
    // Send to error tracking (production)
    if (import.meta.env.PROD) {
      // Sentry.captureException(error);
    }
  };
  
  return { handleError };
};

// Usage
function DealersPage() {
  const { handleError } = useApiError();
  
  const mutation = useMutation({
    mutationFn: dealerApi.create,
    onError: handleError,  // Centralized error handling
  });
}
```

---

### 3. Form Validation Errors

**Display inline:**

```jsx
<TextField
  {...register('email')}
  label="Email"
  error={!!errors.email}
  helperText={errors.email?.message}
/>
```

**Display summary:**

```jsx
{Object.keys(errors).length > 0 && (
  <Alert severity="error">
    <AlertTitle>Validation Errors</AlertTitle>
    <ul>
      {Object.entries(errors).map(([field, error]) => (
        <li key={field}>{error.message}</li>
      ))}
    </ul>
  </Alert>
)}
```

---

### 4. Network Error Handling

**Retry logic:**

```jsx
const { data, error, refetch } = useQuery({
  queryKey: ['dealers'],
  queryFn: dealerApi.getAll,
  retry: 3,  // Retry 3 times
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (error) {
  return (
    <Box>
      <Typography>Failed to load dealers</Typography>
      <Button onClick={() => refetch()}>Retry</Button>
    </Box>
  );
}
```

---

### 5. Toast Notifications

**useNotify Hook:**

```jsx
// hooks/useNotify.js
import { toast } from 'react-toastify';

export const useNotify = () => {
  return {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    warning: (message) => toast.warning(message),
    info: (message) => toast.info(message),
  };
};

// Usage
function DealersPage() {
  const notify = useNotify();
  
  const mutation = useMutation({
    mutationFn: dealerApi.create,
    onSuccess: () => notify.success('Dealer created successfully'),
    onError: () => notify.error('Failed to create dealer'),
  });
}
```

---

## 🎣 Custom Hooks

### 1. useNotify

**Purpose:** Centralized toast notifications

```jsx
export const useNotify = () => {
  return {
    success: (msg) => toast.success(msg, { position: 'top-right' }),
    error: (msg) => toast.error(msg, { position: 'top-right' }),
    warning: (msg) => toast.warning(msg, { position: 'top-right' }),
    info: (msg) => toast.info(msg, { position: 'top-right' }),
  };
};
```

---

### 2. useApiError

**Purpose:** Consistent API error handling

```jsx
export const useApiError = () => {
  const notify = useNotify();
  
  return {
    handleError: (error) => {
      const msg = error?.response?.data?.message || 'An error occurred';
      notify.error(msg);
      console.error('API Error:', error);
    },
  };
};
```

---

### 3. useKeyboardShortcuts

**Purpose:** Global keyboard shortcuts

```jsx
export const useKeyboardShortcuts = ({ onNew, onClose, onSave }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        onNew?.();
      }
      if (e.key === 'Escape') onClose?.();
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNew, onClose, onSave]);
};
```

---

### 4. useDebounce

**Purpose:** Debounce search input

```jsx
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage
function SearchBar() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  useQuery({
    queryKey: ['dealers', debouncedSearch],
    queryFn: () => dealerApi.getAll({ search: debouncedSearch }),
  });
}
```

---

### 5. useLocalStorage

**Purpose:** Persist state to localStorage

```jsx
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  return [value, setStoredValue];
};

// Usage
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </Button>
  );
}
```

---

## 🧩 Component Library

### 1. PageHeader

**Purpose:** Consistent page titles with action buttons

```jsx
function PageHeader({ title, subtitle, onAdd, addLabel = 'Add New' }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700}>{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        )}
      </Box>
      {onAdd && (
        <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
          {addLabel}
        </Button>
      )}
    </Box>
  );
}

// Usage
<PageHeader 
  title="Dealers" 
  subtitle="Manage dealership network"
  onAdd={() => setFormOpen(true)}
/>
```

---

### 2. SearchBar

**Purpose:** Debounced search input

```jsx
function SearchBar({ placeholder, onSearch }) {
  const [value, setValue] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 500);
    return () => clearTimeout(timer);
  }, [value, onSearch]);
  
  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      InputProps={{
        startAdornment: <Search />,
      }}
      sx={{ minWidth: 280 }}
    />
  );
}
```

---

### 3. ConfirmDialog

**Purpose:** Reusable confirmation modal

```jsx
function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title || 'Confirm Action'}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Usage
<ConfirmDialog
  open={!!deleteId}
  message="Are you sure you want to delete this dealer?"
  onConfirm={() => deleteMutation.mutate(deleteId)}
  onCancel={() => setDeleteId(null)}
/>
```

---

### 4. LoadingButton

**Purpose:** Button with loading state

```jsx
function LoadingButton({ loading, children, ...props }) {
  return (
    <Button {...props} disabled={loading}>
      {loading ? <CircularProgress size={20} /> : children}
    </Button>
  );
}

// Usage
<LoadingButton 
  loading={mutation.isPending}
  onClick={() => mutation.mutate(data)}
>
  Save
</LoadingButton>
```


---

## 📝 Code Review Preparation

### Common Manager Questions & Answers

#### **Q1: Why React over Angular/Vue?**

**Answer:**
- **Larger ecosystem** - More libraries, more community support
- **Better performance** - Virtual DOM is faster than Angular's change detection
- **Flexibility** - Not opinionated like Angular, can choose own tools
- **Job market** - Easier to hire React developers
- **Industry adoption** - Used by Facebook, Netflix, Airbnb, Tesla

---

#### **Q2: Why Vite over Create React App?**

**Answer:**
- **10x faster builds** - Uses esbuild (written in Go) instead of Webpack
- **Instant HMR** - Hot Module Replacement in milliseconds
- **Smaller bundles** - Better tree-shaking and code splitting
- **Native ES modules** - No bundling in development
- **CRA is deprecated** - No longer maintained by React team
- **Better DX** - Faster feedback loop during development

---

#### **Q3: Why TanStack Query over Redux?**

**Answer:**
- **Different purposes:**
  - Redux: Client state (UI state, form state)
  - React Query: Server state (API data)
- **React Query advantages:**
  - Automatic caching and background refetching
  - Built-in loading/error states
  - Optimistic updates
  - Request deduplication
  - Less boilerplate (no actions, reducers)
- **We use both:**
  - React Query for server data
  - Zustand for global client state (auth)

---

#### **Q4: How do you handle large datasets?**

**Answer:**
- **Server-side pagination** - Load 10-20 records at a time
- **Debounced search** - Wait for user to stop typing
- **Virtual scrolling** - Render only visible rows (react-window)
- **Lazy loading** - Load data on demand
- **Caching** - React Query caches responses
- **Optimistic updates** - Instant UI feedback

---

#### **Q5: How do you ensure code quality?**

**Answer:**
- **ESLint** - Catches errors and enforces coding standards
- **Prettier** - Auto-formats code for consistency
- **Husky** - Pre-commit hooks to run linters
- **Code reviews** - Peer review before merging
- **Component-driven development** - Small, testable components
- **Custom hooks** - Reusable logic
- **TypeScript** (future) - Type safety

---

#### **Q6: How do you handle API failures?**

**Answer:**
- **Retry logic** - React Query retries failed requests (configurable)
- **Error boundaries** - Catch React errors and show fallback UI
- **Toast notifications** - User-friendly error messages
- **Fallback UI** - Show error state, not blank screen
- **Automatic token refresh** - Seamless UX on token expiry
- **Offline detection** - Show message when internet disconnected

---

#### **Q7: How do you optimize bundle size?**

**Answer:**
- **Code splitting** - Lazy load routes with React.lazy()
- **Tree shaking** - Vite removes unused code
- **Dynamic imports** - Load components on demand
- **Analyze bundle** - Use vite-bundle-visualizer
- **Optimize images** - Lazy loading, WebP format
- **Remove unused dependencies** - Regular audit

---

#### **Q8: How do you handle authentication?**

**Answer:**
- **JWT tokens** - Stateless authentication
- **Refresh tokens** - Auto-refresh on expiry (seamless UX)
- **Protected routes** - Check auth before rendering
- **Axios interceptors** - Attach token to all requests
- **Role-based access** - Show/hide features based on role
- **Secure storage** - localStorage (httpOnly cookies in production)

---

#### **Q9: How do you test the application?**

**Answer:**
- **Unit tests** - React Testing Library for components
- **Integration tests** - Test user flows (login → dashboard)
- **E2E tests** - Playwright/Cypress for critical paths
- **Mock API** - MSW (Mock Service Worker) for testing
- **Test coverage** - Aim for 80%+ coverage
- **Continuous testing** - Run tests on every commit

---

#### **Q10: What would you improve next?**

**Answer:**
- **TypeScript** - Add type safety
- **Unit tests** - Increase test coverage
- **Accessibility** - WCAG 2.1 AA compliance
- **PWA** - Offline support, push notifications
- **Performance monitoring** - Add Lighthouse CI
- **Error tracking** - Integrate Sentry
- **Analytics** - Add Google Analytics
- **Internationalization** - Multi-language support

---

### Demo Flow for Manager

#### **1. Login Flow (5 minutes)**

**Show:**
- Form validation (try invalid email)
- Error handling (wrong password)
- Account lock (5 failed attempts)
- Successful login → redirect to dashboard

**Explain:**
- React Hook Form + Yup validation
- Axios interceptors for token management
- Zustand for auth state
- Protected routes

---

#### **2. Dashboard (3 minutes)**

**Show:**
- Role-based content (different for ADMIN/DEALER/EMPLOYEE)
- Real-time data (React Query auto-refetch)
- Responsive design (resize browser)

**Explain:**
- TanStack Query for data fetching
- Material-UI Grid system
- Conditional rendering based on roles

---

#### **3. Dealers Page (10 minutes)**

**Show:**
- Server-side pagination (navigate pages)
- Search with debouncing (type in search box)
- Sorting (click column headers)
- Inline editing (double-click cell, edit, save)
- Add new dealer (form validation)
- Delete dealer (confirmation dialog)
- Keyboard shortcuts (Ctrl+N for new)

**Explain:**
- DataGrid with server-side pagination
- Debounced search (useDebounce hook)
- Optimistic updates
- Form validation with Yup
- Custom hooks (useNotify, useApiError)

---

#### **4. Vehicles Page (8 minutes)**

**Show:**
- Linked dropdowns (Model → Variant → Color)
- Form validation (try invalid VIN)
- Create vehicle
- Update vehicle
- Filter by status

**Explain:**
- Cascading dropdowns with conditional fetching
- React Hook Form Controller
- Yup schema validation
- React Query mutations

---

#### **5. Menus Page (5 minutes)**

**Show:**
- Drag-and-drop reordering
- Visual feedback while dragging
- Automatic save on drop

**Explain:**
- Native HTML5 drag-and-drop
- No external library needed
- Optimistic updates

---

#### **6. Role-Based Access (3 minutes)**

**Show:**
- Login as ADMIN → see all menus
- Login as DEALER → limited menus
- Login as EMPLOYEE → basic menus
- Try to access admin page as DEALER → redirect

**Explain:**
- ProtectedRoute component
- hasRole() function in Zustand
- Conditional rendering

---

#### **7. Responsive Design (2 minutes)**

**Show:**
- Resize browser to mobile size
- Hamburger menu appears
- Grid layout changes
- Touch-friendly buttons

**Explain:**
- Material-UI breakpoints
- Responsive Grid system
- Mobile-first approach

---

### Technical Deep Dive Topics

#### **1. React Query Caching Strategy**

**Explain:**
```
1. First request → Fetch from server, cache response
2. Second request (within staleTime) → Return cached data instantly
3. After staleTime → Data stale, refetch in background
4. After cacheTime → Remove from cache
5. Window focus → Refetch to ensure fresh data
```

**Benefits:**
- Instant navigation (no loading on revisit)
- Fewer API calls (reduced server load)
- Always fresh data (background refetching)

---

#### **2. Form Validation Strategy**

**Explain:**
```
1. Schema definition (Yup) - Single source of truth
2. Client-side validation - Instant feedback
3. Server-side validation - Security layer
4. Error display - Inline + summary
5. Accessibility - ARIA labels, error announcements
```

**Benefits:**
- Better UX (instant feedback)
- Security (server validates too)
- Maintainability (schema in one place)

---

#### **3. State Management Architecture**

**Explain:**
```
Server State (React Query)
├─ Dealers, Vehicles, Users
├─ Automatic caching
└─ Background refetching

Global State (Zustand)
├─ Authentication (user, token, roles)
├─ Theme preferences
└─ App settings

Local State (useState)
├─ Modal open/close
├─ Form inputs
└─ UI toggles
```

**Benefits:**
- Clear separation of concerns
- Right tool for the job
- Easier to debug

---

#### **4. Performance Optimization Strategy**

**Explain:**
```
1. Code splitting - Lazy load routes
2. Memoization - React.memo, useMemo, useCallback
3. Virtual scrolling - Large lists
4. Image optimization - Lazy loading, WebP
5. Bundle analysis - Remove unused code
6. Caching - React Query, service workers
```

**Metrics:**
- Initial load: < 3 seconds
- Time to interactive: < 5 seconds
- Lighthouse score: > 90

---

### Pro Tips for Code Review

1. **Be confident** - You built this, you know it best
2. **Explain "why"** - Not just "what" but "why this approach"
3. **Show trade-offs** - "I chose X over Y because..."
4. **Admit unknowns** - "I haven't implemented that yet, but I would use X"
5. **Mention future improvements** - Shows forward thinking
6. **Use metrics** - "This reduced API calls by 50%"
7. **Reference best practices** - "Following React docs recommendations"
8. **Show problem-solving** - "I faced X issue, solved it with Y"

---

### Red Flags to Avoid

❌ **Don't say:**
- "I don't know why it works"
- "I copied this from Stack Overflow"
- "I didn't have time to test"
- "It works on my machine"
- "I'll fix it later"

✅ **Do say:**
- "I chose this approach because..."
- "I researched X and found Y is better"
- "I tested this with..."
- "This follows React best practices"
- "I plan to improve this by..."

---

### Final Checklist

Before code review, verify:

- [ ] All features working (test each page)
- [ ] No console errors
- [ ] Responsive design (test mobile, tablet, desktop)
- [ ] Form validation working
- [ ] Error handling working (test API failures)
- [ ] Loading states showing
- [ ] Authentication working (login, logout, token refresh)
- [ ] Role-based access working
- [ ] Search and pagination working
- [ ] Code formatted (Prettier)
- [ ] No unused imports
- [ ] Comments on complex logic

---

## 🎓 Learning Resources

### Official Documentation
- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Material-UI](https://mui.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)

### Best Practices
- [React Patterns](https://reactpatterns.com/)
- [JavaScript Clean Code](https://github.com/ryanmcdermott/clean-code-javascript)
- [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)

---

## 📞 Support

For questions or issues:
- **Email:** support@hyundai-autoever.com
- **Documentation:** Internal wiki
- **Code Review:** Schedule with team lead

---

**Good luck with your frontend code review!** 🚀

Remember: You built this application from scratch. You understand the architecture, the design decisions, and the trade-offs. Be confident, explain your reasoning, and show your problem-solving skills. You've got this! 💪
