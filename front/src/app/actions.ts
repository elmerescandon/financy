"use server";

import { z } from "zod";
import {
  SaveEntryActionResponse,
  SaveEntryFormData,
} from "@/types/save-entry-form";
import { FinancyService } from "@/services/Financy.service";
import { revalidatePath } from "next/cache";

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
  const service = FinancyService.getInstance();
  try {
    const amountString = formData.get("amount") as string;

    const rawData: SaveEntryFormData = {
      amount: parseFloat(amountString || ""),
      type: formData.get("type") as string,
    };

    const validatedData = saveEntrySchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data, please check the form and try again",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const data = await service.saveEntry({
      user_id: "d09bd4f7-e50c-486c-8b04-93c6540f48bb",
      time: new Date().getTime() / 1000,
      amount: validatedData.data.amount,
      type: validatedData.data.type,
    });

    revalidatePath("/view");
    return {
      success: true,
      message: data.message || "Address saved successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}
