---
name: angular-flashcard-app
description: >
  Comprehensive development skill for building an Angular flashcard application
  with GitHub SSO authentication via Supabase, Postgres database, and Vercel
  deployment. Use this skill whenever working on any feature, screen, component,
  service, or configuration related to this flashcard app — including auth flows,
  Supabase integration, Angular routing, flashcard CRUD operations, category
  management, and deployment setup. Trigger this skill for any task involving
  the flashcard app architecture, even if the user only mentions one part of it
  (e.g. "add a new card", "fix login", "set up Supabase").
---

# Angular Flashcard App — Project Skill

## Project Overview

A full-stack flashcard learning app built with Angular, authenticated via GitHub
SSO, data stored in Supabase Postgres, and deployed on
Vercel.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | Angular 17+ (standalone components) |
| Auth         | GitHub OAuth SSO                    |
| Database     | Supabase (Postgres)                 |
| Deployment   | Vercel                              |
| Styling      | Angular Material or TailwindCSS     |
| HTTP Client  | Supabase JS SDK (`@supabase/supabase-js`) |

---

## App Screens & Routes

```
/login            → Login / Registration Screen
/home             → Home Screen (list of categories/subjects)
/category/:id     → Flash Cards Page (view + revise cards in a category)
/category/new     → Create New Category
```

---

## Supabase Setup

### 1. GitHub OAuth Configuration
- In Supabase Dashboard → Auth → Providers → Enable GitHub
- Add GitHub OAuth App credentials (Client ID + Secret)
- Set callback URL: `https://<your-vercel-url>/auth/callback`

### 2. Database Schema

```sql
-- Categories (subjects/groups of flashcards)
create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz default now()
);

-- Flashcards
create table flashcards (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz default now(),
  last_reviewed timestamptz
);

-- Row Level Security
alter table categories enable row level security;
alter table flashcards enable row level security;

-- Policies: users can only access their own data
create policy "User owns categories"
  on categories for all using (auth.uid() = user_id);

create policy "User owns flashcards"
  on flashcards for all using (auth.uid() = user_id);
```

---

## Angular Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── supabase.service.ts       ← Supabase client singleton
│   │   │   ├── auth.service.ts           ← GitHub SSO login/logout/session
│   │   │   ├── category.service.ts       ← CRUD for categories
│   │   │   └── flashcard.service.ts      ← CRUD for flashcards
│   │   └── guards/
│   │       └── auth.guard.ts             ← Protects /home and /category routes
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/                    ← Login screen component
│   │   │   └── callback/                 ← OAuth callback handler
│   │   ├── home/                         ← Home screen (category list)
│   │   ├── category/
│   │   │   ├── category-list/            ← Cards in a category
│   │   │   ├── category-create/          ← New category form
│   │   │   └── flashcard-form/           ← Create/edit flashcard
│   └── app.routes.ts
├── environments/
│   ├── environment.ts                    ← Supabase URL + anon key
│   └── environment.prod.ts
```

---

## Key Service Patterns

### supabase.service.ts
```typescript
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey
  );
}
```

### auth.service.ts
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService).client;

  signInWithGitHub() {
    return this.supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  getSession() {
    return this.supabase.auth.getSession();
  }

  onAuthChange(callback: (session: any) => void) {
    return this.supabase.auth.onAuthStateChange((_, session) => callback(session));
  }
}
```

### auth.guard.ts
```typescript
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const { data } = await auth.getSession();
  if (data.session) return true;
  return router.createUrlTree(['/login']);
};
```

---

## Routing Setup (app.routes.ts)

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component') },
  { path: 'auth/callback', loadComponent: () => import('./features/auth/callback/callback.component') },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/home.component')
  },
  {
    path: 'category/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/category/category-create/category-create.component')
  },
  {
    path: 'category/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/category/category-list/category-list.component')
  },
  { path: '**', redirectTo: 'login' }
];
```

---

## Vercel Deployment

### vercel.json (required for Angular routing)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Environment Variables in Vercel Dashboard
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Deploy Steps
1. Push repo to GitHub
2. Connect repo in Vercel dashboard
3. Set build command: `ng build --configuration production`
4. Set output directory: `dist/<app-name>/browser`
5. Add environment variables
6. Deploy

---

## Auth Callback Handler

The `/auth/callback` component must exchange the OAuth code for a session:

```typescript
@Component({ standalone: true, template: '<p>Authenticating...</p>' })
export class CallbackComponent implements OnInit {
  private supabase = inject(SupabaseService).client;
  private router = inject(Router);

  async ngOnInit() {
    const { error } = await this.supabase.auth.exchangeCodeForSession(
      window.location.href
    );
    this.router.navigate(error ? ['/login'] : ['/home']);
  }
}
```

---

## Development Checklist

- [ ] `ng new flashcard-app --routing --style=scss --standalone`
- [ ] `npm install @supabase/supabase-js`
- [ ] Configure `environment.ts` with Supabase credentials
- [ ] Set up Supabase project, enable GitHub OAuth provider
- [ ] Create DB schema + RLS policies
- [ ] Build `SupabaseService`, `AuthService`, `AuthGuard`
- [ ] Build Login screen with GitHub SSO button
- [ ] Build OAuth callback handler component
- [ ] Build Home screen (category list)
- [ ] Build Category page (flashcard list + create/revise)
- [ ] Add `vercel.json` for SPA routing
- [ ] Connect GitHub repo to Vercel, set env vars, deploy

---

## Common Pitfalls

| Issue | Fix |
|-------|-----|
| Blank page on Vercel refresh | Add `vercel.json` with rewrites rule |
| GitHub OAuth redirect mismatch | Ensure callback URL in GitHub OAuth App matches Vercel URL exactly |
| RLS blocking queries | Confirm `auth.uid() = user_id` policies are enabled |
| Session lost on refresh | Use `onAuthStateChange` to restore session in `AppComponent` |
| Supabase client created multiple times | Keep `SupabaseService` as `providedIn: 'root'` singleton |