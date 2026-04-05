---
name: profile-design-skills
description: Implementation design guide for the profile screen of the Flash Card App.
applies_to: 
  - src/app/components/auth/profile/profile.html
  - src/app/components/auth/profile/profile.scss
  - src/app/components/auth/profile/profile.ts
  - src/app/components/auth/profile/profile.spec.ts
design:
  - for theme's color, and fonts refer to `src/styles.scss`
---

# Profile Screen Design Skills

## 1. Profile Component Layout

**Trigger:** User opens the profile screen.

**Action:**
1. When User on a profile screen, make the profile button on the navbar active.
2. Show title bar 
   - with "Your Profile" on the left.
   - Profile Heading should have a icon of a person after "Your Profile".
3. Show form with the following fields:
   - Name
   - Email
4. Update button below the form.


## 2. Form Design

**Trigger:** User opens the profile screen.

**Action:**
1. Form Layout should have a border
2. Form Layout should have a round border.
3. Form Layout should have a background color.
4. Form Layout should have a padding.
1. Name and Email field should be at the same row.
2. Name should have a placeholder "Enter your name".
3. Email should have a placeholder "Enter your email".
4. Update button should be at the right side of the form.
    - Update button should be a Material UI button.
    - It should have a primary color.
    - It should have a hover effect.
    - It should have a focus effect.
    - It should have a transition effect.
    - It should have a cursor effect.
    - It should have a tabindex effect.
    - It should have a role effect.