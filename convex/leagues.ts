import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Creates a new fantasy league.
 * Only authenticated users can create leagues.
 */
export const createLeague = mutation({
  args: {
    name: v.string(),
    settings: v.any(), // Flexible settings for different league types
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

    const leagueId = await ctx.db.insert("leagues", {
      name: args.name,
      ownerId: user._id,
      settings: args.settings,
    });

    return leagueId;
  },
});

/**
 * Fetches all leagues owned by the currently authenticated user.
 */
export const getLeaguesForUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    return ctx.db
      .query("leagues")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

/**
 * Fetches a specific league by its ID.
 */
export const getLeagueById = query({
  args: { leagueId: v.id("leagues") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.leagueId);
  },
});

/**
 * Updates the settings of a specific league.
 * Only the league owner can update the settings.
 */
export const updateLeagueSettings = mutation({
  args: {
    leagueId: v.id("leagues"),
    settings: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const league = await ctx.db.get(args.leagueId);
    if (!league) {
      throw new Error("League not found");
    }

    const user = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || user._id !== league.ownerId) {
      throw new Error("Only the league owner can update settings");
    }

    await ctx.db.patch(args.leagueId, {
      settings: args.settings,
    });
  },
});

/**
 * Fetches all imported leagues for a specific user.
 */
export const getImportedLeaguesForUser = query({
  args: { userId: v.id("userProfiles") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("leagues")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.userId))
      .filter((q) => q.neq(q.field("yahooLeagueId"), undefined))
      .collect();
  },
});
