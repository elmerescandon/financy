import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";

type FloatInputFormProps = {
  label: string;
  description: string;
  placeholder: string;
  formName: string;
  formControl: any;
};

const FloatInputForm = ({
  label,
  description,
  placeholder,
  formName,
  formControl,
}: FloatInputFormProps) => {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              inputMode="decimal"
              placeholder={placeholder}
              step="0.1"
              {...field}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FloatInputForm;
