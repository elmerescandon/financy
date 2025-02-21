import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { financeOptions } from "@/lib/constants";
import React from "react";

type SelectFormProps = {
  label: string;
  placeholder: string;
  htmlFor: string;
  error?: string[];
  options: { key: string; value: string }[];
};

const SelectForm = ({
  label,
  placeholder,
  htmlFor,
  error,
  options,
}: SelectFormProps) => {
  return (
    <div className="mb-4 flex w-full flex-col gap-2">
      <Label htmlFor={htmlFor} className="font-semibold max-md:text-base">
        {label}
      </Label>
      <Select name={htmlFor}>
        <SelectTrigger
          form=""
          name={htmlFor}
          id={htmlFor}
          className="max-md:py-6 max-md:text-base data-[placeholder]:text-muted-foreground"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error.join(", ")}</p>}
    </div>
  );
};

export default SelectForm;
