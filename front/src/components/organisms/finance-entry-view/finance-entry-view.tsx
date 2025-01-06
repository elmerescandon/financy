import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FinancyService } from "@/services/Financy.service";
import React from "react";
import { columns } from "../expenses-table/columns";
import { ExpensesTable } from "../expenses-table/expenses-table";

const FinanceEntryView = async () => {
  try {
    const service = FinancyService.getInstance();
    const response = await service.getEntries(
      "d09bd4f7-e50c-486c-8b04-93c6540f48bb"
    );

    if (!response.entries)
      throw new Error("An error occurred while fetching entries");

    return (
      <Card className="border-none shadow-none w-full">
        <CardHeader>
          <CardTitle className="text-3xl">View</CardTitle>
          <CardDescription>all your last expenses.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <ExpensesTable columns={columns} data={response.entries} />
        </CardContent>
      </Card>
    );
  } catch (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add</CardTitle>
          <CardDescription>
            your expense to keep track of your finances
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-red-500">{(error as Error).message}</div>
        </CardContent>
      </Card>
    );
  }
};

export default FinanceEntryView;
