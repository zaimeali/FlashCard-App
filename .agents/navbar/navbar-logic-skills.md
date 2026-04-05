---
name: navbar-logic-skills
description: Implementation logic guide for the navbar of the Flash Card App.
applies_to: 
  - src/app/components/navbar/navbar.html
  - src/app/components/navbar/navbar.scss
  - src/app/components/navbar/navbar.ts
  - src/app/components/navbar/navbar.spec.ts
---

## Navbar Logic

**Trigger:** Navbar is visible.

**Action:**
1. Home Screen
    - Home page url is `/`
    - When User on a home screen, make the "My Groups" button on the navbar active.
2. Profile Screen
    - Profile page url is `/profile`
    - When User on a profile screen, make the profile button on the navbar active.
