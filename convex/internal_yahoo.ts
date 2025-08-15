import { internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { YahooTeam } from "./yahoo_types";
import { api } from "./_generated/api";

/**
 * Internal mutation to save a league and its teams imported from Yahoo.
 */
export const saveImportedLeague = internalMutation({
  args: {
    userId: v.id("userProfiles"),
    leagueName: v.string(),
    leagueKey: v.string(),
    teams: v.array(v.any()), // Keep as v.any() for the mutation argument
  },
  handler: async (ctx, { userId, leagueName, leagueKey, teams }) => {
    const leagueId = await ctx.db.insert("leagues", {
      name: leagueName,
      ownerId: userId,
      settings: {},
      yahooLeagueId: leagueKey,
    });

    for (const team of teams as YahooTeam[]) {
      const teamData = team.team[0];
      const yahooTeamKey = teamData.find(item => "team_key" in item)?.team_key;
      const yahooTeamName = teamData.find(item => "name" in item)?.name;

      if (yahooTeamKey && yahooTeamName) {
        await ctx.db.insert("teams", {
          name: yahooTeamName,
          leagueId: leagueId,
          userId: userId,
          yahooTeamId: yahooTeamKey,
        });
      }
    }
  },
});

/**
 * Internal action to sync all leagues for all connected users.
 * This is triggered by a cron job.
 */
export const syncAllLeagues = internalAction({
  handler: async (ctx) => {
    const users = await ctx.runQuery(api.users.getConnectedUsers);

    for (const user of users) {
      console.log(`Syncing leagues for user ${user.name}...`);
      
      const importedLeagues = await ctx.runQuery(api.leagues.getImportedLeaguesForUser, { userId: user._id });

      for (const league of importedLeagues) {
        if (league.yahooLeagueId) {
          const yahooTeams = await ctx.runAction(api.yahoo.getTeams, {
            clerkId: user.clerkId,
            leagueKey: league.yahooLeagueId,
          });

          const currentTeams = await ctx.runQuery(api.teams.getTeamsForLeague, { leagueId: league._id });

          for (const yahooTeam of yahooTeams) {
            const teamData = yahooTeam.team[0];
            const yahooTeamKey = teamData.find(item => "team_key" in item)?.team_key;
            const yahooTeamName = teamData.find(item => "name" in item)?.name;

            if (yahooTeamKey && yahooTeamName) {
              const matchingTeam = currentTeams.find(t => t.yahooTeamId === yahooTeamKey);
              
              if (matchingTeam && matchingTeam.name !== yahooTeamName) {
                await ctx.runMutation(api.teams.updateTeamName, {
                  teamId: matchingTeam._id,
                  newName: yahooTeamName,
                });
              }
            }
          }
        }
      }
    }
  },
});
