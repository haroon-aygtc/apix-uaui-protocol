
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

---

## 🔁 Real-Time & API Integration

- **APIX Channels**: `widget.${widgetId}.*` for real-time sync of widget state, session, and interactions.
- **Session Sharing**: Widget sessions sync with parent apps through APIX.
- **REST APIs** (via Axios): CRUD for widget configs, start sessions, report analytics.

---

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

