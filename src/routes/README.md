# Routes

This directory contains all application routes, powered by **TanStack Start file-based routing**.

## How it works

- Each `.tsx` file in this directory automatically becomes a route.
- `routeTree.gen.ts` is auto-generated — **never edit it manually**.
- The root layout is `__root.tsx` (mandatory shell that wraps every page).
- Layout routes (`_layout.tsx`) wrap child routes using `<Outlet />`.

## File naming conventions

| File pattern                    | URL / behaviour                           |
| ------------------------------- | ----------------------------------------- |
| `index.tsx`                     | `/` (homepage)                            |
| `about.tsx`                     | `/about`                                  |
| `users/index.tsx`               | `/users`                                  |
| `users/$id.tsx`                 | `/users/:id` (dynamic segment)            |
| `posts/{-$category}.tsx`        | `/posts/:category?` (optional segment)    |
| `files/$.tsx`                   | `/files/*` (splat – use `_splat` param)   |
| `_layout.tsx`                   | layout route (renders children via `<Outlet />`) |
| `__root.tsx`                    | root app shell – wraps every page         |

## Important notes

- Dynamic segments use a **bare `$`** sign, e.g. `$id`, not `[id]` or curly braces.
- Optional segments are prefixed with `{-$param}` – the `-` signals optional.
- Splat routes use `$.tsx` and the value is accessed via `_splat` param, never `*`.
- Do **not** create `src/pages/`, `src/routes/_app/`, or `app/layout.tsx` – those are Next.js / Remix conventions and won't work here.

## Example: using params in a dynamic route

```tsx
// users/$id.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$id')({
  component: UserPage,
})

function UserPage() {
  const { id } = Route.useParams()
  return <div>User ID: {id}</div>
}