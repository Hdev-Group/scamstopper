import { v, Validator } from "convex/values";
import { query } from "./_generated/server";

  export const getter = query({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
      return await ctx.db
        .query("users")
        .withIndex("byuserId", (q) => q.eq("userId", userId))
        .collect();
    },
  });