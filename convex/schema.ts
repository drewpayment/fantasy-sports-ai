import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Represents user-specific data, extending what Clerk provides.
  userProfiles: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(), // This links the profile to the Clerk user
    // Fields for storing Yahoo OAuth tokens securely
    yahooAccessToken: v.optional(v.string()),
    yahooRefreshToken: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  // Defines a fantasy league, its settings, and its owner.
  leagues: defineTable({
    name: v.string(),
    ownerId: v.id("userProfiles"), // The user who created/owns the league
    // Using v.any() for settings to allow for flexible league rule configurations
    settings: v.any(),
    yahooLeagueId: v.optional(v.string()), // ID from the Yahoo API
  }).index("by_owner", ["ownerId"]),

  // Represents a team within a league.
  teams: defineTable({
    name: v.string(),
    leagueId: v.id("leagues"),
    userId: v.id("userProfiles"), // The user who owns this team
    yahooTeamId: v.optional(v.string()), // ID from the Yahoo API
  })
  .index("by_league", ["leagueId"])
  .index("by_user", ["userId"]),
  
  // A global table of all available players.
  players: defineTable({
    name: v.string(),
    position: v.string(), // e.g., 'QB', 'RB', 'WR'
    nflTeam: v.string(), // e.g., 'Kansas City Chiefs'
    yahooPlayerId: v.optional(v.string()), // ID from the Yahoo API
  }),

  // A join table to represent the roster of players for each team.
  rosters: defineTable({
    teamId: v.id("teams"),
    playerId: v.id("players"),
    position: v.string(), // The position the player holds on the roster (e.g., 'STARTER', 'BENCH')
  })
  .index("by_team", ["teamId"])
  .index("by_player", ["playerId"]),
});
