"use client";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as React from "react";
import { format } from "date-fns"
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

type DateTimePickerProps = {
  label: string;
  htmlFor: string;
  error?: string[];
}

export function DateTimePicker({ label, htmlFor, error }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <Input
        name={htmlFor}
        className="hidden"
        id={htmlFor}
        type="text"
        value={date ? +date : 0}
        onChange={() => { }}
      />
      <PopoverTrigger asChild>
        <div>
          <Label htmlFor={htmlFor} className="font-semibold max-md:text-base">
            {label}
          </Label>
          <Input
            className="text-base"
            type="text"
            value={date ? format(date, "PPPP") : ""}
            onChange={() => { }}
            placeholder="Add the expense date"
          />

          {error && <p className="text-red-500 text-sm mt-1">{error.join(", ")}</p>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  )
}
