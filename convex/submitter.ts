import { mutation, query } from "./_generated/server";
import { v, Validator } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: { storageId: v.string(), author: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db.insert("imagestore", {
      body: args.storageId,
      author: args.author,
      format: "image",
    });
    return results;
  },
});

export const list = query({
  args: {body: v.any() },
  handler: async (ctx, { body }) => {
    // Check if body exists in "imagestore"
    const messages = await ctx.db.query("imagestore").filter((q) => q.eq(q.field("body"), body)).collect(); 
    return Promise.all(
      messages.map(async (message) => {
        // Check if format is "image" and get the Url
        if (message.format === "image") {
          const imageUrl = await ctx.storage.getUrl(message.body);

          return {
            ...message,
            url: imageUrl,
          };
        }
        return message;
      }),
    );
  },
});


export const addScamForm = mutation({
    args: {
        selectedCategory: v.optional(v.string()),
        selectedSubcategory: v.optional(v.string()),
        customCategory: v.optional(v.string()),
        description: v.optional(v.string()),
        phone: v.optional(v.string()),
        impersonate: v.optional(v.string()),
        email: v.optional(v.string()),
        financialLoss: v.optional(v.string()),
        investmentType: v.optional(v.string()),
        accountType: v.optional(v.string()),
        accessDate: v.optional(v.string()),
        websiteUrl: v.optional(v.string()),
        onlinePlatform: v.optional(v.string()),
        charityName: v.optional(v.string()),
        donationAmount: v.optional(v.string()),
        productName: v.optional(v.string()),
        healthClaim: v.optional(v.string()),
        loanType: v.optional(v.string()),
        lenderName: v.optional(v.string()),
        subscriptionService: v.optional(v.string()),
        hiddenFees: v.optional(v.string()),
        destination: v.optional(v.string()),
        travelAgency: v.optional(v.string()),
        status: v.optional(v.string()),
        reviewer: v.optional(v.any()),
        proof: v.optional(v.string()),
        userdetails: v.optional(v.array(v.object({
          email: v.optional(v.string()),
          firstName: v.optional(v.string()),
          lastName: v.optional(v.string()),
          id: v.optional(v.string()),
        }))),
    },
    handler: async (ctx, {selectedCategory, proof, loanType, lenderName, subscriptionService, selectedSubcategory, customCategory, description, phone, impersonate, email, financialLoss, investmentType,accountType,accessDate,websiteUrl, onlinePlatform, charityName, donationAmount, destination, productName, healthClaim, hiddenFees, travelAgency, status, reviewer, userdetails}) => {
        const report = {
            selectedCategory,
            selectedSubcategory,
            customCategory,
            description,
            phone,
            impersonate,
            email,
            financialLoss,
            investmentType,
            accountType,
            accessDate,
            websiteUrl,
            onlinePlatform,
            charityName,
            donationAmount,
            productName,
            healthClaim,
            loanType,
            lenderName,
            subscriptionService,
            hiddenFees,
            proof,
            destination,
            travelAgency,
            status: 'pending',
            reviewer: null,
            userdetails,
            lastupdated: new Date().toISOString(),
        };
    
        // Insert the task and return it
        const insertedReport = await ctx.db.insert("scamreportsreview", report);
        return insertedReport;
      },
    }); 