/**
 * Type definitions for the data structures returned by the Yahoo Fantasy Sports API.
 */

export type YahooLeague = {
  league_key: string;
  name: string;
  // Add other league properties as needed
};

export type YahooTeam = {
  team: [
    [
      { team_key: string },
      { name: string },
      // ... other team properties can be added here
    ]
  ];
};
