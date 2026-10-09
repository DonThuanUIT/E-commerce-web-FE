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

Local `.env` files are ignored by Git. If environment configuration is added,
document variable names and safe example values in a tracked `.env.example`.
Variables exposed through Vite's `VITE_` prefix are public browser configuration
and must not contain secrets.
