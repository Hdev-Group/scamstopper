import { v, Validator } from "convex/values";
import { query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { QueryCtx, MutationCtx, ActionCtx, DatabaseReader, DatabaseWriter } from "./_generated/server";

export const getter = query({
    // get from scamreportsreview table
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("scamreportsreview").collect();
    },
})
