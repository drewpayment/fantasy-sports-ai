import { query } from "./_generated/server";

/**
 * Fetches all players from the database.
 */
export const getPlayers = query({
  handler: async (ctx) => {
    return ctx.db.query("players").collect();
  },
});
