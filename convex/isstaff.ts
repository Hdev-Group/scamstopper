import { query } from "./_generated/server";
import { v, Validator } from "convex/values";
import { Id } from './_generated/dataModel';

export const get = query({
    args: {
        userId: v.any(),
    },
    handler: async (ctx, { userId }) => {
        const user = await ctx.db.get(`users/${userId}` as Id<"users">);
        return user?.role
    },
})