# Product Requirements Document: Manual League Management & Global NFL Data

## 1. Introduction & Overview

This document outlines the requirements for a core pillar of the application: providing a complete, standalone experience for users to create, configure, and manage a fantasy football league manually. This feature set is distinct from the Yahoo league import and serves users who are starting a new league from scratch. It also covers the critical requirement of sourcing a global, non-user-specific API for all NFL player data, which is essential for roster management and future AI-driven analysis.

## 2. Goals

-   **Full Manual Control**: Empower users with the ability to create a new fantasy league and configure all essential settings, from roster positions to scoring rules.
-   **Complete Onboarding**: Provide a seamless flow for users to create all the teams within their new league.
-   **Dynamic Roster Management**: Enable users to add and remove players from their teams' rosters, constrained by the league's settings.
-   **Centralized NFL Data**: Integrate a global, third-party API to serve as the single source of truth for all NFL player information, including names, positions, teams, and stats.

## 3. User Stories

-   **As a league commissioner**, I want to create a new league and specify a comprehensive set of rules, including the number of teams, roster positions (e.g., 1 QB, 2 RB, 2 WR), and detailed scoring settings, so that the league operates exactly as I intend.
-   **As a league commissioner**, I want to create multiple teams within my league, giving each one a unique name, so that I can set up the league for all the managers.
-   **As a team manager**, I want to view a complete and up-to-date list of all available NFL players, so that I can add them to my team's roster.
-   **As a team manager**, I want my roster to be constrained by the league's rules (e.g., I cannot add a second QB if the roster only allows one), so that the league remains fair and balanced.

## 4. Functional Requirements

### 4.1. Global NFL Player Data API

1.  **API Selection**: The system must integrate a third-party API to serve as the global source for all NFL player data.
2.  **Core Data Points (MVP)**: The API must provide the following information for all active players:
    -   Full Name
    -   NFL Team
    -   Position (e.g., QB, RB)
    -   Roster Status (e.g., Active, Injured Reserve)
3.  **Data Points (Stretch Goal)**: The API should ideally provide:
    -   Historical stats (last season).
    -   Current season stats (updated weekly).
    -   Basic player news and updates.
4.  **Data Synchronization**: The system must implement a scheduled background job to periodically refresh the global player data from the API, ensuring our database remains current.

### 4.2. Manual League Creation & Settings

1.  **League Creation**: Users must be able to create a new league without connecting to Yahoo.
2.  **League Settings UI**: The "League Settings" page must be expanded to include a comprehensive form for editing the following, based on the provided reference image:
    -   **General Settings**: League Name, Number of Teams.
    -   **Roster Positions**: A UI to define the number of players at each position (QB, WR, RB, TE, W/R/T, K, DEF, BN, IR).
    -   **Scoring Settings**: A detailed form allowing the user to input point values for all major offensive, kicking, and defensive scoring categories (e.g., Passing Yards, Touchdowns, Interceptions, Field Goals, Sacks).
3.  **Data Storage**: The `settings` object within the `leagues` table in our Convex database must be updated to store this detailed configuration. The `v.any()` schema definition is sufficient for this.

### 4.3. Team Creation & Roster Management

1.  **Team Creation**: After creating a league, the user must be able to create multiple teams within it.
2.  **Team Creation Flow**: The "Add New Team" modal should present two options after a team is successfully created: "Add Another Team" and "Manage Roster".
3.  **Roster View**: A new page or component must be created to display a team's current roster, grouped by position.
4.  **Roster Management**: From the roster view, a user must be able to add players. This will involve:
    -   Navigating to the main "Players" page.
    -   Selecting a player to add.
    -   The system must check if adding the player violates the league's roster position limits. If it does, the user must be shown an error. If it does not, the player should be added to the team's roster.

## 5. Non-Goals (Out of Scope for this Phase)

-   A live fantasy draft interface.
-   Head-to-head matchup scoring and scheduling.
-   Waiver wire or free agent bidding systems.
-   Player trades between teams.

## 6. Success Metrics

-   A user can successfully create a new league, configure detailed roster and scoring settings, create multiple teams, and fill one of those teams' rosters with players, all without connecting a Yahoo account.
-   The application's player database is successfully and regularly populated with data from the new global NFL API.
-   The roster management UI correctly prevents users from adding players that would violate the league's defined roster limits.
