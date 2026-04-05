---
name: app-screen-skills
description: Implementation guide for the app screen of the Flash Card App.
applies_to: 
  - src/app/app.html
  - src/app/app.scss
  - src/app/app.ts
  - src/app/app.spec.ts
design:
  - for theme's color, and fonts refer to `src/styles.scss`
---

### 1. App Component Layout

**Trigger:** User opens the app.

**Action:**
1. Show navbar at the top of the screen.
2. Show main content (routing-outlet) area at the bottom of the screen.
3. Scroll bar should not appear on the app component.