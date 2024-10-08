import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const clear = mutation({
    args: {
        id: v.id("scamreportsreview"),
        imagestoreid: v.optional(v.id("imagestore")),
        storageid: v.optional(v.string()),
    },
    handler: async (ctx: any, args: { id: string; storageid?: string; imagestoreid?: string }) => {
        try {
            const { id, storageid, imagestoreid } = args;

            await ctx.db.delete(id);
            if (imagestoreid) {
                await ctx.db.delete(imagestoreid);
            }
            if (storageid) {
                await ctx.storage.delete(storageid);
            }
        } catch (error) {
            console.error("Error in clear mutation:", error);
            throw new Error("An error occurred while trying to clear the image");
        }
    },
});
export const update = mutation({
    args: {
        id: v.id("scamreportsreview"),
        staffnotes: v.string(),
    },
    handler: async (ctx: any, args: { id: string; staffnotes: string }) => {
        try {
            const { id, staffnotes } = args;
            console.log("Updating scam report with id:", id);

            // Assuming the correct method is `patch` instead of `update`
            return await ctx.db.patch(id, { staffnotes });
        } catch (error) {
            console.error("Error in update mutation:", error);
            throw new Error("An error occurred while trying to update the scam report");
        }
    }
});
export const reviewerupdater = mutation({
    args: {
        id: v.id("scamreportsreview"),
        reviewer: v.any(),
        status: v.string(),
    },
    handler: async (ctx: any, args: { id: string; reviewer: any; status: any }) => {
        try {
            const { id, reviewer, status } = args;
            console.log("Updating scam report with id:", id);

            return await ctx.db.patch(id, { reviewer, status });
        } catch (error) {
            console.error("Error in reviewerupdater mutation:", error);
            throw new Error("An error occurred while trying to update the scam report");
        }
    }
});