import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FinanceEntryForm from "../organisms/finance-entry-form/finance-entry-form";
import FinanceEntryView from "../organisms/finance-entry-view/finance-entry-view";

const FinanceTemplate = () => {
  return (
    <Tabs defaultValue="add" className="w-[400px]">
      <TabsList className="w-full grid-cols-2 grid">
        <TabsTrigger value="add">Add</TabsTrigger>
        <TabsTrigger value="view">View</TabsTrigger>
      </TabsList>
      <TabsContent value="add">
        <FinanceEntryForm />
      </TabsContent>
      <TabsContent value="view">
        <FinanceEntryView />
      </TabsContent>
    </Tabs>
  );
};

export default FinanceTemplate;
