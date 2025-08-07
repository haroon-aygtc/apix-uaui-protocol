---
type: "always_apply"
---

# ✅ Augment AI Extension – Strict Development Rules (Single-Repo)

This document defines the non-negotiable development rules for building the Augment AI Extension, based strictly on the `project-structure-implementation-plan.md`. This is a real production system, not a prototype or experiment.

---

## 🔒 1. Strict Adherence to `project-structure-implementation-plan.md`
- Only implement what is explicitly listed in the plan.
- No additional tasks, assumptions, or feature creep.
- Complete each task 100% before moving on to the next.

---

## 📌 2. Follow Task List – No Skipping, No Jumping
- Tasks must be executed in sequence as defined.
- Each task must include UI, logic, API integration, validation, and error handling.
- Do not leave partial implementations or TODOs.
- Maintain visible awareness of current task scope during work.

---

## 🧱 3. Single-Repo, Layered Architecture Discipline
Organize your project with the following directory separation:

- `components/` – Pure UI components (reusable)
- `services/` – Centralized API logic
- `stores/` – State management logic
- `utils/` – Shared helper functions
- `pages/` or `routes/` – Application views (based on your framework)

**Never mix concerns.** UI, business logic, and data access must remain separated.

---

## 🛠️ 4. Production-Ready Code Only
- No mocks, stubs, placeholders, or fake data.
- All API logic must be real, typed, and validated.
- Include error handling, retry strategies, and fallback logic.
- Use runtime schema validation (e.g., Zod).

---

## 📦 5. Component Rules
- Must be reusable, clearly named, and scoped properly.
- Keep components atomic – avoid overloading them with logic.
- API calls and business logic must stay in hooks or service layers.

---

## 🔁 6. Backend-Frontend Sync
- Match the backend module/service structure.
- Reuse DTOs, naming conventions, and validation formats.
- All frontend services must reflect actual backend functionality.

---

## 🧠 7. Maintain Project Context
Keep in mind the global goals at all times:
- AI extensibility and modularity
- Real-time behavior (APIX / UAUI)
- Smart provider logic
- Clear separation of admin/user functionality
- Enterprise-grade architecture and reliability

---

## 🧪 8. No Placeholder or Shortcut Development
- Every function, service, or component must be implemented for real use.
- No experimental or temporary blocks.
- Everything must be ready for production deployment.

---

## 📝 9. Documentation Standards
- All public functions, hooks, and services must include inline JSDoc comments.
- Large modules must have a local `README.md` or `overview.md` explaining logic and flow.

---

## ✅ 10. Task Completion Protocol
At the end of every task/module:
- Conduct a self-review against this ruleset.
- Test manually and/or automatically.
- Validate backend sync.
- Only then may you proceed to the next task.

---