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
import type * as lib_createLinkWorkflow from "../lib/createLinkWorkflow.js";
import type * as lib_fetchPageTitle from "../lib/fetchPageTitle.js";
import type * as lib_fetchRawPageTitle from "../lib/fetchRawPageTitle.js";
import type * as linkActions from "../linkActions.js";
import type * as links from "../links.js";
import type * as tags from "../tags.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "lib/createLinkWorkflow": typeof lib_createLinkWorkflow;
  "lib/fetchPageTitle": typeof lib_fetchPageTitle;
  "lib/fetchRawPageTitle": typeof lib_fetchRawPageTitle;
  linkActions: typeof linkActions;
  links: typeof links;
  tags: typeof tags;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
