"use server";

import {
  SaveEntryActionResponse,
  SaveEntryFormData,
} from "@/types/save-entry-form";
import { FinancyService } from "@/services/Financy.service";
import { revalidatePath } from "next/cache";
import { saveEntrySchema } from "@/utils/actions/save-entry";
import { SetIncomeActionResponse, SetIncomeFormData } from "@/types/set-income-form";
import { time } from "node:console";
import { setIncomeSchema } from "@/utils/actions/set-income";

export async function saveEntry(
  prevState: SaveEntryActionResponse | null,
  formData: FormData
): Promise<SaveEntryActionResponse> {
  const service = FinancyService.getInstance();
  try {
    const amountString = formData.get("amount") as string;
    const timeString = formData.get("time") as string | null;
    const noteString = formData.get("note") as string | undefined;
    const rawData: SaveEntryFormData = {
      amount: parseFloat(amountString || ""),
      type: formData.get("type") as string,
      time: timeString ? parseFloat(timeString.toString() || "") / 1000 : +Date.now() / 1000,
      finance_type: "expense",
      note: noteString,
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
      time: validatedData.data.time,
      amount: validatedData.data.amount,
      type: validatedData.data.type,
      finance_type: "expense",
      note: validatedData.data.note,
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


export async function setIncome(
  prevState: SetIncomeActionResponse | null,
  formData: FormData
): Promise<SetIncomeActionResponse> {
  const service = FinancyService.getInstance();
  try {
    const amountString = formData.get("amount") as string;
    const timeRangeString = formData.get("timeRange") as string | null;
    const frequencyString = formData.get("frequency") as string;

    // ! Is this possible that this handler do not appear in the form error?
    if (!timeRangeString) throw new Error("Invalid time range");
    const [fromTimeString, toTimeString] = timeRangeString.split("-");

    const rawData: SetIncomeFormData = {
      amount: parseFloat(amountString || ""),
      frequency: frequencyString,
      fromTime: parseFloat(fromTimeString),
      toTime: parseFloat(toTimeString),
      finance_type: "income",
    };

    const validatedData = setIncomeSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data, please check the form and try again",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }
    console.log(validatedData.data);
    const data = await service.setIncome({
      user_id: "d09bd4f7-e50c-486c-8b04-93c6540f48bb",
      fromTime: validatedData.data.fromTime / 1000,
      toTime: validatedData.data.toTime / 1000,
      amount: validatedData.data.amount,
      frequency: validatedData.data.frequency,
      finance_type: "income",
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
