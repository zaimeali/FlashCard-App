---
name: create-group-design-skills
description: Implementation design guide for the create group screen of the Flash Card App.
applies_to: 
  - src/app/components/flashcards/create-group/create-group.html
  - src/app/components/flashcards/create-group/create-group.scss
  - src/app/components/flashcards/create-group/create-group.ts
  - src/app/components/flashcards/create-group/create-group.spec.ts
design:
  - for theme's color, and fonts refer to `src/styles.scss`
---

## Create Group Screen Layout

**Trigger:** User opens the create group screen.

**Action:**
1. Show main area in the middle of the screen.
2. Scroll bar should not appear on the `body`.

---

### Main Area Layout

**Trigger:** User opens the create group screen.

**Action:**
1. Main content area should have a following elements:
    - Should have a different background color than a body.
    - Should have a padding.
    - Should have a border-radius.
    - Should have a box-shadow.
1. Show Input field - Group Name.
    - Input field should have a label "Group Name".
    - Input field should have a placeholder "Enter group name".
    - Input field should have a primary color.
    - Input field should be clickable.
    - Input field should have a hover effect.
    - Input field should have a focus effect.
    - Input field should have a transition effect.
2. Show Textbox field - Group Description.
    - Textbox field should have a label "Group Description".
    - Textbox field should have a placeholder "Enter group description".
    - Textbox field should have a primary color.
    - Textbox field should be clickable.
    - Textbox field should have a hover effect.
    - Textbox field should have a focus effect.
    - Textbox field should have a transition effect.
3. Show Add Flashcards area.
4. Show Add Group button at the bottom in the center.
5. Scroll bar should not appear on the `body`.

---

### Flashcards Area Layout

**Action:**
1. Show heading "Flashcards".
    - Heading should be in the left side of the area.
    - Heading should have a primary color.
2. Show Add Flashcards button on the right side of the area on the same level as Flashcards heading.
    - Add Flashcards button should have a primary color.
    - Add Flashcards button should be clickable.
    - Add Flashcards button should have a hover effect.
    - Add Flashcards button should have a focus effect.
    - Add Flashcards button should have a transition effect.
    - When clicked, show the Add Flashcard Modal.
        - Add Flashcard Modal should have a title "Add Flashcard".
        - Add Flashcard Modal should have a close button.
        - Add Flashcard Modal should have a input field for Question.
        - Add Flashcard Modal should have a input field for Answer.
        - Add Flashcard Modal should have a button to add hints.
        - Add Flashcard Modal should have a button to save the flashcard.
2. Show table at the bottom of the area.
    - Table should have the following columns:
        - Question
        - Answer
        - Number of Hints - Clickable:
            - When clicked, show the Hints Modal.
                - Hint Modal should have a title "Hints".
                - Hint Modal should have a list of hints.
                - Hint Modal should have a close button.
        - Actions
            - Edit button only with Mat Icon (edit).
                - Edit button should have a primary color.
                - Edit button should be clickable.
                - Edit button should have a hover effect.
                - Edit button should have a focus effect.
                - Edit button should have a transition effect.
            - Delete button only with Mat Icon (delete).
                - Delete button should have a primary color.
                - Delete button should be clickable.
                - Delete button should have a hover effect.
                - Delete button should have a focus effect.
                - Delete button should have a transition effect.