import { cronJobs } from "convex/server";
import { api } from './_generated/api';

const crons = cronJobs();

// Schedule to run every day at midnight UTC to sync Yahoo leagues.
crons.daily(
  "syncYahooLeagues",
  { 
    hourUTC: 1,
    minuteUTC: 0,
  },
  api.internal_yahoo.syncAllLeagues
);

// Schedule to run every day at 2 AM UTC to sync player data from Sleeper.
crons.daily(
  "syncSleeperPlayers",
  {
    hourUTC: 2,
    minuteUTC: 0,
  },
  api.players.fetchPlayersFromSleeper
);

export default crons;
