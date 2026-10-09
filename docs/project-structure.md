# Project structure

The application uses Vite and React Router. Page folders use a `page.tsx` entry
similar to Next.js, but files do not automatically register routes. URLs are
explicitly defined in `src/routes/`.

```text
src/
├── app/
│   ├── main.tsx                  # Mount React
│   └── app.tsx                   # Render the router provider
├── routes/
│   ├── index.ts                  # Compose the browser router
│   ├── homeRoutes.ts             # Home route definitions
│   └── authRoutes.ts             # Login and registration route definitions
├── pages/
│   ├── home/page.tsx             # HomePage → Home
│   └── auth/
│       ├── login/page.tsx        # LoginPage → Login
│       └── register/page.tsx     # RegisterPage → Register
└── features/
    ├── home/
    │   ├── index.ts              # Public exports
    │   ├── components/index.tsx  # Existing Home component
    │   ├── hooks/                # Existing scaffold
    │   ├── services/             # Existing scaffold
    │   └── types/                # Existing scaffold
    └── auth/
        ├── index.ts              # Public exports
        └── components/
            ├── login.tsx         # Empty feature entry
            └── register.tsx      # Empty feature entry
```

## Routes and pages

| URL              | Page                               | Feature    |
| ---------------- | ---------------------------------- | ---------- |
| `/`              | `src/pages/home/page.tsx`          | `Home`     |
| `/auth/login`    | `src/pages/auth/login/page.tsx`    | `Login`    |
| `/auth/register` | `src/pages/auth/register/page.tsx` | `Register` |

`home` names the root page folder; its URL is `/`. Each page is a thin component
that renders its feature entry. This is rendering, not a redirect to another URL.
Login and registration currently return `null`, so their routes intentionally
render no UI. Forms, validation, API calls and authentication state are not
implemented.

## Dependencies and naming

- Keep dependencies flowing from `App` → `routes` → `pages` → `features`.
- Put URL-to-page mappings in `routes/<feature>Routes.ts` and compose them in
  `routes/index.ts`. Adding a `page.tsx` also requires registering its route.
- Use camelCase for application file names, including component files:
  `app.tsx`, `login.tsx`, `productCard.tsx`, `homeRoutes.ts`, `useAuth.ts` and
  `authService.ts`. Keep conventional entries such as `page.tsx` and `index.ts`.
  Tool configuration and standard documentation names retain their conventions,
  such as `vite.config.ts`, `tsconfig.app.json`, `README.md` and `AGENTS.md`.
- Keep React component names in PascalCase, such as `App`, `Login` and
  `HomePage`, and hook names in camelCase with the `use` prefix. A component's
  identifier can therefore differ in casing from its file name.
- Pages import feature entries through `features/<feature>/index.ts`. Keep
  feature UI and behavior inside `features/<feature>/` and use relative imports.
  The existing Home component keeps its `components/index.tsx` entry.
- Add hooks, services and types when their implementation is needed. Features
  must not import pages or route registration modules.
- Keep application entry points in `app/`; add providers and layouts there when
  needed. Introduce `shared/` for code with real shared consumers and `config/`
  for application configuration when needed. Shared code must not depend on
  features.

## Adding another page

1. Implement and export its feature entry from `features/<feature>/index.ts`.
2. Add a `pages/<segment>/page.tsx` component that renders that entry.
3. Define its URL and page component in `routes/<feature>Routes.ts` and include
   that route group in `routes/index.ts`.
