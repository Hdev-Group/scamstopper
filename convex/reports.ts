import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const clear = mutation({
    args: {
        id: v.id("scamreportsreview"),
        imagestoreid: v.id("imagestore"),
        storageid: v.string(),
    },
    handler: async (ctx: any, args: { id: string; storageid: string; imagestoreid: string }) => {
        try {
            const { id, storageid, imagestoreid } = args;

            console.log("Clearing scam report with id:", id);
            console.log("Clearing imagestore with id:", imagestoreid);

            await ctx.db.delete(id);
            await ctx.db.delete(imagestoreid);
            return await ctx.storage.delete(storageid);
        } catch (error) {
            console.error("Error in clear mutation:", error);
            throw new Error("An error occurred while trying to clear the image");
        }
    },
});
