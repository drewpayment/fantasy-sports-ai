# Creative Phase: Comprehensive League Settings UI

🎨🎨🎨 **ENTERING CREATIVE PHASE: UI/UX DESIGN** 🎨🎨🎨

## 1. Component Description

This creative document outlines the design for the new **Comprehensive League Settings UI**, which will be located at `app/league/[leagueId]/page.tsx`. This interface is the central hub for a league commissioner to define all the rules of their manually created league, from the number of teams and roster composition to the detailed scoring system.

## 2. Requirements & Constraints

-   **Comprehensive**: The UI must accommodate all settings specified in the PRD, based on the provided reference image (General, Roster Positions, and Scoring).
-   **User-Friendly**: The form should be organized and intuitive, preventing the user from feeling overwhelmed by the number of options.
-   **Clear State Management**: The data from the form should be easily collected and structured to be sent to the `updateLeagueSettings` Convex mutation.
-   **Leverage Existing Components**: The design should utilize our existing `shadcn/ui` component library for consistency.

## 3. Options Analysis

We will explore three primary layout options for this complex form.

### Option 1: Tabbed Interface

-   **Description**: We would use the existing `Tabs` component on the page and create three distinct tabs: "General", "Roster", and "Scoring". Each tab would contain the form fields relevant to that category.
-   **Pros**:
    -   Cleanly separates concerns, making the UI feel less cluttered.
    -   Reduces the cognitive load on the user by presenting one section at a time.
    -   Provides a clear, organized structure that is easy to navigate.
-   **Cons**:
    -   The user cannot view all settings simultaneously.
    -   Requires clicking between tabs to make changes in different sections.

### Option 2: Single-Page Accordion

-   **Description**: All settings would live on a single page, but each major section ("General", "Roster", "Scoring") would be contained within a collapsible `Accordion` component.
-   **Pros**:
    -   Allows the user to see all setting categories at a glance.
    -   Can be faster for users who need to edit settings in multiple sections quickly.
-   **Cons**:
    -   Even with accordions collapsed, the page could become very long and require significant scrolling.
    -   Having all form inputs in the DOM at once could be slightly less performant, though likely not an issue here.

### Option 3: Multi-Step Wizard

-   **Description**: A modal-based, step-by-step wizard that guides the user through "Step 1: General", "Step 2: Roster", and "Step 3: Scoring".
-   **Pros**:
    -   Excellent for first-time setup, providing a very guided and clear process.
-   **Cons**:
    -   Significantly more complex to implement and manage state across steps.
    -   Becomes very cumbersome for a commissioner who just wants to return and edit a single setting quickly.

## 4. Recommended Approach

**The recommended approach is Option 1: Tabbed Interface.**

This approach provides the best balance of organization, simplicity, and user experience. It leverages the existing UI pattern on the page, cleanly segments the complex information, and is straightforward to implement. While a user can't see everything at once, the clarity and reduced cognitive load are a winning tradeoff for a settings-heavy page like this.

## 5. Implementation Guidelines

-   **File**: `app/league/[leagueId]/page.tsx`
-   **Component Structure**:
    -   Use `Tabs` with three `TabsTrigger` elements: "General", "Roster", and "Scoring".
    -   Each `TabsContent` will contain a form section.
-   **State Management**:
    -   A single React state object, `[settings, setSettings]`, should be used to hold all form data. The structure should mirror the intended database schema.
    -   As users modify inputs in any tab, the corresponding key in the `settings` object is updated.
-   **General Tab**:
    -   Use `Input` for "League Name".
    -   Use `Input` with `type="number"` for "Max Teams".
-   **Roster Tab**:
    -   For each position (QB, RB, WR, etc.), use a `div` with a `Label` and an `Input` with `type="number"`. Arrange these in a responsive grid.
-   **Scoring Tab**:
    -   Use the `Table` component to list scoring categories.
    -   Each row will represent a scoring rule (e.g., "Passing Touchdown").
    -   One column will be the `Label` (the rule name), and the other will be an `Input` with `type="number"` for the point value.
    -   Group the table rows by category (Offense, Kicking, Defense) using a `TableCaption` or similar separator.
-   **Data Submission**:
    -   A single "Save Settings" `Button` will exist outside the `Tabs` component.
    -   On click, it will call the `updateLeagueSettings` mutation, passing the entire `settings` state object.

🎨🎨🎨 **EXITING CREATIVE PHASE** 🎨🎨🎨
