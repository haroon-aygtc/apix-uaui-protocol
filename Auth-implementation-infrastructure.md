
# 🔐 Authentication & Multi-Tenancy Architecture

A robust and scalable system enabling secure authentication, organization-level isolation, and role-based access control across the SynapseAI platform.

---

## ⚙️ Core Backend Services

| Service          | Responsibility                                            |
| ---------------- | --------------------------------------------------------- |
| `AuthService`    | JWT token generation & validation                         |
| `TenantService`  | Organization isolation and metadata management            |
| `RBACService`    | Role hierarchy, permission enforcement                    |
| `SessionManager` | Redis-backed session creation, sharing, and expiry        |
| `SSOAdapter`     | Pluggable SAML/OAuth integration layer for enterprise SSO |

---

## 🧬 Prisma Models

### `Organization`

```prisma
model Organization {
  id             String   @id @default(cuid())
  name           String
  slug           String   @unique
  settings       Json
  customDomain   String?
  branding       Json
  features       String[]
  quotas         Json
  subscription   SubscriptionTier
  isActive       Boolean  @default(true)
  users          User[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

### `User`

```prisma
model User {
  id              String   @id @default(cuid())
  organizationId  String
  email           String   @unique
  passwordHash    String?
  profile         Json
  roles           UserRole[]
  mfaEnabled      Boolean  @default(false)
  mfaSecret       String?
  lastLogin       DateTime?
  organization    Organization @relation(fields: [organizationId], references: [id])
  sessions        Session[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### `Role`, `UserRole`, `Session`

```prisma
model Role {
  id          String   @id @default(cuid())
  name        String
  level       RoleLevel
  permissions String[]
  isSystem    Boolean  @default(false)
  userRoles   UserRole[]
}

model UserRole {
  id         String   @id @default(cuid())
  userId     String
  roleId     String
  scope      Json?    // e.g., department, project
  user       User     @relation(fields: [userId], references: [id])
  role       Role     @relation(fields: [roleId], references: [id])
  assignedAt DateTime @default(now())
  @@unique([userId, roleId])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  refreshToken String   @unique
  deviceInfo   Json
  ipAddress    String
  expiresAt    DateTime
  user         User     @relation(fields: [userId], references: [id])
  createdAt    DateTime @default(now())
}
```

### Enums

```prisma
enum RoleLevel {
  SUPER_ADMIN
  ORG_ADMIN
  DEVELOPER
  VIEWER
}

enum SubscriptionTier {
  FREE
  STARTER
  PROFESSIONAL
  ENTERPRISE
}
```

---

## 📦 API Contracts (Zod Schemas)

```ts
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  organizationSlug: z.string().optional(),
  mfaCode: z.string().optional()
});

const OrganizationCreateSchema = z.object({
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  adminEmail: z.string().email(),
  settings: z.object({
    timezone: z.string(),
    language: z.string(),
    dateFormat: z.string()
  })
});

const PermissionCheckSchema = z.object({
  userId: z.string(),
  resource: z.string(),
  action: z.string(),
  scope: z.record(z.any()).optional()
});
```

---

## 🧑‍💻 Frontend Components

| Component              | Function                                     |
| ---------------------- | -------------------------------------------- |
| `LoginPage`            | Multi-step login with MFA                    |
| `OrganizationSwitcher` | UI for switching orgs for multi-tenant users |
| `UserProfile`          | Manage user information and password         |
| `TeamManagement`       | Manage users, assign roles                   |
| `AuditLog`             | View auth/security-related events            |

---

## ✅ Testing Requirements

| Type            | What to Test                                               |
| --------------- | ---------------------------------------------------------- |
| **Unit**        | JWT signing/verification, permission logic, session expiry |
| **Integration** | SSO (OAuth/SAML), org-based isolation flows                |
| **Security**    | SQL injection, RBAC bypass, CSRF                           |
| **E2E**         | Login → MFA → Org switch → Role-based access control flows |

---

## 🧭 UI Framework & Navigation (Weeks 3-4)

### Layout System

* `MainLayout`: Sidebar + TopBar
* `NavigationSidebar`: Icons with module-based navigation
* `TopBar`: Search, notifications, user settings
* `TabNavigation`: Section tabs within pages
* `BreadcrumbBar`: Path hierarchy indicator

---

### 🧱 Component Library (TypeScript + Tailwind)

```ts
// Examples
<Button variant="primary" />
<Input error="Invalid Email" />
<Select searchable />
<Modal isOpen={true} />
<Table sortable paginated />
<Tabs defaultValue="general" />
<Form schema={ZodSchema} />
```

---

### 🎨 Design System

```ts
const theme = {
  colors: {
    primary: { /* 50–900 */ },
    neutral: { /* 50–900 */ },
    success: {},
    warning: {},
    danger: {}
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  glassmorphism: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }
};
```

---

### 🧠 State Management

| Scope          | Tool                                                  |
| -------------- | ----------------------------------------------------- |
| Global State   | [`Zustand`](https://github.com/pmndrs/zustand)        |
| Server State   | [`@tanstack/react-query`](https://tanstack.com/query) |
| Form State     | `React Hook Form` + `Zod`                             |
| UI Local State | Component-local `useState` / `useReducer`             |

