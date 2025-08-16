import { action, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import type { SleeperPlayer } from '@/types/sleeper-player';
import schema from './schema';

/**
 * Fetches all players from the database with pagination.
 */
export const getPlayers = query({
  args: { paginationOpts: v.any() }, // Enforce pagination options
  handler: async (ctx, args) => {
    return ctx.db
      .query("players")
      .order("asc")
      .paginate(args.paginationOpts);
  },
});

/**
 * Internal mutation to store players in the database.
 * This will update existing players or insert new ones.
 */
export const storePlayers = internalMutation({
  args: { players: v.array(schema.tables.players.validator) }, // Accepting any player structure for now
  handler: async (ctx, { players }) => {
    for (const player of players) {
      // We need a unique identifier from the API to upsert on.
      // Sleeper uses 'player_id'.
      if (player.player_id) {
        const existingPlayer = await ctx.db
          .query("players")
          .withIndex("by_yahooPlayerId", (q) =>
            q.eq("yahoo_id", player.player_id)
          )
          .unique();

        if (existingPlayer) {
          // Update the player if they already exist
          await ctx.db.patch(existingPlayer._id, {
            fullName: `${player.first_name} ${player.last_name}`,
            team: player.team ?? undefined, // Handle null team for free agents
            position: player.position,
            // Add other fields as needed
          });
        } else {
          // Insert the player if they don't exist
          await ctx.db.insert("players", {
            fullName: `${player.first_name} ${player.last_name}`,
            team: player.team, // Handle null team for free agents
            position: player.position,
            // Add other fields as needed
            hashtag: player.hashtag,
            depth_chart_position: player.depth_chart_position,
            status: player.status,
            sport: player.sport,
            fantasy_positions: player.fantasy_positions,
            number: player.number,
            search_last_name: player.search_last_name,
            injury_start_date: player.injury_start_date,
            weight: player.weight,
            practice_participation: player.practice_participation,
            sportradar_id: player.sportradar_id,
            last_name: player.last_name,
            college: player.college,
            fantasy_data_id: player.fantasy_data_id,
            injury_status: player.injury_status,
            player_id: player.player_id,
            height: player.height,
            search_full_name: player.search_full_name,
            age: player.age,
            stats_id: player.stats_id,
            birth_country: player.birth_country || '',
            espn_id: player.espn_id,
            search_rank: player.search_rank,
            first_name: player.first_name,
            depth_chart_order: player.depth_chart_order,
            years_exp: player.years_exp,
            rotowire_id: player.rotowire_id,
            rotoworld_id: player.rotoworld_id,
            search_first_name: player.search_first_name,
            yahoo_id: player.yahoo_id,
          });
        }
      }
    }
  },
});

/**
 * Action to fetch players from the Sleeper API.
 */
export const fetchPlayersFromSleeper = action({
  handler: async (ctx) => {
    const response = await fetch("https://api.sleeper.app/v1/players/nfl");
    const players = await response.json();

    // The response is a large object with player IDs as keys. We need the values.
    const playerArray = Object.values(players) as SleeperPlayer[];

    // We'll process these in chunks to avoid overwhelming the system.
    const chunkSize = 100;
    for (let i = 0; i < playerArray.length; i += chunkSize) {
      const chunk = playerArray.slice(i, i + chunkSize);
      // Use the internal mutation to store the players
      await ctx.runMutation(internal.players.storePlayers, { players: chunk });
    }
  },
});
