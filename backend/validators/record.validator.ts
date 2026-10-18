import { z } from "zod";

export const createRecordSchema = z.object({
  body: z.object({
    type: z.enum(["lent", "borrowed"]),
    personName: z.string().min(1),
    amount: z.number().positive(),
    reason: z.string().min(1),
    date: z.string().or(z.date()),
  }),
});

export const updateRecordSchema = z.object({
  body: z.object({
    personName: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    reason: z.string().min(1).optional(),
    date: z.string().or(z.date()).optional(),
    repaidAmount: z.number().min(0).optional(),
  }),
});

export const repaySchema = z.object({
  body: z.object({
    amount: z.number().positive(),
  }),
});