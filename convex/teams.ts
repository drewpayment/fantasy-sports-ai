import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Creates a new team in a specified league.
 * Only authenticated users can create teams.
 */
export const createTeam = mutation({
  args: {
    name: v.string(),
    leagueId: v.id("leagues"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User profile not found");
    }

    const teamId = await ctx.db.insert("teams", {
      name: args.name,
      leagueId: args.leagueId,
      userId: user._id,
    });

    return teamId;
  },
});

/**
 * Fetches all teams belonging to a specific league.
 */
export const getTeamsForLeague = query({
  args: { leagueId: v.id("leagues") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("teams")
      .withIndex("by_league", (q) => q.eq("leagueId", args.leagueId))
      .collect();
  },
});

/**
 * Updates the name of a specific team.
 */
export const updateTeamName = mutation({
  args: {
    teamId: v.id("teams"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.teamId, { name: args.newName });
  },
});
