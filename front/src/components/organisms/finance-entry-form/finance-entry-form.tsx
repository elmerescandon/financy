"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React from "react";
import FloatInputForm from "@/components/molecules/float-input-form/float-input-form";
import SelectForm from "@/components/molecules/select-input-form/select-input-form";

const FinanceEntryForm = () => {
  return (
    <Form>
      <form className="space-y-8">
        <FloatInputForm
          formName="amount"
          formControl={form.control}
          label="Amount"
          description=""
          placeholder="Enter amount"
        />
        <SelectForm
          formName="type"
          formControl={form.control}
          label="Type"
          description=""
          placeholder="Select type."
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default FinanceEntryForm;
