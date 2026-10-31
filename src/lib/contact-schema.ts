import { z } from "zod";

export const CONTACT_NEEDS = [
  "site",
  "agents",
  "audit",
  "fde",
  "other",
] as const;
export const CONTACT_BUDGETS = [
  "under3k",
  "from3to10k",
  "from10to30k",
  "over30k",
  "unknown",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  company: z.string().trim().max(120).optional(),
  need: z.enum(CONTACT_NEEDS),
  budget: z.enum(CONTACT_BUDGETS).optional(),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(),
  consent: z.literal("on"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Record<string, string>;
  message?: string;
};
