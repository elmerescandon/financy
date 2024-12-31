import { z } from "zod";

export const formSchema = z.object({
  amount: z.coerce
    .number()
    .positive({
      message: "The field must be a number or non-negative.",
    })
    .multipleOf(0.01, {
      message: "Only two decimal places are allowed.",
    }),
  type: z.string().nonempty({
    message: "The field must not be empty.",
  }),
});
