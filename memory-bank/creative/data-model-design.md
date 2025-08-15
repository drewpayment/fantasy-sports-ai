# Creative Phase: Data Model Design

🎨🎨🎨 **ENTERING CREATIVE PHASE: Architecture** 🎨🎨🎨

## 1. Component Description

This document outlines the database schema for the Fantasy Sports AI application. The core components of the data model are `UserProfiles`, `Leagues`, `Teams`, `Players`, `Drafts`, and `Advice`. This design will serve as the foundation for all data storage and retrieval operations within the Convex backend.

## 2. Requirements & Constraints

-   **Functional Requirements**:
    -   Must store user profile information that extends the default Clerk user data.
    -   Must link user profiles to their respective leagues and teams.
    -   Must define the structure for leagues, including settings like scoring, roster size, etc.
    -   Must define the structure for teams, including their roster of players.
    -   Must support a one-to-many relationship between a league and its teams.
    -   Must be able to store a global list of all available players.
-   **Technical Constraints**:
    -   The data model must be implemented using Convex's schema definition (`convex/schema.ts`).
    -   It must integrate with Clerk for user authentication, using Clerk user IDs as the source of truth for user identity.
    -   Schema design must consider Convex query patterns and indexing for performance.

## 3. Multiple Options

We will explore two primary approaches for modeling the relationships between our core entities, particularly focusing on how players are associated with teams and how users are associated with leagues.

### Option A: Relational Model using IDs

This approach mimics a traditional relational database where documents are linked by storing the `_id` of a related document.

-   **`UserProfiles`**: Contains a `clerkId` to link to Clerk.
-   **`Leagues`**: Contains a `ownerId` field storing the `_id` of the user profile.
-   **`Teams`**: Contains a `leagueId` and a `userId` field, storing the `_id`s of the league and the user who owns the team.
-   **`Rosters` (New Table)**: A join table containing `teamId`, `playerId`, and `position`.

```ts
// Example Snippet for convex/schema.ts
// ...
  teams: defineTable({
    leagueId: v.id("leagues"),
    userId: v.id("userProfiles"),
    name: v.string(),
    // ... other team details
  }),

  rosters: defineTable({
    teamId: v.id("teams"),
    playerId: v.id("players"),
    position: v.string(), // e.g., 'QB', 'RB'
  }).index("by_team", ["teamId"]),
// ...
```

### Option B: Embedded/Denormalized Model

This approach embeds arrays of IDs or simple objects directly within parent documents to reduce the number of queries needed for common data retrieval patterns.

-   **`UserProfiles`**: Contains `clerkId`.
-   **`Leagues`**: Contains `ownerId` and an array `teamIds` (`v.array(v.id("teams"))`).
-   **`Teams`**: Contains `leagueId`, `userId`, and an array `playerIds` (`v.array(v.id("players"))`). No separate `Rosters` table.

```ts
// Example Snippet for convex/schema.ts
// ...
  teams: defineTable({
    leagueId: v.id("leagues"),
    userId: v.id("userProfiles"),
    name: v.string(),
    playerIds: v.array(v.id("players")),
    // ... other team details
  }),
// ...
```

## 4. Options Analysis

| Criteria                  | Option A: Relational Model                               | Option B: Embedded Model                                   |
| ------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| **Data Integrity**        | High. Single source of truth for relationships.          | Lower. Risk of data duplication or inconsistency.          |
| **Query Complexity**      | Higher. Often requires multiple queries (joins).         | Lower. Can fetch related data in a single query.           |
| **Write/Update Complexity** | Lower. Simple updates to individual documents.           | Higher. Updating nested arrays can be more complex.        |
| **Performance**           | Potentially slower for reads needing joins.              | Faster for reads of a parent and its children.             |
| **Flexibility**           | High. Easy to model many-to-many relationships.          | Moderate. Less flexible for complex relationship queries.  |

## 5. Recommended Approach

**Recommendation: Option A - Relational Model using IDs.**

**Justification**:
While Option B offers performance benefits for simple reads, the complexity of fantasy sports data (trades, waivers, historical data) makes data integrity and flexibility paramount. A relational model is more robust and scalable for the complex interactions we anticipate. The performance cost of joins in Convex is manageable with proper indexing, and this approach avoids the challenges of managing large, embedded arrays. This model provides a stronger foundation for future features.

## 6. Implementation Guidelines

1.  **Schema (`convex/schema.ts`)**:
    -   Create tables: `userProfiles`, `leagues`, `teams`, `players`, and `rosters`.
    -   In `userProfiles`, add `.index("by_clerk_id", ["clerkId"])` to efficiently find users.
    -   In `leagues`, add `.index("by_owner", ["ownerId"])`
    -   In `teams`, add `.index("by_league", ["leagueId"])` and `.index("by_user", ["userId"])`.
    -   In `rosters`, add `.index("by_team", ["teamId"])` and `.index("by_player", ["playerId"])`.
2.  **Convex Functions**:
    -   When fetching a team's roster, query the `rosters` table where `teamId` matches.
    -   When creating a team, ensure it is linked to a valid `leagueId` and `userId`.
    -   User profile creation should be handled in a `getOrCreate` pattern based on the Clerk user.

## 7. Verification Checkpoint

-   [ ] Does the final schema support all functional requirements?
-   [ ] Are all necessary indexes defined for performant queries?
-   [ ] Does the model clearly define the relationship between users, leagues, and teams?
-   [ ] Is the approach scalable for future features like player trades or historical stats?

🎨🎨🎨 **EXITING CREATIVE PHASE** 🎨🎨🎨
