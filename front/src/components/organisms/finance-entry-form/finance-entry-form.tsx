"use client";
import { saveEntry } from "@/app/actions";
import SmallLoader from "@/components/atoms/small-loader";
import { DateTimePicker } from "@/components/molecules/date-input-form/date-input-form";
import FloatInputForm from "@/components/molecules/float-input-form/float-input-form";
import SelectForm from "@/components/molecules/select-input-form/select-input-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SaveEntryActionResponse } from "@/types/save-entry-form";
import React, { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const initialState: SaveEntryActionResponse = {
  success: false,
  message: "",
};

function SubmitButton() {
  "use client";
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={`${pending ? "bg-gray-400" : ""
        } max-md:w-full max-md:py-6 max-md:text-base max-md:mt-2 min-w-[10rem]`}
    >
      {pending ? <SmallLoader /> : "Save expense"}
    </Button>
  );
}

const FinanceEntryForm = () => {
  const [state, formAction] = useActionState(saveEntry, initialState);
  const [optional, setOptional] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success",
        description: state.message,
      });
    } else if (state.message || state.errors) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-3xl">Add</CardTitle>
        <CardDescription className="max-md:text-base">
          your expense to keep track of your finances
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form action={formAction}>
          <FloatInputForm
            label="Amount"
            htmlFor="amount"
            placeholder="Add your expense"
            error={state.errors?.amount}
          />
          <SelectForm
            label="Type"
            htmlFor="type"
            placeholder="Select a type"
            error={state.errors?.type}
          />
          <div className="mb-4">
            {!showDate && (
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => setShowDate(true)}
                className="text-sm text-gray-800 min-w-[10rem]"
              >
                Add date
              </Button>
            )}
            {showDate && (
              <DateTimePicker
                label="Date"
                htmlFor="time"
                error={state.errors?.time}
              />
            )}
          </div>
          <SubmitButton />
        </form>
        {optional && (
          <FloatInputForm
            label="Description"
            htmlFor="description"
            placeholder="Add a description"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FinanceEntryForm;
