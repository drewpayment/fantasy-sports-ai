import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Adds a player to a team's roster, enforcing league settings for position limits.
 */
export const addPlayerToRoster = mutation({
  args: {
    playerId: v.id("players"),
    teamId: v.id("teams"),
  },
  handler: async (ctx, { playerId, teamId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const player = await ctx.db.get(playerId);
    if (!player) {
      throw new Error("Player not found");
    }

    const team = await ctx.db.get(teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    const league = await ctx.db.get(team.leagueId);
    if (!league || !league.settings) {
      throw new Error("League or league settings not found");
    }

    const rosterSettings = league.settings.roster;
    if (!rosterSettings) {
        throw new Error("Roster settings for this league are not configured.");
    }

    const playerPosition = player.position;
    const positionLimit = rosterSettings[playerPosition] || 0;

    const currentRoster = await ctx.db
      .query("rosters")
      .withIndex("by_team", (q) => q.eq("teamId", teamId))
      .collect();

    const playersInPosition = await Promise.all(
        currentRoster.map(r => ctx.db.get(r.playerId))
    );

    const positionCount = playersInPosition.filter(p => p && p.position === playerPosition).length;

    if (positionCount >= positionLimit) {
      throw new Error(`Cannot add player. You already have ${positionCount}/${positionLimit} players at the ${playerPosition} position.`);
    }

    // Add player to roster
    await ctx.db.insert("rosters", {
      teamId,
      playerId,
      position: "BENCH", // Default to BENCH for now
    });

    return { success: true };
  },
});
