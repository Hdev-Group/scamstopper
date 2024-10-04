import { time } from "console";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { act } from "react";

export default defineSchema({
    users: defineTable({
      userId: v.string(),
      role: v.string(),
      updatedAt: v.string(),
    }).index("byuserId", ["userId"]),
    
    scamreportsreview: defineTable({
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
      proof: v.optional(v.any()),
      userdetails: v.optional(v.array(v.object({
        email: v.optional(v.string()),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        id: v.optional(v.string()),
      }))),
      lastupdated: v.optional(v.string()), 
    }),
    imagestore: defineTable({
      body: v.optional(v.any()),
      author: v.string(),
      format: v.string(),
    }).index("byauthor", ["author"]),
  });
  