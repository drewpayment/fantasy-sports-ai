/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as crons from "../crons.js";
import type * as internal_yahoo from "../internal_yahoo.js";
import type * as leagues from "../leagues.js";
import type * as messages from "../messages.js";
import type * as players from "../players.js";
import type * as teams from "../teams.js";
import type * as users from "../users.js";
import type * as yahoo from "../yahoo.js";
import type * as yahoo_types from "../yahoo_types.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  crons: typeof crons;
  internal_yahoo: typeof internal_yahoo;
  leagues: typeof leagues;
  messages: typeof messages;
  players: typeof players;
  teams: typeof teams;
  users: typeof users;
  yahoo: typeof yahoo;
  yahoo_types: typeof yahoo_types;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
