---
name: navbar-design-skills
description: Implementation design guide for the navbar of the Flash Card App.
applies_to: 
  - src/app/components/navbar/navbar.html
  - src/app/components/navbar/navbar.scss
  - src/app/components/navbar/navbar.ts
  - src/app/components/navbar/navbar.spec.ts
design:
  - for theme's color, and fonts refer to `src/styles.scss`
---

### 1. Navbar Layout

1. Should have a logo on the left side.
    - Logo icon should be `/logo.svg`
    - Logo text should be `FlashCard`
    - Logo should be clickable and should navigate to the home page.
2. Should have a motto text in the middle.
    - Motto text should be `Learn Smarter, Not Harder`
    - The design should be subheading.
    - The subheading should be below the logo.
3. Should have navigation buttons on the right side.
    - Should have a "My Groups" button.
    - Should have a "Profile" button.
    - Should have a "Logout" button.
        - Styling should be warn or danger.
        - Should not contain any active class.
    - "My Groups" and "Profile" should have a primary color.
    - "My Groups" and "Profile" should have active class based on the current route.