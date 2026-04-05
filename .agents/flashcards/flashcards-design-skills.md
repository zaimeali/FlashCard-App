---
name: flashcards-design-skills
description: Implementation design guide for the flashcards screen of the Flash Card App.
applies_to: 
  - src/app/components/flashcards/flashcards.html
  - src/app/components/flashcards/flashcards.scss
  - src/app/components/flashcards/flashcards.ts
  - src/app/components/flashcards/flashcards.spec.ts
  - src/app/components/flashcards/flashcard/flashcard.html
  - src/app/components/flashcards/flashcard/flashcard.scss
  - src/app/components/flashcards/flashcard/flashcard.ts
  - src/app/components/flashcards/flashcard/flashcard.spec.ts
design:
  - for theme's color, and fonts refer to `src/styles.scss`
---

## Flashcard Screen Layout

**Trigger:** User opens the flashcards screen.

**Action:**
1. Show title bar at the top of the screen.
2. Show main content area in the middle of the screen.
3. Show Info bar at the bottom of the screen.
4. Scroll bar should not appear on the `body`.

---

### Title Bar Design

**Trigger:** User opens the flashcards screen.

**Action:**
1. Title bar should have the following elements:
   - with Flashcards group title in the middle.
   - "Total Flashcards: <number>" below the title.

---

### Main Content Design (Flashcards) - Multiple Flashcards

**Trigger:** User opens the flashcards screen.

**Action:**
1. Main content area should have the following elements:
    - Flashcard container should be in the middle of the screen.
    - Flashcard container should be a carousel of flashcards.
    - Flashcard should have left and right arrow buttons to navigate between flashcards.
        - Left and Right arrow buttons should be Material UI icons.
            - Icon should be `arrow_back` and `arrow_forward`.
        - Left and Right arrow buttons should have a primary color.
        - Left and Right arrow buttons should be clickable.
        - Left and Right arrow buttons should have a hover effect.
        - Left and Right arrow buttons should have a focus effect.
        - Left and Right arrow buttons should have a transition effect.
        - Manual left and right navigation arrows coexist with automatic progressions and function independently securely.
    - Flashcard container should have a padding.
    - Flashcard should not have scrollbar.
    - Flashcard should have a front and back.
    - Flashcard should have a flip effect.
    - Flashcard should have a swipe effect.
    - Flashcard should have a transition effect.
        - Front of the card should have the question.
        - Back of the card should have the answer.
    - Hints container below flashcard
        - Hint container should pull data uniquely corresponding only to the currently front-facing active flashcard instance.
        - Hint container should have a title "Hints".
        - Hint container should have a list of hints.
        - Each hint in the list will be visible when user clicks on the hint button.
        - Hint button should be a Show hint + Material UI icon.
            - Icon should be `lightbulb`.
        - Hint button should have a primary color.
        - Hint button should be clickable.
        - Hint button should have a hover effect.
        - Hint button should have a focus effect.
        - Hint button should have a transition effect.
        - Hidden hint text should be in the muted color.
        - Hidden hint should be blurred.
        - When user clicks on the hint button, the hint should be visible.
        - When user clicks on the hint button again, the hint should be hidden.
            - When all hints are visible, change the text of the button to "Hide hints" and use alternative material icon (e.g., `lightbulb_outline`).
            - When all hints are hidden, change the text of the button to "Show hints" and use the `lightbulb` icon.
        - When click on one of the visible hint, it should hide.

2. Be creative, design it like a real flashcard app.
    - Current Flash card which is viewable should be at the front.
    - Next Flash card should be behind the current flash card.
        - Next flash card should be the right side of the current flash card.
        - Next flash card should be smaller than the current flash card.
    - Previous Flash card should be behind the current flash card.
        - Previous flash card should be the left side of the current flash card.
        - Previous flash card should be smaller than the current flash card.

---

### Flashcard Design - Single Flashcard

**Trigger:** User opens the flashcards screen.

**Action:**
1. Flashcard should have the following elements:
    - Flashcard should show title/question in the middle of the front side, and answer in the middle of the back side.
    - Flashcard should show correct button on the bottom right corner (mounted on both sides).
        - Button should be a Material UI icon.
            - Icon should be thumbs up.
        - Button should have a primary color.
        - Button should be clickable.
        - Button should have a hover effect.
        - Button should have a focus effect.
        - Button should have a transition effect.
    - Flashcard should show incorrect button on the bottom left corner (mounted on both sides).
        - Button should be a Material UI icon.
            - Icon should be thumbs down.
        - Button should have a primary color.
        - Button should be clickable.
        - Button should have a hover effect.
        - Button should have a focus effect.
        - Button should have a transition effect.
    - Flashcard should show skip button on the bottom middle of the card (mounted on both sides).
        - Button should be a Material UI icon.
            - Icon should be skip.
        - Button should have a primary color.
        - Button should be clickable.
        - Button should have a hover effect.
        - Button should have a focus effect.
        - Button should have a transition effect.

---

### Info Bar Design

**Trigger:** User opens the flashcards screen.

**Action:**
1. Info bar should have the following elements:
   - It should show how many correct, incorrect, and skipped flashcards.
   - It should show the percentage of correct flashcards.
   - It should show the percentage of incorrect flashcards.
   - It should show the percentage of skipped flashcards.