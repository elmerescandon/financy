import { z } from "zod";

export const setIncomeSchema = z.object({
    amount: z
        .number({
            invalid_type_error: "Please provide a valid number",
        })
        .nonnegative({
            message: "Amount must be a positive number",
        }),
    frequency: z // Equals to the type in expenses
        .string({
            message: "Please select a frequency",
        })
        .nonempty({
            message: "Please select a frequency",
        }),
    fromTime: z.number({
        invalid_type_error: "Invalid from time format",
    }),
    toTime: z.number({
        invalid_type_error: "Invalid to time format",
    }),
    finance_type: z.string({
        message: "Invalid finance type",
    })
});