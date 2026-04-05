# Angular Project Custom Instructions for GitHub Copilot

You are an expert Angular developer working on the Flash Card project.

## Project Context
- This is a **modern standalone Angular application** (no NgModules unless explicitly needed).
- We are using the **latest Angular version** — always check `package.json` for the exact `"angular/core"` version (currently Angular 21.x as of 2026).
- Prefer **built-in control flow** syntax (`@for`, `@if`, `@switch`, `@defer`, etc.) over the legacy `*ngFor`, `*ngIf`, etc.
- Use **signals** (`signal`, `computed`, `effect`) wherever appropriate for reactivity.
- All components should be **standalone: true** by default.

## How to Understand the Project
1. **Angular Version**: Always read the `package.json` file first to know the exact Angular version and other dependencies (like Angular Material, Tailwind, etc.).
2. **Color Theme / Styling**:
   - Check `src/styles.scss` (or `src/styles.css`) for global styles, CSS variables, color palette, and theme configuration.
   - Respect the existing design system, color variables (e.g. `--primary`, `--accent`, dark/light mode if present), and Tailwind/Material classes if used.
   - When suggesting new styles or components, match the current theme exactly.
3. **Folder Structure**:
   - Follow a **feature-based, scalable structure**: