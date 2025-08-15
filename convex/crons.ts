import { cronJobs } from "convex/server";
import { api } from './_generated/api';

const crons = cronJobs();

// Schedule to run every day at midnight.
crons.daily(
  "syncLeagues",
  { 
    hourUTC: 1,
    minuteUTC: 0,
  }, // In UTC
  api.internal_yahoo.syncAllLeagues
);

export default crons;
