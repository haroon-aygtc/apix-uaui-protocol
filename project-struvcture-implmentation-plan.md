### Backend
Layer	Technology	Purpose
Framework	NestJS (with Fastify adapter)	Modular, scalable backend architecture
Real-Time Engine	uWebSockets.js (via NestJS Gateway) + SSE Fallback	High-performance WebSocket server for APIX
Validation	Zod	Type-safe schema validation (runtime + compile-time)
Authentication	JWT (RS256) + Passport.js	Auth with multi-tenant claims and SSO support
RBAC	Custom middleware + Policy Guards	Role and feature-level access enforcement
Session Store	Redis (clustered) + Consumer group	Central session & memory context storage
Queues	BullMQ (Redis-based)	+ Consumer group Job queues for async tasks (e.g., notifications, analytics)
Database	PostgreSQL 15+	Strong relational schema with multi-tenant isolation
ORM	Prisma	Type-safe database access with advanced filtering
File Storage	S3-compatible (e.g., MinIO, AWS S3)	Asset and document storage
Notifications	Custom Service (email, SMS, webhooks, push)	Event-driven notification system

### Frontend
Layer	Technology	Purpose
Framework	Next.js 14 (App Router)	SSR, dynamic routing, edge-ready performance
UI Kit	Tailwind CSS + Shadcn/UI	Fully themeable and componentized design system
State Management	Zustand or Jotai	Lightweight global state across tabs/components
Real-Time Sync	WebSocket (Socket.IO or native) + SWR/React Query	Real-time updates, syncing across clients
Animations	Framer Motion	UI animations and transition effects
Charts & Dashboards	Recharts / React-Vis	Analytics visualization
Form Handling	React Hook Form + Zod	Validated dynamic form builder for settings, widgets
Multi-Language	i18next	Internationalization support
Testing	Playwright + Jest + Testing Library	Full E2E and unit testing coverage

monorepo:
  structure:
    - apps/
      - backend/        # NestJS application
      - frontend/       # Next.js 14 App Router
    - packages/
      - ui/             # Shadcn + Tailwind UI library
      - shared/         # Zod schemas, DTOs, constants
      - config/         # Environment config, i18n
      - services/       # API clients, analytics, notifications, etc.

---

backend:
  name: synapse-backend
  tech:
    framework: NestJS
    adapter: Fastify
    real_time:
      engine: uWebSockets.js
      fallback: SSE
    validation: Zod
    authentication:
      method: JWT (RS256)
      library: Passport.js
      claims: Multi-tenant aware
    authorization:
      rbac: Custom middleware
      guards: Policy-based
    session:
      store: Redis (Clustered)
      context: Memory injection + state
    queues:
      system: BullMQ
      transport: Redis Streams + Consumer Groups
    database:
      engine: PostgreSQL 15+
      schema: Multi-tenant separated
      orm: Prisma
    file_storage:
      type: S3-compatible (MinIO, AWS S3)
    notifications:
      system: Event-driven
      channels:
        - email
        - sms
        - webhooks
        - push
    event_bus:
      transport: Redis Streams
      pattern: APIX Protocol (real-time + async)
      features:
        - event replay
        - distributed consumer groups

frontend:
  name: synapse-frontend
  tech:
    framework: Next.js 14
    routing: App Router
    styling:
      system: Tailwind CSS
      kit: Shadcn UI
    state:
      global: Zustand or Jotai
      sync: Multi-tab session context
    real_time:
      protocol: WebSocket
      sync: SWR / React Query
    animation: Framer Motion
    charts: Recharts / React-Vis
    forms:
      builder: React Hook Form
      validation: Zod
    i18n: i18next
    testing:
      e2e: Playwright
      unit: Jest + Testing Library

shared:
  packages:
    - zod-schemas
    - api-types
    - auth-context
    - utils
    - multi-tenant-aware
    - event-definitions

deployment:
  orchestrator: Docker Compose / Kubernetes (Helm Charts optional)
  env: .env + ConfigService
  CI/CD: GitHub Actions + Turborepo cache + Nx Cloud

---

tools:
  monorepo: TurboRepo or Nx
  build_cache: Remote build cache enabled
  versioning: Conventional commits + Semantic release
  package_manager: pnpm
  linting: ESLint + Prettier + Stylelint
  formatting: Prettier (all)
  hooks: Husky + Lint-Staged
  logging: Pino + Grafana + Loki
  monitoring: Prometheus + 



### API & Protocol
Layer	Technology	Purpose
API Protocol	REST + WebSocket + SSE	Unified, real-time-first API layer
Versioning	/api/v1/*	Modular, backward-compatible endpoint structure
Documentation	OpenAPI (Swagger)	Developer-accessible, autogen API docs
SDKs	Custom-built SDKs (JS, Python, etc.)	Integration-ready access for external systems

### DevOps & Infrastructure
Layer	Technology	Purpose
Containerization	Docker + Docker Compose	Environment reproducibility
Orchestration	Kubernetes (optional)	Multi-node deployment and scaling
Monitoring	Prometheus + Grafana	Metrics, health checks, and system alerts
Logging	Loki + Sentry	Error tracking and log analysis
CI/CD	GitHub Actions / GitLab CI	Auto-deploys, testing pipelines
CDN	Cloudflare / Vercel Edge / AWS CloudFront	Low-latency static asset delivery
Backup & Recovery	pgBackRest + S3	Daily encrypted backups with versioning

### AI, RAG, and Tool Integration
Layer	Technology	Purpose
AI Providers	OpenAI, Claude (Anthropic), Gemini, Mistral, DeepSeek, Hugging Face, OpenRouter	Multi-provider routing and fallback logic
RAG	Custom implementation + Weaviate / Qdrant / PostgreSQL pgvector	Semantic search + document embedding
Streaming	Native WebSocket Streaming + Token Chunking	Real-time AI responses and tool output
Tooling Layer	Pluggable Function Call Infrastructure	Tool execution and orchestration across sessions

### Security & Compliance
OAuth2, SAML, SSO integrations
Rate limiting via Fastify plugins
CSRF/XSS/SQLi protections by default
Multi-org audit logging
GDPR/CCPA-ready data controls
Feature flag support per organization


## 🚀 Core Infrastructure Requirements

### 🔌 APIX Real-Time Engine

A unified real-time event system powering all platform interactions:

* **Single WebSocket Gateway** handling **all platform events**
* **Event Streams** for:
  `agents`, `tools`, `hybrids`, `sessions`, `HITL`, `knowledge`, `widgets`, `analytics`, `billing`, `notifications`
* **Real-time State Sync** across modules and clients
* **Event Persistence & Replay** for fault tolerance and reliability
* **Cross-Module Routing** via a centralized pub/sub architecture
* Built for **multi-tenant scalability**

---

### 🏢 Multi-Tenant Architecture

True multi-tenant isolation and customization:

* **Organization-Scoped Isolation** across all modules
* **Tenant-Aware Queries** with automatic data filtering
* **Quota Enforcement & Billing** in real time
* **Security Boundaries** across tenants (strict access controls)
* **Tenant-Specific Customization**: branding, themes, preferences

---

### 🔐 Authentication & RBAC System

Secure, flexible access control for all user roles and APIs:

* **JWT-based Auth** with organization-scoped claims
* **Role Hierarchy**:

  * `SUPER_ADMIN`
  * `ORG_ADMIN`
  * `DEVELOPER`
  * `VIEWER`
* **Feature-Level Permissions** across all 17 modules
* **API Key Management** for external integrations
* **SSO-Ready Framework** (OAuth, SAML, etc.)

---

### 🧠 Session & Memory Management

Persistent, intelligent session state across all modules:

* **Unified Redis-based + Consumer group Session Store**
* **Cross-Module Session Sharing & Memory Context**
* **Memory Limits with Smart Truncation**
* **Session Analytics**: memory size, usage patterns, performance
* **Live Synchronization** of session data between tabs/devices

---

### 🔔 Notification Infrastructure

Flexible, reliable, and customizable notification system:

* **Multi-Channel Delivery**: email, SMS, webhooks, push
* **Event-Driven Triggers** from all modules
* **Customizable Templates & Logic**
* **Delivery Logs, Retry Handling & Failure Tracking**
* **Per-User & Per-Organization Notification Preferences**

---

### 📊 Universal Analytics System

Platform-wide event intelligence and metrics collection:

* **Tracking** of all user interactions and system events
* **Real-Time Dashboards** for metrics and analytics
* **Usage Patterns**, error tracking, performance insights
* **Predictive Analytics** and BI pipeline support
* **Custom Reporting & Data Export** options

---

### 🧩 Complete Relational Schema (PostgreSQL)

Entities and relationships (with proper constraints and indexing):

* `Organizations`, `Users`, `Roles`, `Sessions`,
  `Agents`, `Tools`, `Hybrids`, `Providers`, `Documents`,
  `Widgets`, `HITLRequests`, `Templates`, `Analytics`,
  `Notifications`, `Billing`, `Quotas`, `Sandboxes`

---

### 🔗 Unified API Structure

RESTful, namespaced, and versioned:

```
/api/v1/auth/*        → Authentication & RBAC
/api/v1/agents/*      → Agent lifecycle & execution
/api/v1/tools/*       → Tool creation & orchestration
/api/v1/hybrids/*     → Hybrid workflows (Tool-Agent fusion)
/api/v1/sessions/*    → Memory & session context
/api/v1/hitl/*        → Human-in-the-loop actions
/api/v1/knowledge/*   → Document storage & RAG
/api/v1/widgets/*     → Widget creation & embedding
/api/v1/analytics/*   → Usage metrics & reporting
/api/v1/admin/*       → Org & user management
/api/v1/billing/*     → Billing, quotas, enforcement
/api/v1/sdk/*         → Public SDK endpoints & integration
```

---

### 🛠️ Production Infrastructure Stack

Highly available, scalable backend services:

* **PostgreSQL** with strict indexing, partitioning, and tuning
* **Redis Clustering + Consumer group** for sessions, queues, and pub/sub
* **Message Queues** for background processing (e.g., BullMQ, RabbitMQ)
* **Object Storage** for assets and documents
* **Global CDN** for static content delivery
* **Monitoring & Alerts** (Prometheus, Grafana, Sentry)
* **Backups & Disaster Recovery** automation

---

### 🚫 Strict Production Requirements

> No simulation. No mockups. No shortcuts.

* **Real multi-tenancy**, enforced at database, session, and API layers
* **Real-time-first** via APIX WebSocket + SSE fallback
* **Production-grade Auth**, RBAC, and session handling
* **Fully integrated Billing** and live usage enforcement
* **Complete Audit Logging** across all modules
* **Compliance-Ready**: activity trails, quotas, consent logging

---

### ⚡ APIX Protocol & Real-Time Infrastructure
🧠 Overview
The APIX Real-Time Infrastructure is a secure, multi-tenant, event-driven communication backbone that powers real-time interactions across all modules (agents, tools, workflows, etc.). It provides dynamic channel-based messaging, robust connection handling, and intelligent routing using a Redis-backed + Consumer group architecture.

🔌 Core Backend Components
Component	Description
ApiXGateway	Primary WebSocket gateway managing connection lifecycle, auth, heartbeat, and message routing.
EventRouter	Central real-time event bus for dispatching messages to subscribed clients/modules.
SubscriptionManager	Manages channel-based subscriptions/unsubscriptions with per-client permission enforcement.
MessageQueueManager	Redis-backed + Consumer group message queue for durable, retryable, offline message delivery.
ConnectionManager	Tracks connection states, handles reconnections, manages heartbeat (ping/pong) logic.
RetryManager	Implements exponential backoff strategy for guaranteed message delivery in failure scenarios.
LatencyTracker	Monitors latency per client/channel to optimize routing and enable QoS.
AuditLogger	Records all connection and event activities for auditing, compliance, and debugging.

🧬 Database Schema (Prisma Models)
prisma
model ApiXConnection {
  id             String         @id @default(cuid())
  organizationId String
  userId         String?
  sessionId      String         @unique
  clientType     ClientType
  channels       String[]
  metadata       Json
  connectedAt    DateTime       @default(now())
  lastHeartbeat  DateTime
  status         ConnectionStatus
}

model ApiXEvent {
  id             String         @id @default(cuid())
  eventType      String
  channel        String
  payload        Json
  sessionId      String?
  acknowledgment Boolean        @default(false)
  retryCount     Int            @default(0)
  createdAt      DateTime       @default(now())
  metadata       Json?
}

model ApiXChannel {
  id             String         @id @default(cuid())
  name           String         @unique
  type           ChannelType
  organizationId String?
  permissions    Json
  subscribers    Int            @default(0)
  createdAt      DateTime       @default(now())
}


🔁 Enums
enum ClientType {
  WEB_APP
  MOBILE_APP
  SDK_WIDGET
  API_CLIENT
  INTERNAL_SERVICE
}

enum ConnectionStatus {
  CONNECTED
  DISCONNECTED
  RECONNECTING
  SUSPENDED
}

enum ChannelType {
  AGENT_EVENTS
  TOOL_EVENTS
  WORKFLOW_EVENTS
  PROVIDER_EVENTS
  SYSTEM_EVENTS
  PRIVATE_USER
  ORGANIZATION
}

 Zod API Contracts
  const ApiXConnectionSchema = z.object({
  sessionId: z.string(),
  clientType: z.nativeEnum(ClientType),
  authentication: z.object({
    token: z.string(),
    organizationId: z.string().optional(),
  }),
  subscriptions: z.array(z.string()),
  metadata: z.record(z.any()).optional(),
});

const ApiXEventSchema = z.object({
  type: z.string(),
  channel: z.string(),
  payload: z.any(),
  metadata: z.object({
    timestamp: z.number(),
    version: z.string(),
    correlation_id: z.string().optional(),
  }).optional(),
});

const ApiXSubscriptionSchema = z.object({
  channels: z.array(z.string()),
  filters: z.record(z.any()).optional(),
  acknowledgment: z.boolean().default(false),
});

🔁 Supported Event Types
pgsql
connection.established
connection.error
connection.disconnected
subscription.added
subscription.removed
heartbeat.ping
heartbeat.pong
message.queued
message.sent
message.failed
reconnection.attempt
tool_call_start
tool_call_result
tool_call_error
agent_status_update
workflow_state_change
provider_health_update
system_notification

## 🌐 Core Features

- ✅ Bidirectional WebSocket with JWT-authenticated access
- ✅ Scoped Channel Subscriptions with permission enforcement
- ✅ Redis-backed + Consumer group Queuing System with offline durability
- ✅ Exponential Backoff Retry Logic
- ✅ Heartbeat (Ping/Pong) for dead connection detection
- ✅ Latency & Throughput Tracking for QoS-based routing
- ✅ Event Replay for late joiners or recovery
- ✅ Payload Compression to optimize bandwidth
- ✅ Room-Based Subscriptions for collaborative workflows
- ✅ Audit Logging for every connection and event
- ✅ Multi-Tenant Scoped Channels with RBAC per client

## 🔒 Security Features

- Authenticated WebSocket connections with JWT (per user + org)
- Channel-level permission enforcement via RBAC or API Keys
- Encrypted Payload Support (optional)
- CORS + CSP for cross-origin communication protection
- Rate limiting per connection and channel
- Full audit trail for forensic analysis and compliance

## 🧪 Testing Requirements

| Type | Coverage |
|------|----------|
| ✅ Unit Tests | Routing logic, lifecycle management, subscriptions |
| ✅ Integration Tests | Multi-client sync, Redis persistence + Consumer group, failover |
| ✅ Load Testing | 10,000+ concurrent connections, throughput benchmarks |
| ✅ E2E Testing | Reconnection, message replay, delayed delivery |
| ✅ Security Testing | Auth flow, token expiry, rate limits, permission denial |

## 📦 Deliverables

- ✅ Fully working WebSocket Gateway with secure connection lifecycle
- ✅ Scalable EventRouter with dynamic channel routing
- ✅ Redis Queue + Consumer group System with retry and persistence
- ✅ Latency Tracker with dashboard hooks
- ✅ Complete Prisma Schema for all APIX components
- ✅ Strict Zod Schema Contracts for validation and client SDKs
- ✅ End-to-End Test Suite covering reliability, scale, and failure modes
- ✅ Full documentation + frontend SDK examples

🧪 Testing Requirements
Type	Coverage
✅ Unit Tests	Routing logic, lifecycle management, subscriptions
✅ Integration Tests	Multi-client sync, Redis persistence + Consumer group, failover
✅ Load Testing	10,000+ concurrent connections, throughput benchmarks
✅ E2E Testing	Reconnection, message replay, delayed delivery
✅ Security Testing	Auth flow, token expiry, rate limits, permission denial

📦 Deliverables
✅ Fully working WebSocket Gateway with secure connection lifecycle

✅ Scalable EventRouter with dynamic channel routing

✅ Redis Queue System with retry and persistence + Consumer group

✅ Latency Tracker with dashboard hooks

✅ Complete Prisma Schema for all APIX components

✅ Strict Zod Schema Contracts for validation and client SDKs

✅ End-to-End Test Suite covering reliability, scale, and failure modes

✅ Full documentation + frontend SDK examples


# 🧩 UAUI Frontend SDK (Universal Agent UI)

The **UAUI Frontend SDK** is a React-based, embeddable UI toolkit designed to seamlessly integrate **SynapseAI’s multi-agent orchestration platform** into any web application. It supports rich UI components, real-time state sync, voice/text interaction, multi-language support, and intelligent DOM integration.

---

## 🧱 Core Components

| Component | Description |
|-----------|-------------|
| **SynapseWidget** | Main React wrapper supporting multiple widget types. |
| **FloatingAssistant** | Draggable chat widget for voice and text interactions in multiple languages. |
| **ChatPanel** | Inline chat interface optimized for mobile and desktop. |
| **WorkflowTrigger** | Button trigger for launching workflows and agent actions. |
| **AgentEmbed** | Embeddable agent interface for use within third-party apps. |
| **Visual Builder Components** | Drag-and-drop canvas for agents/tools/workflows (powered by React Flow). |
| **Auto-Generated Forms** | Zod-driven dynamic forms for input/output validation. |
| **Multi-language Support (i18n)** | Dynamic language switching and localization. |
| **Voice Input** | WebRTC-based voice-to-text input. |
| **Real-time DOM Highlighting** | Allows contextual DOM element selection and guidance. |

---

## 🧠 Supporting Backend Services

| Service | Responsibility |
|---------|----------------|
| **SDKConfigService** | Manages per-org widget config (theme, features, domains). |
| **WidgetAuthService** | Issues & validates JWTs for secure widget access. |
| **ThemeService** | Enables branding and theming per organization. |
| **WidgetAnalyticsService** | Tracks events, usage metrics, and interactions. |

---

## 🗃️ Prisma Models

```prisma
model WidgetConfig {
  id             String     @id @default(cuid())
  organizationId String
  name           String
  type           WidgetType
  settings       Json       // Theme, features, etc.
  isActive       Boolean    @default(true)
  domains        String[]   // Allowed embedding domains
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
}

model WidgetSession {
  id         String   @id @default(cuid())
  widgetId   String
  sessionId  String
  metadata   Json
  createdAt  DateTime @default(now())
}

enum WidgetType {
  FLOATING_ASSISTANT
  CHAT_PANEL
  WORKFLOW_TRIGGER
  AGENT_EMBED
}
```

---

## 📦 Zod API Contracts

```ts
const WidgetConfigSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(WidgetType),
  settings: z.object({
    theme: z.object({
      primaryColor: z.string(),
      position: z.enum(['bottom-right', 'bottom-left']),
      size: z.enum(['small', 'medium', 'large']),
    }),
    features: z.object({
      voiceInput: z.boolean(),
      fileUpload: z.boolean(),
      multiLanguage: z.boolean(),
    }),
  }),
  domains: z.array(z.string().url()),
});

```

## ✨ UX Capabilities

- 🎛️ **Visual Workflow Builder**: Drag-and-drop interface with live orchestration
- 🧾 **Schema-driven Forms**: Auto-generated from Zod schemas
- 🌍 **Dynamic Language Switching**: Localized UI for global users
- 🎙 **Voice Input**: WebRTC + speech-to-text integration
- 🖱 **Context-Aware DOM Highlighting**: Interact with the host page in real time

---

## 🔐 Security & RBAC

- Domain allowlist validation to restrict embedding
- Widget-scoped JWT and API key authentication
- CSP (Content Security Policy) enforcement
- Rate limiting per widget & domain

---

## 🧪 Testing Requirements

| Type | Coverage |
|------|----------|
| ✅ Unit Tests | UI rendering, input validation, event handling |
| ✅ Integration Tests | APIX sync, auth/session flow |
| ✅ E2E Tests | Widget embedding, voice, i18n switching |
| ✅ Security Tests | Token, CSP, API rate limiting, domain checks |

---

## ✅ Deliverables

- 🧩 Production-ready React SDK (UAUI)
- 🔐 Secure widget authentication and configuration flow
- 🧠 Voice, i18n, DOM highlight, and workflow builder support
- 📊 Widget analytics with backend reporting hooks
- 📘 Complete docs + embedding examples for clients
----


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
| `AuthPages`            | 2 column design Auth pages with MFA          |
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
| **Load**        | Concurrent login, session creation, role assignment        |
  

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


---

## 🔁 Real-Time & API Integration

- **APIX Channels**: `widget.${widgetId}.*` for real-time sync of widget state, session, and interactions.
- **Session Sharing**: Widget sessions sync with parent apps through APIX.
- **REST APIs** (via Axios): CRUD for widget configs, start sessions, report analytics.

---

🧠 AI Provider Module Manage LLM providers with smart routing, health monitoring, and fallback logic.
smart routing,Cost optimization,optimization, multi-provider support, multi-provider support,  Cost optimization ,Role-based Access,health metrics,capability tagging,quota management,model performance,smart routing,embedding,API key management,Provider dashboard 

**Supported Providers**

* OpenAI
* Claude (Anthropic)
* Gemini (Google)
* DeepSeek
* Grok (xAI)
* Groq
* OpenRouter
* Custom (via API)

**Features**

* Smart Routing: Latency-based provider selection
* Fallback Chain: Configurable failover path
* Health Monitoring: Real-time uptime/latency checks
* Tenant-Aware Quotas: Usage tracking per org
* RBAC on Config: Admin-only access to API keys
* APIX Streaming: Integration with token streams
* Live Status Dashboard: Real-time health view

**Zod Schema**

```ts
const AIProviderSchema = z.object({
  id: z.string(),
  name: z.enum([
    "openai", "claude", "gemini", "deepseek",
    "grok", "groq", "openrouter", "custom"
  ]),
  config: z.object({
    apiKey: z.string().min(1),
    baseURL: z.string().url().optional(),
    headers: z.record(z.string()).optional(),
    model: z.string().optional(),
    timeout: z.number().positive().optional(),
  }),
  isEnabled: z.boolean().default(true),
  isPrimary: z.boolean().default(false),
  region: z.string().optional(),
  latencyScore: z.number().optional(),
  fallbackChain: z.array(z.string()).optional(),
  tenantId: z.string(),
});
```

**Prisma Model**

```prisma
model AIProvider {
  id            String   @id @default(cuid())
  name          String
  config        Json
  isEnabled     Boolean  @default(true)
  isPrimary     Boolean  @default(false)
  region        String?
  latencyScore  Float?
  fallbackChain String[]
  tenantId      String
  tenant        Organization @relation(fields: [tenantId], references: [id])
  createdBy     String
  updatedBy     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**UI**

* List View: Grid/List toggle with status, latency, region
* Tabs: Overview, Config, Advanced, Fallback, Logs, Audit
* APIX side panel for real-time monitoring


---

🤖 Agent Module Intelligent, memory-aware agents with dynamic capabilities.

**Features**

* LLM-powered reasoning
* Redis-backed memory
* Tool binding
* Multi/Single LLM support
* Agent-to-agent communication
* Runtime skill binding
* Persistent session memory
* Template market for blueprints
* Real-time execution tracking via APIX

**Zod Schema**

```ts
const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  provider: z.string(),
  tools: z.array(z.string()),
  memoryEnabled: z.boolean().default(true),
  multiProvider: z.boolean().default(false),
  config: z.object({
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().positive().default(1024),
    systemPrompt: z.string().optional(),
  }),
  tenantId: z.string(),
});
```

**Prisma Model**

```prisma
model Agent {
  id            String   @id @default(cuid())
  name          String
  description   String?
  providerId    String
  provider      AIProvider @relation(fields: [providerId], references: [id])
  tools         Tool[]     @relation(references: [id])
  memoryEnabled Boolean    @default(true)
  multiProvider Boolean    @default(false)
  config        Json
  tenantId      String
  tenant        Organization @relation(fields: [tenantId], references: [id])
  createdBy     String
  updatedBy     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**UI**

* Grid/List toggle
* Visual type cards
* Multi-step wizard: Type, Config, Tools, Advanced
* Detail tabs: Overview, Config, Tools, Memory, Logs, Audit

---

🛠 Tool Module Extensible, external integration and automation tools.

**Types**

* Function-caller
* RAG tools
* API fetchers
* Browser automation
* DB runners
* Custom logic (TS/Python)

**Features**

* Cross-execution workflows
* State persistence
* Real-time tool switching
* Analytics
* Auto schemas
* HITL support
* Parallel execution

**Zod Schema**

```ts
const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["function", "rag", "api", "browser", "db", "custom"]),
  agentId: z.string().optional(),
  config: z.record(z.any()),
  inputSchema: z.record(z.any()).optional(),
  outputSchema: z.record(z.any()).optional(),
  tenantId: z.string(),
});
```

**Prisma Model**

```prisma
model Tool {
  id           String   @id @default(cuid())
  name         String
  type         String
  agentId      String?
  agent        Agent?   @relation(fields: [agentId], references: [id])
  config       Json
  inputSchema  Json?
  outputSchema Json?
  tenantId     String
  tenant       Organization @relation(fields: [tenantId], references: [id])
  createdBy    String
  updatedBy    String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**UI**

* Grid/List toggle
* Tabs: Overview, Config, Logs, Bindings, Test, Editor

---

🔀 Workflow Editor (React Flow) Orchestrate workflows visually.

**Features**

* React Flow canvas
* Drag-and-drop nodes
* Subflows, auto-layout
* Zoom, snapping, guides
* Manual or webhook trigger
* Execution timeline
* Node config modal
* Version history

---

📚 Knowledge Base (RAG) Enterprise Retrieval-Augmented Generation.

**Features**

* Upload PDFs, DOCX, etc.
* Semantic chunking
* Vector DB support (Pinecone, Weaviate, Chroma)
* Agent-indexed
* Role-based permissions

**Zod Schema & Prisma**: Includes document metadata, chunk content, and role access controls

**UI**

* Uploads, Chunks, Index, Permissions, Detail, Tester

---

🪩 Prompt Templates Versioned, reusable LLM prompt templates.

**Features**

* Variables with placeholders
* Role-based access
* Token preview
* Version rollback

---

👩‍💻 Human-in-the-Loop (HITL) Add human oversight to automated workflows.

**Features**

* Task queues
* Approvals, overrides
* Audit trails
* Bulk actions

**Zod Schema & Prisma**: Captures task metadata, priority, status, and assigned users

**UI**

* Queue list
* Task detail with logs
* Bulk approve/reject

---

🗺️ Unified Admin Panel Layout Consistent layout and state across modules.

**UI Framework**

* Sidebar + TopBar
* Tabs for details
* Breadcrumbs and content container

**State Management**

* Zustand (global)
* TanStack Query (server)
* React Hook Form + Zod (forms)
* useState/useReducer (local)

---
 ✅ **A public SDK, API, and embeddable script system**   
> So users can integrate your agents and tools into their own apps, websites, or workflows. 
--- 
 
# 🧩 SynapseAI: External Integration Layer (SDK + API + Embed) 
 
Add a **developer-facing layer** so customers can: 
- Embed AI agents on their site 
- Call tools via REST/GraphQL 
- Integrate with their backend via SDK 
- Receive real-time events via Webhooks or WebSocket 
 
This turns SynapseAI from an **internal tool** into a **platform**. 
 
--- 
 
## 1. 🔌 Public REST API 
 
Expose core functionality via secure, versioned, tenant-aware endpoints. 
 
### Endpoints 
| Method | Route | Description | 
|-------|-------|-------------| 
| POST | /v1/agents/:id/invoke | Run an agent with input | 
| POST | /v1/tools/:id/execute | Execute a tool | 
| GET  | /v1/agents | List public agents | 
| POST | /v1/workflows/:id/trigger | Trigger a workflow | 
| GET  | /v1/stream | SSE stream of events (APIX) | 
 
### Auth 
- **API Key** (per tenant or per project) 
- **JWT Bearer Token** (for user-specific contexts) 
- Enforced via tenantId and RBAC 
 
### Example Request 
bash 
curl -X POST https://api.synapseai.com/v1/agents/support-bot/invoke \ 
  -H "Authorization: Bearer sk_xxx" \ 
  -H "Content-Type: application/json" \ 
  -d '{"input": "My invoice is wrong"}'
 
 
✅ Use **NestJS Controllers** to build this — already part of your backend. 
 
--- 
 
## 2. 📦 SDK (JavaScript/TypeScript) 
 
Let developers integrate with SynapseAI in their apps. 
 
### Features 
- Invoke agents/tools 
- Subscribe to real-time events 
- Handle streaming responses 
- Manage sessions 
 
### Example Usage 
ts 
import { SynapseAI } from '@synapseai/sdk'; 
 
const client = new SynapseAI({ 
  apiKey: 'sk_xxx', 
  tenantId: 'org-123' 
}); 
 
// Run agent 
const response = await client.agent('support-bot').invoke({ 
  input: 'Why was I charged twice?' 
}); 
 
// Stream response (uses APIX under the hood) 
client.agent('support-bot').stream(input, (event) => { 
  if (event.type === 'agent_response') { 
    console.log(event.data.text); 
  } 
});
 
 
### Build With 
- **TypeScript** + **Zod** (for runtime validation) 
- Bundled for ESM/CJS 
- Published on **npm** 
 
> 💡 Use **Cursor** to generate SDK code from your NestJS API. 
 
--- 
 
## 3. 📥 Embed Script (for Websites) 
 
Let users add a **chat widget** or **AI assistant** to their site in one line. 
 
### One-Line Embed 
html 
<script src="https://embed.synapseai.com/v1"  
        data-agent="support-bot" 
        data-tenant="org-123" 
        async></script>
 
 
### Features 
- Loads a **floating chat widget** 
- Preserves session via Redis 
- Supports **APIX streaming** (real-time typing indicators) 
- Customizable UI (via CSS variables) 
 
### Advanced: Pass Context 
js 
window.SynapseAI?.setContext({ 
  user: { id: 'usr-123', email: 'john@company.com' }, 
  page: 'billing' 
});
 
 
> 💡 Use **V0.dev** to generate the widget UI, then wrap with real-time logic. 
 
--- 
 
## 4. 🌐 Webhooks & Event Subscriptions 
 
Let external systems react to SynapseAI events. 
 
### Events 
- agent.completed 
- tool.failed 
- human_in_loop.requested 
- workflow.started 
 
### Setup 
ts 
// User subscribes via API 
POST /v1/webhooks 
{ 
  "event": "agent.completed", 
  "url": "https://yourapp.com/ai-hook", 
  "secret": "sig_xxx" 
}
 
 
SynapseAI sends **signed payloads** on event. 
 
✅ Use **NestJS Microservices** or **Redis-to-HTTP bridge** to dispatch. 
 
--- 
 
## 5. 🧪 Developer Portal (Bonus) 
 
Create a **portal** where users can: 
- View API docs (Swagger/OpenAPI) 
- Generate API keys 
- Test endpoints (like Postman) 
- See usage analytics 
- Manage webhooks 
 
> Use **Next.js** to build this — already part of your stack. 
 
--- 
 
## ✅ Why This Matters 
 
| Without SDK/API | With SDK/API | 
|----------------|-------------| 
| Only internal use | External integrations | 
| Limited reach | Platform ecosystem | 
| Manual embedding | One-line script | 
| No automation | Webhooks + automation | 
| Hard to scale | Developer adoption | 
 
> Just like **TanStack Query** eliminates async spaghetti, your **SDK** eliminates integration friction. 
 
--- 
 
## 🔄 Integration with Existing Architecture 
 
| Layer | How It Fits | 
|------|-------------| 
| **APIX Protocol** | Powers real-time events in SDK and embed | 
| **RBAC + TenantId** | Enforced in API endpoints | 
| **Zod** | Validates incoming requests | 
| **Prisma** | Stores API keys, webhook subscriptions | 
| **uWebSockets.js** | Scales real-time streaming to thousands of clients | 
| **TanStack Query** | Used *inside* the SDK to auto-manage queries (e.g. list agents) | 
 
--- 
✅ *TanStack Query provides automatic caching, background updates, and fewer lines of async code.*
