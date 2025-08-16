# Tasks

## Phase 1: UI/UX Design and Prototyping ✅ COMPLETE

- [x] Design the overall look and feel of the application (`ui-ux-design.md`).
- [x] Create Product Requirements Document (`prd-initial-ui.md`).
- [x] **Implementation Plan:**
  - **Global Components & Styling:**
    - [x] Configure `tailwind.config.ts` with the defined color palette.
    - [x] Set up Inter font in `app/layout.tsx`.
    - [x] Implement Dark/Light mode theme toggling.
    - [x] Create `components/Layout.tsx` as a page wrapper.
    - [x] Create `components/Header.tsx` with navigation and Clerk integration.
    - [x] Create `components/Footer.tsx`.
  - **Page Scaffolding:**
    - [x] Create `app/dashboard/page.tsx` with placeholder sections.
    - [x] Create `app/league/page.tsx` with `shadcn/ui` Tabs for settings.
    - [x] Create `app/players/page.tsx` with a placeholder `shadcn/ui` Table and filters.
    - [x] Create a new route for teams (`app/league/teams/page.tsx`) with placeholder `shadcn/ui` Cards.
  - **Shadcn/ui Components:**
    - [x] Install necessary `shadcn/ui` components (Button, Card, Table, Input, Select, Tabs).
- [x] **Reflection Complete** (`reflection-ui-scaffolding.md`)
- [x] **Archiving Complete** (`docs/archive/feature-ui-scaffolding-20241220.md`)

## Phase 2: Data Modeling and Database Setup ✅ COMPLETE

- **Status**: Fully implemented and archived
- **Archive Document**: `docs/archive/feature-data-modeling-20241221.md`

## Phase 3: API Integration ✅ COMPLETE

- **Status**: Fully implemented and archived
- **Archive Document**: `docs/archive/feature-api-integration-20241222.md`

## Phase 4: Manual League Management (Current)

### Description
This phase focuses on building a complete, standalone experience for users to manually create, configure, and manage their fantasy leagues. It also includes the critical task of integrating a global third-party API for all NFL player data, which will serve as the foundation for roster management and future AI analysis.

### PRD Document
- `memory-bank/creative/prd-manual-league-management.md`

### Implementation Plan

**Sub-Phase 4.1: Global NFL Data API Integration**
- [ ] **Task**: Research and select a third-party API for global NFL player data (players, stats, news).
- [ ] **Task**: Implement a client to fetch data from the selected API.
- [ ] **Task**: Create a new table in `convex/schema.ts` to store this global player data if the schema differs from our current `players` table.
- [ ] **Task**: Implement a Convex cron job to periodically sync player data from the API to our database.

**Sub--Phase 4.2: Comprehensive League Settings UI**
- [ ] **Task (app/league/[leagueId]/page.tsx)**:
  - [ ] Expand the "League Settings" page with a multi-section form.
  - [ ] Implement the UI for "General Settings" (League Name, Number of Teams).
  - [ ] Implement the UI for defining "Roster Positions" (e.g., QB, RB, WR, etc.).
  - [ ] Implement the UI for defining "Scoring Rules" for all categories.
- [ ] **Task (convex/leagues.ts)**:
  - [ ] Update the `updateLeagueSettings` mutation to save the entire detailed settings object to the database.

**Sub-Phase 4.3: Roster Management**
- [ ] **Task**: Create a new page at `app/team/[teamId]/roster/page.tsx` to display a team's current roster.
- [ ] **Task**: On the "Players" page, add an "Add Player" button to each player row.
- [ ] **Task (convex/rosters.ts)**:
  - [ ] Create a new `addPlayerToRoster` mutation.
  - [ ] This mutation must contain logic to check if adding the player violates the league's roster position limits before adding them.
- [ ] **Task**: Connect the "Add Player" button to the new mutation and provide feedback to the user (success or error).

## Phase 5: Vercel AI SDK Integration

- [ ] Set up the Vercel AI SDK.
- [ ] Implement a basic chat interface for testing.
- [ ] Develop prompts for draft and in-season advice.
- [ ] Integrate the AI with the fantasy football API to provide real-time advice.

## Phase 6: Deployment and Testing

- [ ] Deploy the application to Vercel.
- [ ] Perform end-to-end testing of all features.
- [ ] Gather user feedback and iterate.
