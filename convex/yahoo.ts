import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { YahooLeague, YahooTeam } from "./yahoo_types";

/**
 * Action to generate the Yahoo OAuth authorization URL.
 * This URL is the first step in the OAuth flow, where the user grants
 * our application permission to access their fantasy sports data.
 */
export const getAuthorizationUrl = action({
  args: {},
  handler: async () => {
    const clientId = process.env.YAHOO_CLIENT_ID;
    if (!clientId) {
      throw new Error("Yahoo Client ID not set in environment variables.");
    }

    const redirectUri = process.env.YAHOO_REDIRECT_URI + "/auth/yahoo/callback";

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      language: "en-us",
    });

    return `https://api.login.yahoo.com/oauth2/request_auth?${params.toString()}`;
  },
});

/**
 * Action to handle the OAuth callback from Yahoo.
 * It exchanges the authorization code for an access token and refresh token,
 * then calls an internal mutation to store them.
 */
export const handleCallback = action({
  args: { code: v.string(), clerkId: v.string() },
  handler: async (ctx, { code, clerkId }) => {
    const clientId = process.env.YAHOO_CLIENT_ID;
    const clientSecret = process.env.YAHOO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Yahoo client credentials not set.");
    }

    const redirectUri = process.env.CONVEX_SITE_URL + "/auth/yahoo/callback";

    const response = await fetch("https://api.login.yahoo.com/oauth2/get_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for token.");
    }

    const data = await response.json();
    const { access_token, refresh_token } = data;

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  },
});

/**
 * Fetches the user's fantasy football leagues from the Yahoo API.
 */
export const getLeagues = action({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }): Promise<YahooLeague[]> => {
    const user = await ctx.runQuery(api.users.getUserByClerkId, { clerkId });

    if (!user || !user.yahooAccessToken) {
      throw new Error("Yahoo account not connected.");
    }

    const response = await fetch(
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nfl/leagues?format=json",
      {
        headers: {
          Authorization: `Bearer ${user.yahooAccessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leagues from Yahoo.");
    }

    const data = await response.json();
    return data.fantasy_content.users[0].user[1].games[0].game[1].leagues;
  },
});

/**
 * Fetches the teams for a specific league from the Yahoo API.
 */
export const getTeams = action({
  args: { leagueKey: v.string(), clerkId: v.string() },
  handler: async (ctx, { leagueKey, clerkId }): Promise<YahooTeam[]> => {
    const user = await ctx.runQuery(api.users.getUserByClerkId, { clerkId });

    if (!user || !user.yahooAccessToken) {
      throw new Error("Yahoo account not connected.");
    }

    const response = await fetch(
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams?format=json`,
      {
        headers: {
          Authorization: `Bearer ${user.yahooAccessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch teams from Yahoo.");
    }

    const data = await response.json();
    return data.fantasy_content.league[1].teams;
  },
});

/**
 * Imports a selected league, its teams, and roster into the Convex database.
 */
export const importLeague = action({
  args: { leagueKey: v.string(), leagueName: v.string(), clerkId: v.string() },
  handler: async (ctx, { leagueKey, leagueName, clerkId }) => {
    // Fetch teams for the league
    const teams = await ctx.runAction(api.yahoo.getTeams, { leagueKey, clerkId });

    // Get the user's profile ID
    const user = await ctx.runQuery(api.users.getUserByClerkId, { clerkId });
    if (!user) {
      throw new Error("User profile not found.");
    }

    // Call an internal mutation to perform the database operations
    await ctx.runMutation(api.internal_yahoo.saveImportedLeague, {
      userId: user._id,
      leagueName: leagueName,
      leagueKey: leagueKey,
      teams: teams,
    });
  },
});