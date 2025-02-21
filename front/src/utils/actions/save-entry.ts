import { z } from "zod";

export const saveEntrySchema = z.object({
    amount: z
        .number({
            invalid_type_error: "Please provide a valid number",
        })
        .nonnegative({
            message: "Amount must be a positive number",
        }),
    type: z
        .string({
            message: "Please select a type",
        })
        .nonempty({
            message: "Please select a type",
        }),
    time: z.number({
        invalid_type_error: "Invalid time format",
    }),
    finance_type: z.string({
        message: "Invalid finance type",
    }),
    note: z.string().nullable().optional(),
});