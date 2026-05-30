# Repository Structure Guidelines

This document defines where files must be placed in this TanStack Start project.

AI agents and developers must follow these rules when creating, moving, or modifying files.

## Root Structure

```txt
src/
├── routes/
├── features/
├── components/
├── hooks/
├── lib/
├── constants/
├── types/
├── server/
├── router.tsx
├── routeTree.gen.ts
├── start.ts
└── global.css
```

Do not create new top-level folders unless the project owner explicitly requests it.

---

## `src/routes/`

Use `src/routes/` only for TanStack Start file-based routes.

Route files may contain:

- route definitions
- layouts
- loaders
- search param validation
- error boundaries
- pending components
- calls to feature-level functions or queries
- page-level rendering

Route files must stay thin. Do not place business logic, database queries, or large reusable components here.

Recommended structure:

```txt
src/routes/
├── __root.tsx
├── index.tsx
├── _auth/
│   ├── route.tsx
│   ├── login.tsx
│   └── register.tsx
├── _app/
│   ├── route.tsx
│   ├── dashboard.tsx
│   ├── settings.tsx
│   └── users/
│       ├── index.tsx
│       └── $userId.tsx
├── api/
│   └── health.ts
└── $.tsx
```

Route group meaning:

```txt
_auth/  -> public/auth layout
_app/   -> authenticated app layout
api/    -> API routes
$.tsx   -> catch-all/not-found route
```

Correct route pattern:

```ts
export const Route = createFileRoute("/_app/users/$userId")({
  loader: ({ params }) =>
    getUserById({
      data: { id: params.userId },
    }),
  component: UserDetailPage,
});
```

Routes should call into `src/features/*`, not directly into `src/server/*`.

---

## `src/features/`

Use `src/features/` for domain-specific and business-specific code.

Each feature must have its own folder:

```txt
src/features/auth/
src/features/users/
src/features/billing/
src/features/orders/
```

Recommended feature structure:

```txt
src/features/users/
├── users.schema.ts
├── users.functions.ts
├── users.server.ts
├── users.queries.ts
├── users.mutations.ts
├── users.constants.ts
├── users.types.ts
├── users.utils.ts
├── components/
└── hooks/
```

Only create files that are actually needed.

File responsibilities:

```txt
*.schema.ts      -> Zod schemas, validation, input/output types
*.functions.ts   -> TanStack Start server functions
*.server.ts      -> server-only implementation and DB/service logic
*.queries.ts     -> TanStack Query query options
*.mutations.ts   -> mutation hooks/options
*.constants.ts   -> feature-local constants
*.types.ts       -> feature-local types not derived from schemas
*.utils.ts       -> feature-local pure utilities
components/      -> components used only by this feature
hooks/           -> hooks used only by this feature
```

Feature-specific components, hooks, constants, types, and utilities must stay inside the feature folder.

---

## `src/server/`

Use `src/server/` for shared server-side infrastructure.

Recommended structure:

```txt
src/server/
├── db/
│   ├── index.ts
│   └── schema/
├── auth/
├── env.ts
└── middleware/
```

Use this folder for:

- database client
- database schema
- auth configuration
- environment validation
- middleware
- shared server-only helpers

Do not import `src/server/*` directly into client components, client hooks, or shared UI.

Feature-level server logic should live in:

```txt
src/features/<feature>/<feature>.server.ts
```

---

## `src/components/`

Use `src/components/` only for reusable UI components shared across multiple features.

Recommended structure:

```txt
src/components/
├── ui/
├── layout/
└── shared/
```

Folder meaning:

```txt
ui/       -> primitive UI components: button, input, dialog, select
layout/   -> layout components: header, sidebar, app shell
shared/   -> reusable app components: empty state, confirm dialog, data table
```

Do not place feature-specific components here.

Wrong:

```txt
src/components/user-card.tsx
```

Correct:

```txt
src/features/users/components/user-card.tsx
```

Move a component to `src/components/` only when it is reused by multiple features.

---

## `src/hooks/`

Use `src/hooks/` only for reusable hooks shared across the app.

Examples:

```txt
src/hooks/use-media-query.ts
src/hooks/use-debounce.ts
src/hooks/use-is-mounted.ts
```

Feature-specific hooks must stay inside the feature:

```txt
src/features/users/hooks/use-user-filters.ts
```

---

## `src/lib/`

Use `src/lib/` for shared utilities that are not tied to a specific feature.

Examples:

```txt
src/lib/cn.ts
src/lib/date.ts
src/lib/format.ts
src/lib/url.ts
```

Do not place business logic in `src/lib/`.

Feature-specific utilities must stay inside the feature:

```txt
src/features/billing/billing.utils.ts
```

---

## `src/constants/`

Use `src/constants/` only for app-wide constants.

Examples:

```txt
src/constants/app.ts
src/constants/routes.ts
src/constants/navigation.ts
```

Feature-specific constants must stay inside the feature:

```txt
src/features/users/users.constants.ts
```

---

## `src/types/`

Use `src/types/` only for app-wide shared types.

Examples:

```txt
src/types/common.ts
src/types/navigation.ts
```

Feature-specific types must stay inside the feature:

```txt
src/features/users/users.types.ts
```

Prefer schema-derived types from `*.schema.ts` when possible.

---

## Naming Rules

Use `kebab-case` for file names:

```txt
user-card.tsx
user-form.tsx
use-user-filters.ts
app-sidebar.tsx
confirm-dialog.tsx
```

Use plural names for resource features:

```txt
users/
orders/
products/
invoices/
```

Use singular names for singleton features:

```txt
auth/
billing/
settings/
```

Feature files must follow this pattern:

```txt
users.schema.ts
users.functions.ts
users.server.ts
users.queries.ts
users.mutations.ts
users.constants.ts
users.types.ts
users.utils.ts
```

Avoid vague file names:

```txt
service.ts
api.ts
helper.ts
data.ts
actions.ts
```

---

## Import Rules

Use the `@` alias for cross-folder imports.

Correct:

```ts
import { Button } from "@/components/ui/button";
import { getUserById } from "@/features/users/users.functions";
import { db } from "@/server/db";
```

Avoid deep relative imports:

```ts
import { Button } from "../../../../components/ui/button";
```

Relative imports are acceptable inside the same feature folder:

```ts
import { userIdSchema } from "./users.schema";
import { findUserById } from "./users.server";
```

---

## Data Flow

Preferred data flow:

```txt
route loader / component
  -> feature query/function
    -> server function
      -> feature server implementation
        -> src/server/*
```

Example:

```txt
src/routes/_app/users/$userId.tsx
  -> src/features/users/users.functions.ts
    -> src/features/users/users.server.ts
      -> src/server/db
```

Do not bypass feature boundaries.

---

## File Placement Guide

```txt
Route file                  -> src/routes/
Business/domain logic        -> src/features/<feature>/
Server function              -> src/features/<feature>/<feature>.functions.ts
Server-only implementation   -> src/features/<feature>/<feature>.server.ts
Schema/validation            -> src/features/<feature>/<feature>.schema.ts
Feature-only component       -> src/features/<feature>/components/
Feature-only hook            -> src/features/<feature>/hooks/
Shared UI component          -> src/components/
Shared hook                  -> src/hooks/
Shared utility               -> src/lib/
App-wide constants           -> src/constants/
App-wide types               -> src/types/
Database/auth/env/middleware -> src/server/
```

---

## Final Checklist

Before finishing any task, verify:

- New files are placed in the correct folder.
- Route files stay thin.
- Feature-specific code stays inside its feature.
- Shared folders only contain truly shared code.
- Server-only code stays in `src/server/` or `*.server.ts`.
- Database logic does not appear in route files or UI components.
- Naming follows the project conventions.
- No unnecessary folder was created.
- The standard data flow is preserved.

## Golden Rule

When unsure, keep code closest to the feature that owns it. Move code to shared folders only after real reuse exists.
