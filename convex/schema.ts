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
    fullName: v.string(), // Full name of the player
    position: v.optional(v.string()), // e.g., 'QB', 'RB', 'WR'
    team: v.optional(v.string()), // e.g., 'KC' for Kansas City Chiefs
    hashtag: v.string(),
    depth_chart_position: v.number(),
    status: v.string(),
    sport: v.string(),
    fantasy_positions: v.array(v.string()),
    number: v.number(),
    search_last_name: v.string(),
    injury_start_date: v.optional(v.string()),
    weight: v.string(),
    practice_participation: v.optional(v.string()),
    sportradar_id: v.optional(v.string()),
    last_name: v.string(),
    college: v.string(),
    fantasy_data_id: v.number(),
    injury_status: v.optional(v.string()),
    player_id: v.string(),
    height: v.string(),
    search_full_name: v.string(),
    age: v.number(),
    stats_id: v.optional(v.string()),
    birth_country: v.optional(v.string()),
    espn_id: v.string(),
    search_rank: v.number(),
    first_name: v.string(),
    depth_chart_order: v.number(),
    years_exp: v.number(),
    rotowire_id: v.optional(v.string()),
    rotoworld_id: v.optional(v.number()),
    search_first_name: v.string(),
    yahoo_id: v.optional(v.string()),
  }).index("by_yahooPlayerId", ["yahoo_id"]),

  // A join table to represent the roster of players for each team.
  rosters: defineTable({
    teamId: v.id("teams"),
    playerId: v.id("players"),
    position: v.string(), // The position the player holds on the roster (e.g., 'STARTER', 'BENCH')
  })
  .index("by_team", ["teamId"])
  .index("by_player", ["playerId"]),
});
