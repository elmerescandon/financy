"use server";

import { z } from "zod";
import {
  SaveEntryActionResponse,
  SaveEntryFormData,
} from "@/types/save-entry-form";

const saveEntrySchema = z.object({
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
});

export async function saveEntry(
  prevState: SaveEntryActionResponse | null,
  formData: FormData
): Promise<SaveEntryActionResponse> {
  try {
    const amountString = formData.get("amount") as string;

    const rawData: SaveEntryFormData = {
      amount: parseFloat(amountString || ""),
      type: formData.get("type") as string,
    };

    // Validate the form data
    const validatedData = saveEntrySchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data, please check the form and try again",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    // Here you would typically save the address to your database

    return {
      success: true,
      message: "Address saved successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
