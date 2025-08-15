import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Creates a new user profile or returns an existing one based on the Clerk user ID.
 * This function is essential for linking Clerk authentication with the app's user data.
 */
export const getOrCreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called getOrCreateUser without a user present");
    }

    // Check if the user already exists
    const user = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user !== null) {
      return user._id;
    }

    // If the user doesn't exist, create a new one
    return await ctx.db.insert("userProfiles", {
      name: identity.name!,
      email: identity.email!,
      clerkId: identity.subject,
    });
  },
});

/**
 * Retrieves a user profile by their Clerk ID.
 */
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
  },
});

/**
 * Stores the Yahoo OAuth tokens for the currently authenticated user.
 */
export const storeYahooTokens = mutation({
  args: {
    accessToken: v.string(),
    refreshToken: v.string(),
  },
  handler: async (ctx, { accessToken, refreshToken }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated.");
    }

    const user = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User profile not found.");
    }

    await ctx.db.patch(user._id, {
      yahooAccessToken: accessToken,
      yahooRefreshToken: refreshToken,
    });
  },
});

/**
 * Retrieves all user profiles that have a Yahoo account connected.
 */
export const getConnectedUsers = query({
  handler: async (ctx) => {
    return ctx.db
      .query("userProfiles")
      .filter((q) => q.neq(q.field("yahooAccessToken"), undefined))
      .collect();
  },
});
