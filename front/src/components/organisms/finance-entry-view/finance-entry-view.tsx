import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const FinanceEntryView = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add</CardTitle>
        <CardDescription>
          your expense to keep track of your finances
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2"></CardContent>
    </Card>
  );
};

export default FinanceEntryView;
