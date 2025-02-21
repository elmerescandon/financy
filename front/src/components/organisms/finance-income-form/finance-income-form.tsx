"use client";
import { saveEntry, setIncome } from "@/app/actions";
import SmallLoader from "@/components/atoms/small-loader";
import FloatInputForm from "@/components/molecules/float-input-form/float-input-form";
import SelectForm from "@/components/molecules/select-input-form/select-input-form";
import SingleTextInputForm from "@/components/molecules/single-text-input-form/single-text-input-form";
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
import FinanceEntryFormExtra from "../finance-entry-form-extra/finance-entry-form-extra";
import { DateRangeForm } from "@/components/molecules/date-range-form/date-range-form";

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

const FinanceIncomeForm = () => {
    const [state, formAction] = useActionState(setIncome, initialState);
    const [expandOptions, setExpandOptions] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Success",
                description: state.message,
            });
        } else if (state.message || state.errors) {
            toast({
                title: "Error",
                description: state.message,
            });
        }
    }, [state, toast]);

    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-3xl">Set</CardTitle>
                <CardDescription className="max-md:text-base">
                    indicate your income details.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <form action={formAction}>
                    <FloatInputForm
                        label="Income"
                        htmlFor="amount"
                        placeholder="Add your income"
                        error={state.errors?.amount}
                    />
                    <SelectForm
                        label="Frequency"
                        htmlFor="frequency"
                        placeholder="Select a frequency"
                        error={state.errors?.frequency}
                        options={[
                            { key: "weekly", value: "Weekly" },
                            { key: "monthly", value: "Monthly" },
                            { key: "one-time", value: "One-time" },
                        ]}
                    />
                    <DateRangeForm
                        label="Date range"
                        htmlFor="timeRange"
                        error={state.errors?.fromTime || state.errors?.toTime}
                    />
                    <SubmitButton />
                </form>

            </CardContent>
        </Card>
    );
};

export default FinanceIncomeForm;
