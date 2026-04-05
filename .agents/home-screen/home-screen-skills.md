---
name: home-screen-skills
description: Implementation guide for the home screen of the Flash Card App.
applies_to: 
  - src/app/components/home/home.html
  - src/app/components/home/home.scss
  - src/app/components/home/home.ts
  - src/app/components/home/home.spec.ts
design:
  - for theme's color, and fonts refer to `src/styles.scss`
---

## Home Screen Skills

### 1. Home Component Layout

**Trigger:** User opens the home screen.

**Action:**
1. Show title bar 
   - with "Your Flashcards" on the left
   - with "Create Group" button beside total cards.
        - Create Group button should be a Material UI button.
        - It should also have a icon on the right side.
        - It should have a primary color.
        - It should have a hover effect.
   - Search bar in the middle - use Material UI search bar.
   - "Total Cards: <number>" on the right - group cards created by user.
2. Show main content area at the bottom of the screen.
3. Scroll bar should not appear on the `body`.

### 2. Main Content Layout

**Trigger:** User opens the home screen.

**Action:**
1. At first load, should show 4 rows of groups.
2. Each row should have 3 groups.
3. Groups should have a card like structure.
4. Should use `mat-card` for the card structure.
5. Should have a scrollbar appears when exceeds height viewport.
6. "Load more" button should be at the bottom of the page.

### 3. Card Design

**Trigger:** User opens the home screen.

**Action:**
1. Each group should have the following elements:
   - Group name
   - Group description
   - Number of cards in the group
   - 3 dot icon on the top right corner.
2. Mat Card design should be as follows:
   - Card should have a padding.
   - Title design should have the following properties:
        - Title should be in the top left corner.
        - Title should be in the primary color.
        - Title should not wrap and if exceeds defined width, it should show "..." at the end.
   - Description design should have the following properties:
        - Description should be in the bottom left corner.
        - Description should be in the secondary color.
        - Description should not wrap and if exceeds 2 lines, it should show "..." at the end.
   - Number of cards design should have the following properties:
        - Number of cards should be in the bottom right corner.
        - Number of cards should be in the muted color.
   - 3 dots option icon should be a Material UI icon.
        - It should have a muted color.
        - It should have a hover effect.
        - It should have a focus effect.
        - It should have a transition effect.
        - When clicked, it should open a dropdown menu.
        - Dropdown menu should have the following options:
            - Edit with Pen Icon
            - Delete with Delete Icon
2. Card should have a shadow effect on hover and focus.
3. Card should have a border effect on hover and focus.
4. Card should have a transition effect on hover and focus.
5. Card should have a cursor effect on hover and focus.
6. Card should have a tabindex effect on hover and focus.
7. Card should have a role effect on hover and focus.

### 4. Load More Groups

**Trigger:** User clicks "Load More" button on home screen.

**Action:**
1. On the action of load more, it should add 2 more rows in the viewport and scrollbar should appear.
2. Hide "Load More" button if all groups are loaded.
3. Scroll bar should not appear on the `body`.