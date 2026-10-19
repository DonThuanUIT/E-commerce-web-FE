# Frontend Architecture, State Management & Coding Standards

> **Canonical Document for AI Agents and Frontend Developers**  
> Repository: `E-commerce-web-FE`  
> Stack: React 19, TypeScript 6, Vite 8, Tailwind CSS v4, @tanstack/react-query v5, Zustand, React Router v7

---

## 1. Architectural Philosophy & Layering

The application follows a strictly layered, feature-driven architecture. Dependencies must flow in one direction only:

```text
App (Providers & Global Styles)
  └── Routes (URL-to-Page Mappings in src/routes/)
      └── Pages (Thin Composition Wrappers in src/pages/)
          └── Features (Domain Logic, UI Components, Services, Hooks, Types in src/features/)
              └── Shared & Config (Reusable Base UI, HTTP Client, Shared Types in src/shared/, src/config/)
```

### Core Architectural Invariants:

1. **Pages are Thin:** A `page.tsx` must only assemble and render feature entry points. It must never contain raw business logic, form validation, or large inline JSX trees.
2. **Encapsulated Features:** All feature-specific components, custom hooks, API services, and types live inside `src/features/<featureName>/`.
3. **Public Feature API:** Every feature exposes its public interface via `src/features/<featureName>/index.ts`. Pages and other allowed consumers must import through this entry.
4. **No Circular or Reverse Imports:** Features must **never** import from `src/pages` or `src/routes`. Shared code (`src/shared/`, `src/config/`) must never import from `src/features`.
5. **Intra-feature Imports:** Inside a feature folder, always use relative paths (e.g. `../services/staffService`).

---

## 2. Directory Layout & File Naming Conventions

```text
src/
├── app/                        # App root, global styling, main entry
│   ├── app.css                 # Tailwind v4 entry (@import 'tailwindcss';)
│   ├── app.tsx                 # Root component providing React Query, Router
│   └── main.tsx                # React DOM mount
├── config/                     # Infrastructure configuration
│   ├── axios.ts                # Axios instance with baseURL & auth headers
│   ├── queryClient.ts          # TanStack QueryClient with default options
│   └── interceptors/           # Response & request error transformers
├── shared/                     # Domain-agnostic components & utilities
│   ├── api/                    # Normalized errors & error mappers
│   ├── components/             # Common UI primitives (Button, Modal, Input, Badge)
│   └── types/                  # Global API envelope types (ApiResponse, PageResponse)
├── routes/                     # Central route definitions
│   ├── index.ts                # createBrowserRouter composition
│   ├── staffRoutes.ts          # Staff feature route configs
│   └── auditLogRoutes.ts       # Audit log route configs
├── pages/                      # URL-mapped route targets
│   └── admin/
│       ├── staff/page.tsx
│       └── audit-logs/page.tsx
└── features/                   # Self-contained business domains
    ├── staff/
    │   ├── index.ts            # Public feature export
    │   ├── components/         # Internal UI components (Tables, Modals)
    │   ├── hooks/              # Feature React Query hooks
    │   ├── services/           # Axios HTTP client calls
    │   ├── types/              # DTOs, query params, command types
    │   └── utils/              # Feature-specific formatters
    └── auditLog/
        ├── index.ts
        ├── components/
        ├── hooks/
        ├── services/
        └── types/
```

### Naming Conventions:

- **Files:** Always use **camelCase** for all code files (e.g., `staffService.ts`, `useStaff.ts`, `staffTable.tsx`, `auditLogDrawer.tsx`), except framework-mandated files (`page.tsx`, `index.ts`).
- **Components:** In JSX/TSX, React component identifiers use **PascalCase** (e.g. `StaffManagement`, `AuditLogTable`).
- **Hooks:** Custom hooks use camelCase starting with `use` (e.g. `useStaffList`, `useAuditLogs`).
- **Types & Interfaces:** Use PascalCase (e.g. `StaffMember`, `AuditLog`, `CreateStaffPayload`).

---

## 3. State Management Standards

The application categorizes state into 3 distinct layers to maintain high performance, prevent stale data, and enable deep-linking:

### Layer A: Server State (Data from Backend APIs)

- **Tool:** `@tanstack/react-query` (TanStack Query v5).
- **Rules:**
  1. All backend GET calls must be wrapped in custom hooks with structured `queryKey` hierarchies:
     ```typescript
     // Query Key Factory pattern
     export const staffKeys = {
       all: ['staff'] as const,
       lists: () => [...staffKeys.all, 'list'] as const,
       list: (filters: StaffQueryParams) =>
         [...staffKeys.lists(), filters] as const,
       details: () => [...staffKeys.all, 'detail'] as const,
       detail: (id: string) => [...staffKeys.details(), id] as const,
     };
     ```
  2. All mutation operations (POST, PUT, PATCH, DELETE) must use `useMutation` and invalidate related query keys in `onSuccess`:
     ```typescript
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: staffService.createStaff,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
       },
     });
     ```
  3. Never store server data in Zustand or useState unless it is being edited in a local form.

### Layer B: URL State (Filters, Search Keywords, Pagination)

- **Tool:** `useSearchParams` from `react-router-dom`.
- **Rules:**
  1. Filter parameters (e.g., `page`, `size`, `keyword`, `status`, `entityType`, `fromDate`, `toDate`) should be synchronized with the URL query parameters whenever possible.
  2. This allows bookmarking, browser back/forward navigation, and sharing filtered links among staff members.
  3. Default values (e.g. `page=0`, `size=20`) should be cleanly handled.

### Layer C: Local & UI State (Modals, Drawers, Temporary Inputs)

- **Tool:** React `useState` or `zustand`.
- **Rules:**
  1. Component-level modals (e.g. "Add Staff Modal", "Confirm Lock Dialog") should use local `useState` within the feature component.
  2. For complex global UI widgets (such as an Inspector Drawer accessible from multiple triggers), a lightweight Zustand store can be used.

---

## 4. API Communication & Envelope Handling

Backend responses from `CNWeb_BE` strictly adhere to the standardized ApiResponse envelope:

```typescript
export type ApiResponse<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: ApiError };

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
```

### Service Implementation Rule:

Services must call `axiosInstance`, check `response.data.success`, unwrap the payload, and throw an informative error if unsuccessful:

```typescript
import { axiosInstance } from '../../../config/axios';
import type { ApiResponse, PageResponse } from '../../../shared/types/apiType';
import type { StaffMember, StaffQueryParams } from '../types/staffType';

export const staffService = {
  async getStaffList(
    params?: StaffQueryParams,
  ): Promise<PageResponse<StaffMember>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<StaffMember>>
    >('/api/v1/admin/staff', { params });
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(
      response.data?.error?.message || 'Không thể tải danh sách nhân viên',
    );
  },
};
```

---

## 5. UI/UX & Design System Tokens (Figma Alignment)

The administrative portal adheres strictly to the **Atelier Studio Milano / High-Fashion Minimalist** design aesthetic (identical to the Storefront and Auth modules):

### Layout & Spacing:

- **Admin Sidebar:** 260px fixed width (`md:w-[260px] md:min-h-screen bg-white border-r border-gray-200`) matching Figma layout padding `0px 0px 0px 260px`.
- **Main Viewport:** `bg-gray-100` (#F3F4F6) with max-width content container `max-w-7xl mx-auto`.

### Color Palette:

- **Canvas / Root Background:** `bg-gray-100` (#F3F4F6)
- **Card & Table Surface:** `bg-white` (#FFFFFF) with `border-gray-200` and subtle shadow `shadow-2xs`
- **Text Primary:** `text-gray-900` (#111827)
- **Text Secondary:** `text-gray-500` / `text-gray-600` (#4B5563)
- **Action Buttons:**
  - Primary Action: `bg-black text-white hover:bg-neutral-800 tracking-wider uppercase font-semibold`
  - Secondary Action: `bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-2xs`
- **Status & Action Badges:**
  - Active / Create: `bg-emerald-50 text-emerald-700 border-emerald-200`
  - Update / Blue: `bg-blue-50 text-blue-700 border-blue-200`
  - Roles: `bg-gray-100 text-gray-800 border-gray-200`
  - Warning / Unlock: `bg-amber-50 text-amber-700 border-amber-200`
  - Danger / Lock / Delete: `bg-rose-50 text-rose-700 border-rose-200`

### Typography:

- **Headings & Brand:** Serif or Bold Sans with uppercase tracking: `font-serif font-bold text-xl tracking-tight text-gray-900 uppercase`.
- **System Tags & Badges:** Monospace tracking: `font-mono text-[10px] tracking-widest text-gray-400 uppercase`.
- **Code, Hashes, IPs & JSON Diffs:** Monospace font: `font-mono text-xs`.

### Table & List Best Practices:

1. Always display **Loading Skeleton** or spinner during query fetching.
2. Provide an **Empty State** with informative icon and Vietnamese text when no items match the filter.
3. Provide an **Error State** with retry button when queries fail.
4. Pagination controls must show current range: "Trang 1 / 8 (Tổng cộng 142 nhân viên)".

## 6. Development & Quality Gate Rules

Before any pull request or commit, the following check command **MUST pass with 0 errors and 0 warnings**:

```bash
npm run check
```

This command runs:

1. `prettier --check .` (Formatting)
2. `eslint . --max-warnings=0` (Lint rules & React hooks integrity)
3. `tsc -b` (TypeScript typechecking across the workspace)

---

## 7. Unit Testing Standards & AI Verification Protocol

Mọi thành viên trong nhóm và các AI Agents khi triển khai bất kỳ tính năng nào đều phải tuân thủ chuẩn kiểm thử tự động bằng Node.js Test Runner tích hợp sẵn (`node:test` & `node:assert/strict`):

### 1. Cấu Trúc File Test (`tests/<feature>Service.test.mjs`):

Sử dụng mock adapter của Axios kết hợp `setupResponseInterceptor` để kiểm thử logic chuyển đổi envelope và xử lý lỗi mà không cần gọi mạng thật:

```javascript
import assert from 'node:assert/strict';
import test from 'node:test';
import axios from 'axios';
import { setupResponseInterceptor } from '../src/config/interceptors/responseInterceptor.ts';
import { ApiRequestError } from '../src/shared/api/apiRequestError.ts';

function createMockClient(adapter) {
  const client = axios.create({ adapter, baseURL: '/api' });
  setupResponseInterceptor(client);
  return client;
}

test('featureService handles happy path', async () => {
  const client = createMockClient(async (config) => {
    assert.equal(config.method, 'get');
    assert.equal(config.url, '/v1/admin/feature');
    return {
      config,
      data: { success: true, data: { id: '1' }, error: null },
      status: 200,
      headers: {},
    };
  });
  const res = await client.get('/v1/admin/feature');
  assert.equal(res.data.success, true);
});
```

### 2. Checklist Hoàn Thành Bắt Buộc (Quality Gate Checklist):

Trước khi tạo commit hoặc kết thúc task, AI Agent và lập trình viên phải thực thi và đảm bảo:

- [ ] Đã viết đầy đủ test cases cho Happy path, Unhappy path và Validation.
- [ ] Chạy `npm test` vượt qua 100% các bài test.
- [ ] Chạy `npm run format:check` định dạng code chuẩn Prettier.
- [ ] Chạy `npm run lint` đạt 0 lỗi, 0 cảnh báo.
- [ ] Chạy `npm run typecheck` vượt qua TypeScript toàn dự án.
