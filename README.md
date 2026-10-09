# CNWeb — Frontend

Frontend for `cnweb-server`, using React, TypeScript, Vite and Tailwind CSS.

## Setup

Use Node.js **22.23.1** (pinned in `.nvmrc`) and npm **10 or newer**.
Keep `package-lock.json` committed and use npm consistently across the team.

```bash
nvm install
nvm use
npm ci
npm run dev
```

If you do not use nvm, install the Node version in `.nvmrc` with your preferred
version manager. `npm ci` also activates Git hooks through the `prepare` script.
Run `npm run prepare` to reinstall hooks in an existing checkout.

Vite serves the frontend on port `5173`. During development, `/api` requests are
proxied to the backend at `http://localhost:8080` (see `vite.config.ts`).

## Commands

| Command                | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `npm run dev`          | Start the development server                                      |
| `npm run build`        | Check TypeScript and create a production build in `dist/`         |
| `npm run preview`      | Preview the production build locally                              |
| `npm run lint`         | Check ESLint rules; warnings also fail                            |
| `npm run lint:fix`     | Fix automatically repairable ESLint issues                        |
| `npm run format`       | Format supported project files with Prettier                      |
| `npm run format:check` | Check formatting without changing files                           |
| `npm run typecheck`    | Check both application and Vite configuration TypeScript projects |
| `npm run check`        | Run formatting, lint and TypeScript checks                        |
| `npm run test:api`     | Test HTTP response/error handling with Node's built-in runner     |

Before opening a pull request, run:

```bash
npm run check
npm run build
```

## Formatting and editor setup

Prettier uses two spaces, single quotes, semicolons, trailing commas, an 80-column
print width and LF line endings. ESLint checks code correctness, React Hooks and
React Refresh; `eslint-config-prettier` disables conflicting formatting rules.

Shared `.editorconfig` and `.gitattributes` settings keep whitespace and line
endings consistent across operating systems. In VS Code, install the workspace's
recommended ESLint, Prettier and EditorConfig extensions. Workspace settings
format supported files on save and apply ESLint fixes when saving explicitly.

Generated output, dependencies and the npm lockfile are excluded from Prettier.
Let npm maintain `package-lock.json`.

## Git hooks and commit messages

- `pre-commit`: lint-staged runs ESLint fixes and Prettier on staged JS/TS files,
  and Prettier on staged JSON, CSS, HTML, Markdown and YAML files. Fixed changes
  are staged automatically. Remaining lint errors or warnings block the commit.
- `commit-msg`: commitlint validates Conventional Commits.

Hooks keep commits quick by checking staged files. Run `npm run check` for
project-wide validation, including TypeScript. A CI workflow is not configured yet.

Commit headers require a scope and use the same types as the backend:

```text
<type>(<scope>)[!]: <description>
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`,
`ci`, `chore`, `revert`. Headers must be at most 100 characters long. Use a
lowercase description without a trailing period. Scope is required; choose a
relevant area such as `auth`, `cart`, `tooling` or `deps`. Merge commits are exempt.

```text
chore(tooling): configure lint and hooks
docs(setup): update setup instructions
build(deps): update development dependencies
```

If a hook fails, fix the reported issue, stage the changes and retry the commit.

## Environment files

Local `.env` files are ignored by Git. Copy `.env.example` to `.env` to override
the API root. `VITE_BE_API_URL` defaults to `/api`, using the Vite development
proxy. For a separate backend origin, set it to a URL including the API prefix,
such as `https://api.example.com/api`; that backend must allow frontend CORS.
Production hosting must proxy `/api` or supply this variable at build time.
Variables exposed through Vite's `VITE_` prefix are public browser configuration
and must not contain secrets.

## HTTP client

Import `axiosInstance` from `src/config/axios.ts` in feature services. It uses a
10-second timeout, accepts JSON and requests Vietnamese responses. Axios sets the
request content type based on the body, including JSON for plain objects.
Endpoint paths are relative to the API root: use `/users`, not `/api/users`.

The response interceptor preserves `AxiosResponse`, including status and headers,
as in `tidala-mobile`. Read the CNWeb envelope through `response.data`, then narrow
`success` to access its payload. Types live in `src/shared/types/apiType.ts`;
use `ApiResponse<T | null>` when an operation can return null data.

```ts
// Inside src/features/<feature>/services/<service>.ts
import { axiosInstance } from '../../../config/axios';
import type { ApiResponse } from '../../../shared/types/apiType';

const response = await axiosInstance.get<ApiResponse<unknown>>('/users', {
  params: { page: 0, size: 20 },
  signal, // Pass the caller's AbortSignal when available.
});

if (response.data.success) {
  const payload = response.data.data;
  // Map the payload in the feature service.
}
```

Failures become `ApiRequestError` from `src/shared/api/apiRequestError.ts`.
Use `instanceof ApiRequestError` to read `status`, `code`, `message`, `fieldErrors`,
`timestamp` and optional `path`. HTTP failures retain their status; failures
without an HTTP response use status `0`. Server envelopes are checked before
their messages are used, and other errors receive safe fallback messages. The
original error remains available as `cause`. Canceled requests stay Axios
cancellation errors so callers can recognize them with `axios.isCancel`.

The companion backend currently has no authentication or refresh-token contract.
Token persistence, authorization headers, automatic refresh and logout redirects
will be added when that contract exists. The client currently sends each request
once and leaves UI error handling to its caller.

Run `npm run test:api` for interceptor checks using mocked Axios adapters; these
do not require a running backend or an additional test framework.
